const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

const countries = [
  { name: 'السعودية', emoji: '🇸🇦', hint: 'أكبر دول الخليج' },
  { name: 'مصر', emoji: '🇪🇬', hint: 'أم الدنيا' },
  { name: 'الإمارات', emoji: '🇦🇪', hint: 'دبي وأبوظبي' },
  { name: 'الكويت', emoji: '🇰🇼', hint: 'دول الخليج الصغيرة' },
  { name: 'قطر', emoji: '🇶🇦', hint: 'الدوحة' },
  { name: 'البحرين', emoji: '🇧🇭', hint: 'جزيرة خليجية' },
  { name: 'عمان', emoji: '🇴🇲', hint: 'مسقط' },
  { name: 'اليمن', emoji: '🇾🇪', hint: 'تعز وصنعاء' }
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('خمن_الدولة')
    .setDescription('خمن الدولة من الرمز')
    .addIntegerOption(option =>
      option.setName('المبلغ')
        .setDescription('المبلغ المراد المراهنة عليه')
        .setRequired(true)),

  async execute(interaction) {
    const betAmount = interaction.options.getInteger('المبلغ');
    const userId = interaction.user.id;
    const serverId = interaction.guild.id;

    if (betAmount <= 0) {
      return interaction.reply({
        content: '❌ المبلغ يجب أن يكون أكثر من صفر',
        ephemeral: true,
      });
    }

    let user = await User.findOne({ userId, serverId });

    if (!user) {
      user = new User({ userId, serverId, balance: 5000 });
      await user.save();
    }

    if (user.balance < betAmount) {
      return interaction.reply({
        content: `❌ رصيدك غير كافي`,
        ephemeral: true,
      });
    }

    const country = countries[Math.floor(Math.random() * countries.length)];
    const embed = new EmbedBuilder()
      .setColor('#FFD700')
      .setTitle('🌍 خمن الدولة')
      .setDescription(`${country.emoji}`)
      .addFields(
        { name: '💡 تلميح', value: country.hint }
      );

    await interaction.reply({ embeds: [embed] });

    const filter = m => m.author.id === userId;
    const collector = interaction.channel.createMessageCollector({ filter, time: 30000, max: 1 });

    collector.on('collect', async message => {
      const correct = message.content === country.name;
      if (correct) {
        user.balance += betAmount * 2;
        user.totalWins += 1;
        message.reply(`✅ صحيح! الدولة هي **${country.name}**\n💰 ربحت **${betAmount * 2}** درهم`);
      } else {
        user.balance -= betAmount;
        user.totalLosses += 1;
        message.reply(`❌ خطأ! الدولة الصحيحة هي **${country.name}**\n💸 خسرت **${betAmount}** درهم`);
      }
      user.gamesPlayed += 1;
      await user.save();
    });
  },
};