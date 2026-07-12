const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

const investments = [
  { name: 'أسهم تقنية', symbol: '📈', riskLevel: 'عالي', reward: [2, 5] },
  { name: 'الذهب', symbol: '🏅', riskLevel: 'منخفض', reward: [1.1, 1.5] },
  { name: 'العملات المشفرة', symbol: '💰', riskLevel: 'جداً عالي', reward: [0.5, 10] },
  { name: 'العقارات', symbol: '🏠', riskLevel: 'منخفض', reward: [1.3, 2] }
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('استثمر')
    .setDescription('استثمر أموالك')
    .addIntegerOption(option =>
      option.setName('المبلغ')
        .setDescription('المبلغ المراد استثماره')
        .setRequired(true)),

  async execute(interaction) {
    const amount = interaction.options.getInteger('المبلغ');
    const userId = interaction.user.id;
    const serverId = interaction.guild.id;

    let user = await User.findOne({ userId, serverId });
    if (!user) {
      user = new User({ userId, serverId, balance: 5000 });
      await user.save();
    }

    if (user.balance < amount) {
      return interaction.reply('❌ رصيدك غير كافي');
    }

    const investment = investments[Math.floor(Math.random() * investments.length)];
    const multiplier = Math.random() * (investment.reward[1] - investment.reward[0]) + investment.reward[0];
    const profit = Math.floor(amount * multiplier);
    const loss = multiplier < 1;

    user.balance -= amount;
    user.balance += profit;

    const embed = new EmbedBuilder()
      .setColor(loss ? '#FF0000' : '#00FF00')
      .setTitle(`${investment.symbol} استثمار في ${investment.name}`)
      .addFields(
        { name: '💵 المبلغ المستثمر', value: `${amount.toLocaleString('ar-SA')} درهم`, inline: true },
        { name: '📊 المضاعف', value: `${multiplier.toFixed(2)}x`, inline: true },
        { name: '⚠️ مستوى الخطر', value: investment.riskLevel, inline: true },
        { name: loss ? '❌ الخسارة' : '✅ الربح', value: `${Math.abs(profit - amount).toLocaleString('ar-SA')} درهم`, inline: false }
      );

    await user.save();
    interaction.reply({ embeds: [embed] });
  },
};