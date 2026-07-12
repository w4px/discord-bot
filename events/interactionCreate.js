const { InteractionType } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`❌ الأمر ${interaction.commandName} غير موجود`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error('❌ خطأ في تنفيذ الأمر:', error);
      await interaction.reply({
        content: '❌ حدث خطأ في تنفيذ الأمر',
        ephemeral: true,
      });
    }
  },
};