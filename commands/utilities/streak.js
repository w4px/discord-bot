const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ستريك')
    .setDescription('عرض سلسلة يومياتك'),

  async execute(interaction) {
    const userId = interaction.user.id;
    const serverId = interaction.guild.id;

    let user = await User.findOne({ userId, serverId });

    if (!user) {
      user = new User({ userId, serverId, balance: 5000, streak: 0 });
      await user.save();
    }

    const now = new Date();
    const lastDaily = user.lastDaily ? new Date(user.lastDaily) : null;

    if (lastDaily) {
      const daysDiff = Math.floor((now - lastDaily) / (1000 * 60 * 60 * 24));
      if (daysDiff > 1) {
        user.streak = 0;
        await user.save();
      }
    }

    const embed = new EmbedBuilder()
      .setColor('#FFD700')
      .setTitle('🔥 سلسلتك اليومية')
      .setDescription(`🔥 **${user.streak}** يوم متتالي`)
      .addFields(
        { name: 'آخر يومية', value: lastDaily ? `<t:${Math.floor(lastDaily.getTime() / 1000)}:R>` : 'لم تأخذ يومية بعد' }
      );

    interaction.reply({ embeds: [embed] });
  },
};