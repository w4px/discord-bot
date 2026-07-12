const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: String,
  serverId: String,
  balance: { type: Number, default: 5000 },
  level: { type: Number, default: 1 },
  experience: { type: Number, default: 0 },
  totalWins: { type: Number, default: 0 },
  totalLosses: { type: Number, default: 0 },
  gamesPlayed: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  lastDaily: Date,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);