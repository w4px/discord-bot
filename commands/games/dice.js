const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dice')
    .setDescription('🎲 رمية نرد'),
  async execute(interaction) {
    const result = Math.floor(Math.random() * 6) + 1;
    const emojis = ['❌', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣'];

    const embed = new EmbedBuilder()
      .setColor('#FF6347')
      .setTitle('🎲 رمية النرد')
      .setDescription(`${emojis[result]} **${result}**`)
      .setThumbnail(interaction.user.displayAvatarURL())
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};