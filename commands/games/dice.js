const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('زهر')
    .setDescription('لعبة النرد - توقع الرقم')
    .addIntegerOption(option =>
      option.setName('الرقم')
        .setDescription('اختر رقم من 1 إلى 6')
        .setRequired(true)
        .addChoices(
          { name: '1️⃣ واحد', value: 1 },
          { name: '2️⃣ اثنين', value: 2 },
          { name: '3️⃣ ثلاثة', value: 3 },
          { name: '4️⃣ أربعة', value: 4 },
          { name: '5️⃣ خمسة', value: 5 },
          { name: '6️⃣ ستة', value: 6 }
        ))
    .addIntegerOption(option =>
      option.setName('المبلغ')
        .setDescription('المبلغ المراد المراهنة عليه')
        .setRequired(true)),

  async execute(interaction) {
    const choice = interaction.options.getInteger('الرقم');
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
        content: `❌ رصيدك غير كافي\nرصيدك: ${user.balance.toLocaleString('ar-SA')}`,
        ephemeral: true,
      });
    }

    const dice = Math.floor(Math.random() * 6) + 1;
    const won = choice === dice;

    if (won) {
      user.balance += betAmount * 4; // ربح 4x
      user.totalWins += 1;
    } else {
      user.balance -= betAmount;
      user.totalLosses += 1;
    }

    user.gamesPlayed += 1;
    await user.save();

    const embed = new EmbedBuilder()
      .setColor(won ? '#00FF00' : '#FF0000')
      .setTitle(won ? '🎉 ربحت!' : '😢 خسرت!')
      .addFields(
        { name: '🎲 اختيارك', value: `${choice}`, inline: true },
        { name: '🎲 النتيجة', value: `${dice}`, inline: true },
        { name: '💵 الرهان', value: `${betAmount.toLocaleString('ar-SA')} درهم`, inline: false },
        { name: won ? '✅ الربح' : '❌ الخسارة', value: `${(won ? betAmount * 4 : betAmount).toLocaleString('ar-SA')} درهم`, inline: true },
        { name: '💰 الرصيد الجديد', value: `${user.balance.toLocaleString('ar-SA')} درهم`, inline: true }
      );

    interaction.reply({ embeds: [embed] });
  },
};
