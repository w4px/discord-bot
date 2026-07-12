const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('🔧 إعداد البوت في السيرفر'),
  async execute(interaction) {
    const guild = interaction.guild;
    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle('🔧 جاري إعداد البوت...')
      .setDescription('يرجى الانتظار...');

    await interaction.reply({ embeds: [embed] });

    try {
      // إنشاء الفئات (Categories)
      const categories = [
        { name: '📱 عام', type: ChannelType.GuildCategory },
        { name: '🎮 الألعاب', type: ChannelType.GuildCategory },
        { name: '💰 الاقتصاد', type: ChannelType.GuildCategory },
        { name: '🛡️ الإدارة', type: ChannelType.GuildCategory },
      ];

      const createdCategories = {};

      for (const category of categories) {
        const cat = await guild.channels.create({
          name: category.name,
          type: category.type,
        });
        createdCategories[category.name] = cat.id;
      }

      // إنشاء القنوات
      const channels = [
        { name: '📢-مرحبا', parent: createdCategories['📱 عام'], type: ChannelType.GuildText },
        { name: '💬-عام', parent: createdCategories['📱 عام'], type: ChannelType.GuildText },
        { name: '🎲-ألعاب', parent: createdCategories['🎮 الألعاب'], type: ChannelType.GuildText },
        { name: '🏆-نتائج', parent: createdCategories['🎮 الألعاب'], type: ChannelType.GuildText },
        { name: '💵-محفظة', parent: createdCategories['💰 الاقتصاد'], type: ChannelType.GuildText },
        { name: '📊-إحصائيات', parent: createdCategories['💰 الاقتصاد'], type: ChannelType.GuildText },
        { name: '🔔-إشعارات', parent: createdCategories['🛡️ الإدارة'], type: ChannelType.GuildText },
        { name: '📋-السجل', parent: createdCategories['🛡️ الإدارة'], type: ChannelType.GuildText },
      ];

      for (const channel of channels) {
        await guild.channels.create({
          name: channel.name,
          type: channel.type,
          parent: channel.parent,
        });
      }

      const successEmbed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('✅ تم الإعداد بنجاح!')
        .setDescription('تم إنشاء جميع الفئات والقنوات')
        .addFields(
          { name: '📱 الفئة العامة', value: '3 قنوات', inline: true },
          { name: '🎮 فئة الألعاب', value: '2 قنوات', inline: true },
          { name: '💰 فئة الاقتصاد', value: '2 قنوات', inline: true },
          { name: '🛡️ فئة الإدارة', value: '2 قنوات', inline: true }
        )
        .setTimestamp();

      await interaction.editReply({ embeds: [successEmbed] });
    } catch (error) {
      console.error('❌ خطأ:', error);
      const errorEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('❌ حدث خطأ')
        .setDescription(error.message);
      await interaction.editReply({ embeds: [errorEmbed] });
    }
  },
};