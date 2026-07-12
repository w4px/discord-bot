const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('coin')
    .setDescription('🪙 رمية عملة'),
  async execute(interaction) {
    const result = Math.random() > 0.5 ? 'رؤوس' : 'كتابة';
    const emoji = result === 'رؤوس' ? '👑' : '📄';

    const embed = new EmbedBuilder()
      .setColor('#FFD700')
      .setTitle('🪙 رمية العملة')
      .setDescription(`${emoji} **${result}**`)
      .setThumbnail(interaction.user.displayAvatarURL())
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};