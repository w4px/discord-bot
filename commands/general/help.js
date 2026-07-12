const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('❓ عرض الأوامر المتاحة'),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor('#0099FF')
      .setTitle('❓ الأوامر المتاحة')
      .addFields(
        {
          name: '⚙️ أوامر الإدارة',
          value: '`/setup` - إعداد السيرفر',
          inline: false,
        },
        {
          name: '💰 أوامر الاقتصاد',
          value: '`/daily` - المكافأة اليومية\n`/balance` - عرض الرصيد\n`/leaderboard` - لوحة الأفضليين',
          inline: false,
        },
        {
          name: '🎮 أوامر الألعاب',
          value: '`/coin` - رمية عملة\n`/dice` - رمية نرد',
          inline: false,
        }
      )
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};