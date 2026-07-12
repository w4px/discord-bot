const AutoReply = require('../models/AutoReply');

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot) return;

    const autoReplies = await AutoReply.find({ serverId: message.guild.id });

    for (const autoReply of autoReplies) {
      if (message.content.includes(autoReply.trigger)) {
        const response = autoReply.mention 
          ? `${message.author} ${autoReply.response}` 
          : autoReply.response;
        
        message.reply(response);
        return;
      }
    }
  },
};