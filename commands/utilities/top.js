const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('توب')
    .setDescription('عرض أغنى 10 أعضاء'),

  async execute(interaction) {
    const serverId = interaction.guild.id;
    const users = await User.find({ serverId })
      .sort({ balance: -1 })
      .limit(10);

    if (users.length === 0) {
      return interaction.reply({
        content: '❌ لا توجد بيانات بعد',
        ephemeral: true,
      });
    }

    let description = '';
    users.forEach((user, index) => {
      const medals = ['🥇', '🥈', '🥉'];
      const medal = medals[index] || `${index + 1}.`;
      description += `${medal} <@${user.userId}> - **${user.balance.toLocaleString('ar-SA')}** درهم\n`;
    });

    const embed = new EmbedBuilder()
      .setColor('#FFD700')
      .setTitle('🏆 ترتيب الأغنياء')
      .setDescription(description)
      .setFooter({ text: `إجمالي الأعضاء: ${users.length}` });

    interaction.reply({ embeds: [embed] });
  },
};