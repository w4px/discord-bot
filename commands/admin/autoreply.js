const { SlashCommandBuilder } = require('discord.js');
const AutoReply = require('../../models/AutoReply');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('رد_تلقائي')
    .setDescription('إضافة رد تلقائي')
    .addSubcommand(subcommand =>
      subcommand
        .setName('إضافة')
        .setDescription('إضافة رد تلقائي جديد')
        .addStringOption(option =>
          option.setName('كلمة_المفتاح')
            .setDescription('الكلمة التي تفعل الرد')
            .setRequired(true))
        .addStringOption(option =>
          option.setName('الرد')
            .setDescription('الرد المطلوب')
            .setRequired(true))
        .addBooleanOption(option =>
          option.setName('منشن')
            .setDescription('هل تريد تنشين الشخص؟')
            .setRequired(false)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('حذف')
        .setDescription('حذف رد تلقائي')
        .addStringOption(option =>
          option.setName('كلمة_المفتاح')
            .setDescription('الكلمة المراد حذف ردها')
            .setRequired(true))),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const serverId = interaction.guild.id;

    if (subcommand === 'إضافة') {
      const trigger = interaction.options.getString('كلمة_المفتاح');
      const response = interaction.options.getString('الرد');
      const mention = interaction.options.getBoolean('منشن') || false;

      const newAutoReply = new AutoReply({
        serverId,
        trigger,
        response,
        mention,
        createdBy: interaction.user.id,
      });

      await newAutoReply.save();
      interaction.reply(`✅ تم إضافة رد تلقائي!\n🔑 الكلمة: **${trigger}**\n💬 الرد: **${response}**`);
    } else if (subcommand === 'حذف') {
      const trigger = interaction.options.getString('كلمة_المفتاح');
      await AutoReply.deleteOne({ serverId, trigger });
      interaction.reply(`✅ تم حذف الرد التلقائي للكلمة: **${trigger}**`);
    }
  },
};