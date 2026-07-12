const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('💵 عرض رصيدك')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('المستخدم (اختياري)')
        .setRequired(false)
    ),
  async execute(interaction) {
    const targetUser = interaction.options.getUser('user') || interaction.user;
    const userId = targetUser.id;
    const serverId = interaction.guild.id;

    try {
      let user = await User.findOne({ userId, serverId });

      if (!user) {
        user = await User.create({ userId, serverId });
      }

      const embed = new EmbedBuilder()
        .setColor('#FFD700')
        .setTitle(`💵 رصيد ${targetUser.username}`)
        .addFields(
          { name: '💰 الرصيد', value: `${user.balance} 🪙`, inline: true },
          { name: '⭐ المستوى', value: `${user.level}`, inline: true },
          { name: '🏆 الانتصارات', value: `${user.totalWins}`, inline: true },
          { name: '💔 الخسائر', value: `${user.totalLosses}`, inline: true },
          { name: '🔥 الستريك', value: `${user.streak}`, inline: true },
          { name: '📊 الألعاب', value: `${user.gamesPlayed}`, inline: true }
        )
        .setThumbnail(targetUser.displayAvatarURL())
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