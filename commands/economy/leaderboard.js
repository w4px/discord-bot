const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('🏆 عرض لوحة الأفضليين'),
  async execute(interaction) {
    const serverId = interaction.guild.id;

    try {
      const topUsers = await User.find({ serverId })
        .sort({ balance: -1 })
        .limit(10);

      if (topUsers.length === 0) {
        const embed = new EmbedBuilder()
          .setColor('#FF0000')
          .setTitle('🏆 لوحة الأفضليين')
          .setDescription('لا توجد بيانات حتى الآن');
        return await interaction.reply({ embeds: [embed] });
      }

      let leaderboardText = '';
      topUsers.forEach((user, index) => {
        const medals = ['🥇', '🥈', '🥉'];
        const medal = medals[index] || `${index + 1}.`;
        leaderboardText += `${medal} <@${user.userId}> - **${user.balance}** 🪙\n`;
      });

      const embed = new EmbedBuilder()
        .setColor('#FFD700')
        .setTitle('🏆 لوحة الأفضليين')
        .setDescription(leaderboardText)
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('❌ خطأ:', error);
      const errorEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('❌ حدث خطأ')
        .setDescription('حاول مرة أخرى لاحقاً');
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  },
};