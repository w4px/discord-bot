const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('رول')
    .setDescription('إعطاء أو إزالة رتبة')
    .addSubcommand(subcommand =>
      subcommand
        .setName('إعطاء')
        .setDescription('إعطاء رتبة لعضو')
        .addUserOption(option =>
          option.setName('العضو')
            .setDescription('العضو')
            .setRequired(true))
        .addRoleOption(option =>
          option.setName('الرتبة')
            .setDescription('الرتبة')
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('إزالة')
        .setDescription('إزالة رتبة من عضو')
        .addUserOption(option =>
          option.setName('العضو')
            .setDescription('العضو')
            .setRequired(true))
        .addRoleOption(option =>
          option.setName('الرتبة')
            .setDescription('الرتبة')
            .setRequired(true)))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const target = interaction.options.getUser('العضو');
    const role = interaction.options.getRole('الرتبة');
    const member = await interaction.guild.members.fetch(target.id);

    if (subcommand === 'إعطاء') {
      await member.roles.add(role);
      interaction.reply({
        content: `✅ تم إعطاء رتبة ${role} إلى <@${target.id}>`,
        ephemeral: false,
      });
    } else if (subcommand === 'إزالة') {
      await member.roles.remove(role);
      interaction.reply({
        content: `✅ تم إزالة رتبة ${role} من <@${target.id}>`,
        ephemeral: false,
      });
    }
  },
};
