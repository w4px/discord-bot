module.exports = {
  name: 'guildCreate',
  async execute(guild) {
    console.log(`✅ البوت انضم إلى سيرفر: ${guild.name}`);
  },
};