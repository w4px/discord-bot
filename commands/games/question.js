const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

const questions = [
  { q: 'كم عدد قارات العالم؟', a: '7', reward: 500 },
  { q: 'ما عاصمة فرنسا؟', a: 'باريس', reward: 500 },
  { q: 'كم عدد أيام السنة الميلادية؟', a: '365', reward: 300 },
  { q: 'من هو أول رئيس للولايات المتحدة؟', a: 'جورج واشنطن', reward: 800 },
  { q: 'ما أكبر كوكب في المجموعة الشمسية؟', a: 'المشتري', reward: 600 }
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('سؤال')
    .setDescription('اجب على سؤال واربح أموال'),

  async execute(interaction) {
    const userId = interaction.user.id;
    const serverId = interaction.guild.id;

    let user = await User.findOne({ userId, serverId });
    if (!user) {
      user = new User({ userId, serverId, balance: 5000 });
      await user.save();
    }

    const question = questions[Math.floor(Math.random() * questions.length)];
    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle('❓ سؤال')
      .setDescription(question.q)
      .setFooter({ text: 'لديك 30 ثانية للإجابة' });

    const msg = await interaction.reply({ embeds: [embed], fetchReply: true });

    const filter = m => m.author.id === userId;
    const collector = interaction.channel.createMessageCollector({ filter, time: 30000, max: 1 });

    collector.on('collect', async message => {
      const correct = message.content.toLowerCase() === question.a.toLowerCase();
      if (correct) {
        user.balance += question.reward;
        user.totalWins += 1;
        message.reply(`✅ صحيح!\n💰 +${question.reward} درهم`);
      } else {
        user.totalLosses += 1;
        message.reply(`❌ خطأ! الإجابة الصحيحة: **${question.a}**`);
      }
      user.gamesPlayed += 1;
      await user.save();
    });
  },
};