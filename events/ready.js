module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log(`✅ تم تسجيل الدخول كـ ${client.user.tag}`);
    client.user.setActivity('الأوامر /help', { type: 'PLAYING' });
  },
};