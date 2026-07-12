const mongoose = require('mongoose');

const autoReplySchema = new mongoose.Schema({
  serverId: String,
  trigger: String,
  response: String,
  mention: { type: Boolean, default: false },
  createdBy: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('AutoReply', autoReplySchema);