const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

client.commands = new Collection();
client.cooldowns = new Collection();

// تحميل الأوامر
const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {
  const folderPath = path.join(commandsPath, folder);
  const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(folderPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    }
  }
}

// تحميل الأحداث
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

// الاتصال بـ MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/discord-bot')
  .then(() => console.log('✅ تم الاتصال بـ MongoDB'))
  .catch(err => console.error('❌ خطأ في الاتصال بـ MongoDB:', err));

// Express Server
app.get('/', (req, res) => {
  res.send('🤖 البوت يعمل بنجاح!');
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', bot: client.user?.username || 'not ready' });
});

app.listen(PORT, () => {
  console.log(`✅ Server يستمع على البورت ${PORT}`);
});

// تسجيل الدخول
client.login(process.env.DISCORD_TOKEN);

// معالجة الأخطاء
process.on('unhandledRejection', error => {
  console.error('❌ Unhandled Rejection:', error);
});

process.on('uncaughtException', error => {
  console.error('❌ Uncaught Exception:', error);
});
