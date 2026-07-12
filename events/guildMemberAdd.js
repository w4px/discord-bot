const { EmbedBuilder } = require('discord.js');
const ServerSettings = require('../models/ServerSettings');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    const settings = await ServerSettings.findOne({ serverId: member.guild.id });
    const welcomeChannel = settings?.welcomeChannel ? member.guild.channels.cache.get(settings.welcomeChannel) : null;

    if (!welcomeChannel) return;

    const embed = new EmbedBuilder()
      .setColor('#FFD700')
      .setTitle('🎉 ترحيباً!')
      .setDescription(`مرحباً ${member} في السيرفر!`)
      .setThumbnail(member.displayAvatarURL())
      .addFields(
        { name: '👤 اسم', value: member.user.username, inline: true },
        { name: '👥 عدد الأعضاء', value: member.guild.memberCount.toString(), inline: true }
      )
      .setFooter({ text: `معرف: ${member.id}` });

    welcomeChannel.send({ 
      content: `${member}`,
      embeds: [embed] 
    });
  },
};
