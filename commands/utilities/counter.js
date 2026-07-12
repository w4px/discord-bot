const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

let counterValue = 0;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('عداد')
    .setDescription('نظام العداد')
    .addSubcommand(subcommand =>
      subcommand
        .setName('زيادة')
        .setDescription('زيادة العداد بـ 1'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('إنقاص')
        .setDescription('إنقاص العداد بـ 1'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('عرض')
        .setDescription('عرض قيمة العداد'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('إعادة_تعيين')
        .setDescription('إعادة تعيين العداد')),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'زيادة') {
      counterValue++;
      interaction.reply(`✅ تم الزيادة! العداد الآن: **${counterValue}**`);
    } else if (subcommand === 'إنقاص') {
      counterValue--;
      interaction.reply(`✅ تم الإنقاص! العداد الآن: **${counterValue}**`);
    } else if (subcommand === 'عرض') {
      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('📊 قيمة العداد')
        .setDescription(`**${counterValue}**`);
      interaction.reply({ embeds: [embed] });
    } else if (subcommand === 'إعادة_تعيين') {
      counterValue = 0;
      interaction.reply('✅ تم إعادة تعيين العداد!');
    }
  },
};