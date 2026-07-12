const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('💰 احصل على مكافأة يومية'),
  async execute(interaction) {
    const userId = interaction.user.id;
    const serverId = interaction.guild.id;
    const dailyReward = 1000;

    try {
      let user = await User.findOne({ userId, serverId });

      if (!user) {
        user = await User.create({
          userId,
          serverId,
          balance: dailyReward,
        });
      } else {
        const now = new Date();
        const lastDaily = user.lastDaily ? new Date(user.lastDaily) : null;

        if (lastDaily && now.getTime() - lastDaily.getTime() < 24 * 60 * 60 * 1000) {
          const hoursLeft = Math.ceil((24 * 60 * 60 * 1000 - (now.getTime() - lastDaily.getTime())) / (60 * 60 * 1000));
          const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('⏰ انتظر قليلاً')
            .setDescription(`الرجاء الانتظار ${hoursLeft} ساعات للمكافأة القادمة`);
          return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        user.balance += dailyReward;
        user.lastDaily = now;
      }

      await user.save();

      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('💰 مكافأة يومية!')
        .setDescription(`حصلت على **${dailyReward}** عملة`)
        .addFields(
          { name: 'رصيدك الحالي', value: `${user.balance}`, inline: true },
          { name: 'العملة', value: '🪙', inline: true }
        )
        .setThumbnail(interaction.user.displayAvatarURL())
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('❌ خطأ:', error);
      const errorEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('❌ حدث خطأ')
        .setDescription('حاول مرة أخرى لاحقاً');
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  },
};