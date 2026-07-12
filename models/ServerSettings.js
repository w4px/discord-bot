const mongoose = require('mongoose');

const serverSettingsSchema = new mongoose.Schema({
  serverId: String,
  welcomeChannel: String,
  modLogChannel: String,
  prefix: { type: String, default: '!' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ServerSettings', serverSettingsSchema);