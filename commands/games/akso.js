const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('أكسو')
    .setDescription('لعبة أكسو أو دائرة (10 ثواني للاختيار)'),

  async execute(interaction) {
    const choices = ['❌ أكسو', '⭕ دائرة'];
    const correctAnswer = choices[Math.floor(Math.random() * choices.length)];
    let responses = { '❌ أكسو': [], '⭕ دائرة': [] };

    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle('❌ ⭕ لعبة أكسو')
      .setDescription('اختر أكسو أو دائرة!\nلديك 10 ثواني فقط')
      .addFields(
        { name: '⏱️ الوقت المتبقي', value: '10 ثواني' }
      );

    const msg = await interaction.reply({ embeds: [embed], fetchReply: true });

    const filter = (reaction, user) => !user.bot;
    const collector = msg.createReactionCollector({ filter, time: 10000 });

    await msg.react('❌');
    await msg.react('⭕');

    collector.on('collect', (reaction, user) => {
      if (reaction.emoji.name === '❌ أكسو') {
        responses['❌ أكسو'].push(user.id);
      } else if (reaction.emoji.name === '⭕ دائرة') {
        responses['⭕ دائرة'].push(user.id);
      }
    });

    collector.on('end', async () => {
      const winners = responses[correctAnswer].map(id => `<@${id}>`).join(', ') || 'لا أحد';
      const result = new EmbedBuilder()
        .setColor('#FFD700')
        .setTitle('🎉 انتهت اللعبة!')
        .setDescription(`الإجابة الصحيحة: **${correctAnswer}**`)
        .addFields(
          { name: '🏆 الفائزون', value: winners, inline: false }
        );

      await interaction.editReply({ embeds: [result] });
    });
  },
};