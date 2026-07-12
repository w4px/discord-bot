const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('مافيا')
    .setDescription('لعبة المافيا'),

  async execute(interaction) {
    const roles = ['🕵️ محقق', '🔴 مافيا', '👨‍🌾 مدني'];
    const selectedRole = roles[Math.floor(Math.random() * roles.length)];

    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('🎭 لعبة المافيا')
      .setDescription(`دورك المخفي: **${selectedRole}**\n\nساعد فريقك على الفوز!`)
      .addFields(
        { name: '🕵️ المحقق', value: 'يكتشف المافيا', inline: true },
        { name: '🔴 المافيا', value: 'تقضي على المدنيين', inline: true },
        { name: '👨‍🌾 المدني', value: 'يصوت للقضاء على الشرير', inline: true }
      );

    const button = new ButtonBuilder()
      .setCustomId('maffia_confirm')
      .setLabel('✅ فهمت دوري')
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(button);

    interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  },
};