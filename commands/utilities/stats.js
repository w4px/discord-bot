const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('احصائيات')
    .setDescription('عرض احصائياتك')
    .addUserOption(option =>
      option.setName('العضو')
        .setDescription('عضو (اختياري)')
        .setRequired(false)),

  async execute(interaction) {
    const target = interaction.options.getUser('العضو') || interaction.user;
    let user = await User.findOne({
      userId: target.id,
      serverId: interaction.guild.id,
    });

    if (!user) {
      user = new User({
        userId: target.id,
        serverId: interaction.guild.id,
        balance: 5000,
      });
      await user.save();
    }

    const winRate = user.gamesPlayed > 0 
      ? ((user.totalWins / user.gamesPlayed) * 100).toFixed(2) 
      : '0';

    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle(`📊 احصائيات ${target.username}`)
      .setThumbnail(target.displayAvatarURL())
      .addFields(
        { name: '🎮 الألعاب المُلعوبة', value: user.gamesPlayed.toString(), inline: true },
        { name: '✅ الانتصارات', value: user.totalWins.toString(), inline: true },
        { name: '❌ الخسائر', value: user.totalLosses.toString(), inline: true },
        { name: '📈 نسبة الفوز', value: `${winRate}%`, inline: true },
        { name: '📊 المستوى', value: user.level.toString(), inline: true },
        { name: '⭐ الخبرة', value: user.experience.toString(), inline: true }
      )
      .setFooter({ text: `معرف: ${target.id}` });

    interaction.reply({ embeds: [embed] });
  },
};