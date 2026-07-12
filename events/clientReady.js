const { REST, Routes } = require('discord.js');

module.exports = {
  name: 'clientReady',
  once: true,
  async execute(client) {
    console.log(`✅ البوت جاهز: ${client.user.tag}`);
    
    // تسجيل الأوامر عند بدء التشغيل
    const commands = [];
    client.commands.forEach(cmd => {
      commands.push(cmd.data.toJSON());
    });

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

    try {
      console.log('⏳ جاري تحديث الأوامر...');
      await rest.put(
        Routes.applicationCommands(client.user.id),
        { body: commands }
      );
      console.log(`✅ تم تحديث ${commands.length} أوامر`);
    } catch (error) {
      console.error('❌ خطأ في تحديث الأوامر:', error);
    }
  },
};