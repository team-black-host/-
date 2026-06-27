require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, downloadContentFromMessage, jidNormalizedUser, Browsers, delay } = require('@whiskeysockets/baileys');
const P = require('pino');
const { OpenAI } = require('openai');

// Import Commands
const commands = {
    // Original Commands
    song: require('./commands/song'),
    video: require('./commands/video'),
    kick: require('./commands/kick'),
    private: require('./commands/private'),
    public: require('./commands/public'),
    owner: require('./commands/owner'),
    ai: require('./commands/ai'),
    antilink: require('./commands/antilink'),
    anticall: require('./commands/anticall'),
    status: require('./commands/status'),
    antidelete: require('./commands/antidelete'),
    ping: require('./commands/ping'),
    autoreacts: require('./commands/autoreacts'),
    hidetag: require('./commands/hidetag'),
    tagall: require('./commands/tagall'),
    setname: require('./commands/setname'),
    insta: require('./commands/insta'),
    tiktok: require('./commands/tiktok'),
    dp: require('./commands/dp'),
    vv: require('./commands/vv'),
    joke: require('./commands/joke'),
    meme: require('./commands/meme'),
    groupinfo: require('./commands/groupinfo'),
    gdrive: require('./commands/gdrive'),
    mf: require('./commands/mf'),
    translate: require('./commands/translate').handleTranslateCommand,
    autostatus: require('./commands/status'),
    apk: require('./commands/apk'),
    autoread: require('./commands/autoread').autoreadCommand,
    character: require('./commands/character'),
    emojimix: require('./commands/emojimix'),
    facebook: require('./commands/facebook'),
    hack: require('./commands/hack'),
    accept: require('./commands/accept'),

    // All New Commands
    add: require('./commands/add'),
    adopt: require('./commands/adopt'),
    advice: require('./commands/advice'),
    age: require('./commands/age'),
    alive: require('./commands/alive'),
    angry: require('./commands/angry'),
    anime: require('./commands/anime'),
    arrest: require('./commands/arrest'),
    asmaulhusna: require('./commands/asmaulhusna'),
    attack: require('./commands/attack'),
    audioeffects: require('./commands/audioeffects'),
    aura: require('./commands/aura'),
    ayatulqursi: require('./commands/ayatulqursi'),
    azaan: require('./commands/azaan'),
    base64: require('./commands/base64'),
    bgmi: require('./commands/bgmi'),
    bite: require('./commands/bite'),
    blush: require('./commands/blush'),
    bonk: require('./commands/bonk'),
    bully: require('./commands/bully'),
    cat: require('./commands/cat'),
    chid: require('./commands/chid'),
    coinflip: require('./commands/coinflip'),
    colorize: require('./commands/colorize'),
    compatibility: require('./commands/compatibility'),
    compliment: require('./commands/compliment'),
    confused: require('./commands/confused'),
    connect4: require('./commands/connect4'),
    countdown: require('./commands/countdown'),
    cringe: require('./commands/cringe'),
    cry: require('./commands/cry'),
    cuddle: require('./commands/cuddle'),
    currency: require('./commands/currency'),
    cute: require('./commands/cute'),
    dance: require('./commands/dance'),
    dare: require('./commands/dare'),
    define: require('./commands/define'),
    demote: require('./commands/demote'),
    divorce: require('./commands/divorce'),
    dog: require('./commands/dog'),
    duaekunoot: require('./commands/duaekunoot'),
    durood: require('./commands/durood'),
    enhance: require('./commands/enhance'),
    fact: require('./commands/fact'),
    flirt: require('./commands/flirt'),
    follow: require('./commands/follow'),
    font: require('./commands/font'),
    friendship: require('./commands/friendship'),
    fullpp: require('./commands/fullpp'),
    gay: require('./commands/gay'),
    gdesc: require('./commands/gdesc'),
    gf: require('./commands/gf'),
    gif: require('./commands/gif'),
    ginfo: require('./commands/ginfo'),
    gitstalk: require('./commands/gitstalk'),
    glink: require('./commands/glink'),
    glomp: require('./commands/glomp'),
    gname: require('./commands/gname'),
    goodbye: require('./commands/goodbye'),
    google: require('./commands/google'),
    handhold: require('./commands/handhold'),
    handsome: require('./commands/handsome'),
    happy: require('./commands/happy'),
    heart: require('./commands/heart'),
    highfive: require('./commands/highfive'),
    hijri: require('./commands/hijri'),
    hot: require('./commands/hot'),
    hug: require('./commands/hug'),
    imei: require('./commands/imei'),
    instagram: require('./commands/instagram'),
    iq: require('./commands/iq'),
    islamicmonths: require('./commands/islamicmonths'),
    join: require('./commands/join'),
    kalma: require('./commands/kalma'),
    kickall: require('./commands/kickall'),
    kidnap: require('./commands/kidnap'),
    kill: require('./commands/kill'),
    kiss: require('./commands/kiss'),
    lick: require('./commands/lick'),
    listadmins: require('./commands/listadmins'),
    lovetest: require('./commands/lovetest'),
    lyrics: require('./commands/lyrics'),
    marry: require('./commands/marry'),
    math: require('./commands/math'),
    moon: require('./commands/moon'),
    movie: require('./commands/movie'),
    mp3: require('./commands/mp3'),
    mp4: require('./commands/mp4'),
    mute: require('./commands/mute'),
    neko: require('./commands/neko'),
    nom: require('./commands/nom'),
    npm: require('./commands/npm'),
    out: require('./commands/out'),
    pat: require('./commands/pat'),
    pickupline: require('./commands/pickupline'),
    poke: require('./commands/poke'),
    poll: require('./commands/poll'),
    pray: require('./commands/pray'),
    promote: require('./commands/promote'),
    qibla: require('./commands/qibla'),
    qrcode: require('./commands/qrcode'),
    quote: require('./commands/quote'),
    ramadan: require('./commands/ramadan'),
    remini: require('./commands/remini'),
    removebg: require('./commands/removebg'),
    repo: require('./commands/repo'),
    report: require('./commands/report'),
    reportch: require('./commands/reportch'),
    resetlink: require('./commands/resetlink'),
    rich: require('./commands/rich'),
    roast: require('./commands/roast'),
    rob: require('./commands/rob'),
    rps: require('./commands/rps'),
    sad: require('./commands/sad'),
    screenshot: require('./commands/screenshot'),
    setpp: require('./commands/setpp'),
    ship: require('./commands/ship'),
    shoot: require('./commands/shoot'),
    shorten: require('./commands/shorten'),
    shy: require('./commands/shy'),
    simp: require('./commands/simp'),
    slap: require('./commands/slap'),
    smile: require('./commands/smile'),
    smug: require('./commands/smug'),
    spotifysearch: require('./commands/spotifysearch'),
    srepo: require('./commands/srepo'),
    sticker: require('./commands/sticker'),
    sticker2img: require('./commands/sticker2img'),
    surah: require('./commands/surah'),
    tempmail: require('./commands/tempmail'),
    time: require('./commands/time'),
    tomp3: require('./commands/tomp3'),
    truth: require('./commands/truth'),
    tts: require('./commands/tts'),
    ttt: require('./commands/ttt'),
    unbase64: require('./commands/unbase64'),
    unblur: require('./commands/unblur'),
    unmute: require('./commands/unmute'),
    upscale: require('./commands/upscale'),
    waifu: require('./commands/waifu'),
    wave: require('./commands/wave'),
    weather: require('./commands/weather'),
    welcome: require('./commands/welcome'),
    whois: require('./commands/whois'),
    wiki: require('./commands/wiki'),
    wink: require('./commands/wink'),
    wordguess: require('./commands/wordguess'),
    yeet: require('./commands/yeet'),
    ytdl: require('./commands/ytdl'),
    yts: require('./commands/yts'),
};

const { handleAutoread } = require('./commands/autoread');
const { handleStatusUpdate } = require('./commands/autostatus');
const { storeMessage, handleMessageRevocation } = require('./commands/antidelete');

const app = express();
const server = http.createServer(app);

// Telegram Bot Setup
const tgToken = "8662574765:AAEaJTq_sxv6NT0kqfbBB_TDtq3D6jq-4yI";
const tgBot = new TelegramBot(tgToken, { polling: true });

tgBot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === '/start') {
        await tgBot.sendMessage(chatId, 
            "╔══════════════════════════╗\n" +
            "║  🌟 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗛𝗔𝗦𝗡𝗔𝗜𝗡 𝗠𝗨𝗠𝗧𝗔𝗭 𝗕𝗢𝗧 🌟  ║\n" +
            "╚══════════════════════════╝\n\n" +
            "        🤖 𝗚𝗘𝗧 𝗬𝗢𝗨𝗥 𝗕𝗢𝗧 𝗡𝗢𝗪\n\n" +
            "📱 𝗘𝗡𝗧𝗘𝗥 𝗬𝗢𝗨𝗥 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗡𝗨𝗠𝗕𝗘𝗥\n" +
            "┗━━ 𝗘𝘅𝗮𝗺𝗽𝗹𝗲: 𝟵𝟮𝟯𝟬𝟬𝟬𝟬𝟬𝟬𝟬𝟬𝟬\n\n" +
            "✨ 𝗚𝗲𝘁 𝘆𝗼𝘂𝗿 𝗽𝗲𝗿𝘀𝗼𝗻𝗮𝗹 𝗯𝗼𝘁 𝗶𝗻 𝘀𝗲𝗰𝗼𝗻𝗱𝘀!\n\n" +
            "👑 𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 𝗠𝗥. 𝗛𝗔𝗦𝗡𝗔𝗜𝗡 𝗠𝗨𝗠𝗧𝗔𝗭",
            { parse_mode: 'Markdown' }
        );
        return;
    }

    if (/^\d+$/.test(text)) {
        const userId = chatId.toString();
        if (!sessions[userId]) {
            sessions[userId] = new BotSession(userId);
        }
        
        if (!botData.statusSettings[userId]) {
            botData.statusSettings[userId] = { 
                autoStatus: false,
                autoSeen: false,
                autoLike: false,
                autoDownload: false,
                isPublic: false
            };
            saveBotData();
        }

        await tgBot.sendMessage(chatId, 
            "╔══════════════════════════╗\n" +
            "║  ⚡ 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗜𝗡𝗚 𝗣𝗔𝗜𝗥𝗜𝗡𝗚 𝗖𝗢𝗗𝗘 ⚡  ║\n" +
            "╚══════════════════════════╝\n\n" +
            "📱 𝗡𝘂𝗺𝗯𝗲𝗿  ➜  " + text + "\n" +
            "🔄 𝗦𝘁𝗮𝘁𝘂𝘀   ➜  𝗣𝗿𝗼𝗰𝗲𝘀𝘀𝗶𝗻𝗴...\n" +
            "⏳ 𝗧𝗶𝗺𝗲     ➜  𝗣𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁\n\n" +
            "🤖 𝗛𝗔𝗦𝗡𝗔𝗜𝗡 𝗠𝗨𝗠𝗧𝗔𝗭 𝗠𝗗 𝗕𝗢𝗧",
            { parse_mode: 'Markdown' }
        );
        sessions[userId].tgChatId = chatId;
        await sessions[userId].initialize(text);
    }
});

const io = socketIo(server, {
    cors: { origin: "*" },
    transports: ['websocket', 'polling']
});

let openai = null;
if (process.env.OPENAI_API_KEY) {
    try {
        openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            baseURL: process.env.AI_BASE_URL || "https://api.openai.com/v1"
        });
    } catch (e) {}
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const AUTH_DIR = './auth_info';
const DATA_FILE = './data/bot_data.json';
fs.ensureDirSync(AUTH_DIR);
fs.ensureDirSync('./data');

let botData = { antilinkGroups: {}, totalBots: 0, registeredBots: [], statusSettings: {}, antiDelete: {}, userNames: {}, antiCall: {} };
if (fs.existsSync(DATA_FILE)) {
    try { botData = fs.readJsonSync(DATA_FILE); } catch (e) {}
}

function saveBotData() {
    fs.writeJsonSync(DATA_FILE, botData);
}

const sessions = {}; 
const userSockets = {}; 
const messageLogs = {}; 

async function loadExistingSessions() {
    try {
        const authDirs = await fs.readdir(AUTH_DIR);
        for (const userId of authDirs) {
            const authPath = path.join(AUTH_DIR, userId);
            const stats = await fs.stat(authPath);
            if (stats.isDirectory()) {
                const credsFile = path.join(authPath, 'creds.json');
                if (fs.existsSync(credsFile)) {
                    console.log('📂 [System] Found existing session for: ' + userId + '. Initializing...');
                    if (!sessions[userId]) {
                        sessions[userId] = new BotSession(userId);
                        sessions[userId].initialize().catch(err => {
                            console.error('❌ [System] Failed to auto-initialize session ' + userId + ': ' + err.message);
                        });
                    }
                }
            }
        }
    } catch (err) {
        console.error('❌ [System] Error loading existing sessions:', err.message);
    }
}

const toBold = (text) => {
    const boldChars = {
        'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
        'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
        '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
    };
    return text.split('').map(c => boldChars[c] || c).join('');
};

const STYLISH = {
    connected: 
        "╔══════════════════════════╗\n" +
        "║ 🚀 𝗛𝗔𝗦𝗡𝗔𝗜𝗡 𝗠𝗨𝗠𝗧𝗔𝗭 𝗠𝗗 𝗕𝗢𝗧 🚀 ║\n" +
        "╚══════════════════════════╝\n\n" +
        "        ✅ 𝗖𝗢𝗡𝗡𝗘𝗖𝗧𝗘𝗗\n" +
        "      ⚡ 𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟𝗟𝗬\n\n" +
        "🤖 𝗕𝗢𝗧 𝗦𝗧𝗔𝗧𝗨𝗦   ➜  𝗢𝗡𝗟𝗜𝗡𝗘\n" +
        "⚡ 𝗦𝗬𝗦𝗧𝗘𝗠       ➜  𝗔𝗖𝗧𝗜𝗩𝗔𝗧𝗘𝗗\n" +
        "🛡️ 𝗦𝗘𝗥𝗩𝗘𝗥      ➜  𝗥𝗨𝗡𝗡𝗜𝗡𝗚\n" +
        "🔥 𝗠𝗢𝗗𝗨𝗟𝗘𝗦     ➜  𝗔𝗖𝗧𝗜𝗩𝗘\n\n" +
        "📋 𝗧𝘆𝗽𝗲 .𝗺𝗲𝗻𝘂 𝘁𝗼 𝘃𝗶𝗲𝘄 𝗮𝗹𝗹 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀\n\n" +
        "👑 𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 𝗠𝗥. 𝗛𝗔𝗦𝗡𝗔𝗜𝗡 𝗠𝗨𝗠𝗧𝗔𝗭",

    disconnected:
        "╔══════════════════════════╗\n" +
        "║ ⚠️ 𝗛𝗔𝗦𝗡𝗔𝗜𝗡 𝗠𝗨𝗠𝗧𝗔𝗭 𝗠𝗗 𝗕𝗢𝗧 ⚠️ ║\n" +
        "╚══════════════════════════╝\n\n" +
        "        🔴 𝗗𝗜𝗦𝗖𝗢𝗡𝗡𝗘𝗖𝗧𝗘𝗗\n" +
        "      🔄 𝗥𝗘𝗖𝗢𝗡𝗡𝗘𝗖𝗧𝗜𝗡𝗚...\n\n" +
        "🤖 𝗕𝗢𝗧 𝗦𝗧𝗔𝗧𝗨𝗦   ➜  𝗢𝗙𝗙𝗟𝗜𝗡𝗘\n" +
        "⚡ 𝗦𝗬𝗦𝗧𝗘𝗠       ➜  𝗥𝗘𝗦𝗧𝗔𝗥𝗧𝗜𝗡𝗚\n" +
        "🛡️ 𝗦𝗘𝗥𝗩𝗘𝗥      ➜  𝗔𝗖𝗧𝗜𝗩𝗘\n\n" +
        "⏳ 𝗣𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁 𝘄𝗵𝗶𝗹𝗲 𝘄𝗲 𝗿𝗲𝗰𝗼𝗻𝗻𝗲𝗰𝘁...\n\n" +
        "👑 𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 𝗠𝗥. 𝗛𝗔𝗦𝗡𝗔𝗜𝗡 𝗠𝗨𝗠𝗧𝗔𝗭",

    keepAlive:
        "╔══════════════════════════╗\n" +
        "║ 🚀 𝗛𝗔𝗦𝗡𝗔𝗜𝗡 𝗠𝗨𝗠𝗧𝗔𝗭 𝗠𝗗 𝗕𝗢𝗧 🚀 ║\n" +
        "╚══════════════════════════╝\n\n" +
        "        ✅ 𝗔𝗖𝗧𝗜𝗩𝗘 𝟮𝟰/𝟳\n" +
        "      ⚡ 𝗦𝗬𝗦𝗧𝗘𝗠 𝗢𝗡𝗟𝗜𝗡𝗘\n\n" +
        "🤖 𝗕𝗢𝗧 𝗦𝗧𝗔𝗧𝗨𝗦   ➜  𝗥𝗨𝗡𝗡𝗜𝗡𝗚\n" +
        "⚡ 𝗨𝗣𝗧𝗜𝗠𝗘       ➜  𝗔𝗖𝗧𝗜𝗩𝗘\n" +
        "🛡️ 𝗦𝗘𝗖𝗨𝗥𝗜𝗧𝗬    ➜  𝗘𝗡𝗔𝗕𝗟𝗘𝗗\n" +
        "🔥 𝗣𝗘𝗥𝗙𝗢𝗥𝗠𝗔𝗡𝗖𝗘 ➜  𝗢𝗣𝗧𝗜𝗠𝗔𝗟\n\n" +
        "🌟 𝗬𝗼𝘂𝗿 𝗯𝗼𝘁 𝗶𝘀 𝗿𝘂𝗻𝗻𝗶𝗻𝗴 𝘀𝗺𝗼𝗼𝘁𝗵𝗹𝘆!\n\n" +
        "👑 𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 𝗠𝗥. 𝗛𝗔𝗦𝗡𝗔𝗜𝗡 𝗠𝗨𝗠𝗧𝗔𝗭",

    pairingCode:
        "╔══════════════════════════╗\n" +
        "║  🔑 𝗣𝗔𝗜𝗥𝗜𝗡𝗚 𝗖𝗢𝗗𝗘 🔑  ║\n" +
        "╚══════════════════════════╝\n\n" +
        "📱 𝗬𝗢𝗨𝗥 𝗖𝗢𝗗𝗘:\n" +
        "┗━━  [CODE]\n\n" +
        "⚡ 𝗘𝗻𝘁𝗲𝗿 𝘁𝗵𝗶𝘀 𝗰𝗼𝗱𝗲 𝗶𝗻 𝘆𝗼𝘂𝗿 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽\n" +
        "⏰ 𝗖𝗼𝗱𝗲 𝗲𝘅𝗽𝗶𝗿𝗲𝘀 𝗶𝗻 𝟲𝟬 𝘀𝗲𝗰𝗼𝗻𝗱𝘀\n\n" +
        "👑 𝗛𝗔𝗦𝗡𝗔𝗜𝗡 𝗠𝗨𝗠𝗧𝗔𝗭 𝗠𝗗 𝗕𝗢𝗧",

    antiCall:
        "╔══════════════════════════╗\n" +
        "║  🚫 𝗔𝗡𝗧𝗜-𝗖𝗔𝗟𝗟 𝗔𝗖𝗧𝗜𝗩𝗘 🚫  ║\n" +
        "╚══════════════════════════╝\n\n" +
        "⚠️ 𝗜 𝗱𝗼𝗻'𝘁 𝗮𝗰𝗰𝗲𝗽𝘁 𝗰𝗮𝗹𝗹𝘀!\n" +
        "💬 𝗣𝗹𝗲𝗮𝘀𝗲 𝘀𝗲𝗻𝗱 𝗮 𝗺𝗲𝘀𝘀𝗮𝗴𝗲 𝗶𝗻𝘀𝘁𝗲𝗮𝗱.\n\n" +
        "📵 𝗖𝗮𝗹𝗹 𝗔𝘂𝘁𝗼-𝗥𝗲𝗷𝗲𝗰𝘁𝗲𝗱\n\n" +
        "🤖 𝗛𝗔𝗦𝗡𝗔𝗜𝗡 𝗠𝗨𝗠𝗧𝗔𝗭 𝗠𝗗 𝗕𝗢𝗧\n" +
        "👑 𝗕𝗬 𝗠𝗥. 𝗛𝗔𝗦𝗡𝗔𝗜𝗡 𝗠𝗨𝗠𝗧𝗔𝗭",

    sessionExpired:
        "╔══════════════════════════╗\n" +
        "║  🔴 𝗦𝗘𝗦𝗦𝗜𝗢𝗡 𝗘𝗫𝗣𝗜𝗥𝗘𝗗 🔴  ║\n" +
        "╚══════════════════════════╝\n\n" +
        "⚠️ 𝗬𝗼𝘂𝗿 𝘀𝗲𝘀𝘀𝗶𝗼𝗻 𝗵𝗮𝘀 𝗲𝘅𝗽𝗶𝗿𝗲𝗱\n" +
        "🔄 𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗮𝗶𝗿 𝗮𝗴𝗮𝗶𝗻 𝘄𝗶𝘁𝗵 𝗻𝗲𝘄 𝗰𝗼𝗱𝗲\n\n" +
        "📱 𝗘𝗻𝘁𝗲𝗿 𝘆𝗼𝘂𝗿 𝗻𝘂𝗺𝗯𝗲𝗿 𝘁𝗼 𝗿𝗲𝗰𝗼𝗻𝗻𝗲𝗰𝘁\n\n" +
        "👑 𝗛𝗔𝗦𝗡𝗔𝗜𝗡 𝗠𝗨𝗠𝗧𝗔𝗭 𝗠𝗗 𝗕𝗢𝗧"
};

class BotSession {
    constructor(userId) {
        this.userId = userId;
        this.sock = null;
        this.isConnected = false;
        this.aiEnabled = false; 
        this.autoReact = botData.statusSettings[userId]?.autoReact || false;
        this.isPublic = botData.statusSettings[userId]?.isPublic || false; 
        this.authPath = path.join(AUTH_DIR, userId);
        this.processedMessages = new Set();
        this.activeInterval = null;
        this.isInitializing = false;
        this.userChats = {}; 
        this.lastConnectMessageTime = null;
    }

    sendLog(message, type = 'info') {
        const logEntry = { timestamp: new Date().toLocaleTimeString(), message, type };
        const socketId = userSockets[this.userId];
        if (socketId) io.to(socketId).emit('console', logEntry);
        console.log('[' + this.userId + '] ' + message);
    }

    sendConnectionStatus() {
        const socketId = userSockets[this.userId];
        if (socketId) {
            io.to(socketId).emit('connection-status', {
                connected: this.isConnected,
                user: this.userId
            });
        }
        io.emit('total-active', Object.values(sessions).filter(s => s.isConnected).length);
    }

    async getAIResponse(userJid, userMessage) {
        if (!openai) return "❌ AI is not configured.";
        try {
            const completion = await openai.chat.completions.create({
                model: process.env.AI_MODEL || "gpt-3.5-turbo",
                messages: [{ role: "system", content: "Helpful assistant." }, { role: "user", content: userMessage }],
                max_tokens: 150
            });
            return completion.choices[0].message.content.trim();
        } catch (error) {
            return "❌ AI Error: " + error.message;
        }
    }

    startActiveCheck() {
        if (this.activeInterval) clearInterval(this.activeInterval);
        this.activeInterval = setInterval(async () => {
            if (this.isConnected && this.sock?.user) {
                try {
                    const botNumber = jidNormalizedUser(this.sock.user.id);
                    await this.sock.sendMessage(botNumber, { text: STYLISH.keepAlive });
                    this.sendLog("✅ Keep-alive: Status message sent successfully", "success");
                } catch (e) {
                    this.sendLog("⚠️ Keep-alive failed: " + e.message, "error");
                }
            }
        }, 60 * 60 * 1000);
    }

    async initialize(pairingNumber = null) {
        if (this.isInitializing) {
            this.sendLog("⏳ Initialization already in progress...", "info");
            return;
        }
        this.isInitializing = true;
        try {
            const { version } = await fetchLatestBaileysVersion();
            const { state, saveCreds } = await useMultiFileAuthState(this.authPath);
            
            this.sock = makeWASocket({
                version,
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, P({ level: 'fatal' })),
                },
                printQRInTerminal: false,
                logger: P({ level: 'fatal' }),
                browser: Browsers.ubuntu('Chrome'),
                syncFullHistory: false,
                shouldSyncHistoryMessage: () => false,
                markOnlineOnConnect: true,
                keepAliveIntervalMs: 30000,
                connectTimeoutMs: 60000,
                defaultQueryTimeoutMs: 60000,
                emitOwnEvents: true,
                retryRequestDelayMs: 5000,
                maxMsgRetryCount: 5,
                linkPreviewImageThumbnailWidth: 192,
                transactionOpts: { maxCommitRetries: 10, delayBetweenTriesMs: 3000 },
                getMessage: async (key) => {
                    if (messageLogs[key.id]) {
                        return { conversation: messageLogs[key.id].text };
                    }
                    return { conversation: '🤖 Bot is active' };
                },
                patchMessageBeforeSending: (message) => {
                    const requiresPatch = !!(
                        message.buttonsMessage ||
                        message.templateMessage ||
                        message.listMessage
                    );
                    if (requiresPatch) {
                        return {
                            viewOnceMessage: {
                                message: {
                                    messageContextInfo: {
                                        deviceListMetadata: {},
                                        deviceListMetadataVersion: 2
                                    },
                                    ...message
                                }
                            }
                        };
                    }
                    return message;
                },
                generateHighQualityLinkPreview: true,
            });

            if (pairingNumber && !state.creds.registered) {
                if (!this.sock.authState.creds.registered) {
                    await delay(3000);
                    try {
                        let code = await this.sock.requestPairingCode(pairingNumber);
                        code = code?.match(/.{1,4}/g)?.join("-") || code;
                        this.sendLog("🔑 Pairing Code Generated: " + code, 'success');
                        if (this.tgChatId) {
                            const pairingMsg = STYLISH.pairingCode.replace('[CODE]', code);
                            await tgBot.sendMessage(this.tgChatId, pairingMsg, { parse_mode: 'Markdown' });
                        }
                        const socketId = userSockets[this.userId];
                        if (socketId) io.to(socketId).emit('pairing-code', code);
                    } catch (err) {
                        this.sendLog("❌ Pairing error: " + err.message, 'error');
                        if (this.tgChatId) {
                            await tgBot.sendMessage(this.tgChatId, 
                                "╔══════════════════════════╗\n" +
                                "║  ❌ 𝗣𝗔𝗜𝗥𝗜𝗡𝗚 𝗘𝗥𝗥𝗢𝗥 ❌  ║\n" +
                                "╚══════════════════════════╝\n\n" +
                                "🔴 𝗘𝗿𝗿𝗼𝗿: " + err.message + "\n\n" +
                                "🔄 𝗣𝗹𝗲𝗮𝘀𝗲 𝘁𝗿𝘆 𝗮𝗴𝗮𝗶𝗻 𝘄𝗶𝘁𝗵 𝘃𝗮𝗹𝗶𝗱 𝗻𝘂𝗺𝗯𝗲𝗿\n\n" +
                                "👑 𝗛𝗔𝗦𝗡𝗔𝗜𝗡 𝗠𝗨𝗠𝗧𝗔𝗭 𝗠𝗗 𝗕𝗢𝗧",
                                { parse_mode: 'Markdown' }
                            );
                        }
                    }
                }
            }

            this.sock.ev.on('creds.update', saveCreds);

            this.sock.ev.on('call', async (calls) => {
                if (botData.antiCall[this.userId]) {
                    for (const call of calls) {
                        if (call.status === 'offer') {
                            try {
                                await this.sock.rejectCall(call.id, call.from);
                                await this.sock.sendMessage(call.from, { text: STYLISH.antiCall });
                            } catch (e) {}
                        }
                    }
                }
            });

            this.sock.ev.on('messages.upsert', async (m) => {
                if (m.type !== 'notify') return;
                
                await Promise.all(m.messages.map(async (msg) => {
                    if (msg.messageStubType === 1 || msg.messageStubType === 2) {
                        this.sendLog('⚠️ Received undecryptable message. Possible session conflict.', 'warning');
                    }

                    try {
                        const from = msg.key.remoteJid;
                        const isMe = msg.key.fromMe;
                        const isGroup = from.endsWith('@g.us');
                        const isStatus = from === 'status@broadcast';
                        
                        const messageContent = msg.message?.ephemeralMessage?.message || msg.message?.viewOnceMessage?.message || msg.message?.viewOnceMessageV2?.message || msg.message;
                        if (!messageContent) return;
                        
                        let type = Object.keys(messageContent)[0];
                        const text = (messageContent.conversation || messageContent.extendedTextMessage?.text || messageContent.imageMessage?.caption || messageContent.videoMessage?.caption || '').trim();

                        if (!isMe && !isStatus) {
                            await handleAutoread(this.sock, msg);
                            await storeMessage(msg);
                        }

                        if (msg.message?.protocolMessage?.type === 0) {
                            await handleMessageRevocation(this.sock, msg);
                            return;
                        }

                        const msgId = msg.key.id;
                        if (this.processedMessages.has(msgId)) return;
                        this.processedMessages.add(msgId);
                        if (this.processedMessages.size > 1000) this.processedMessages.delete(this.processedMessages.values().next().value);

                        if (!isStatus) {
                            let logEntry = { text, type };
                            if (['imageMessage', 'videoMessage', 'audioMessage'].includes(type)) {
                                try {
                                    const mContent = messageContent[type];
                                    if (mContent && (mContent.directPath || mContent.url)) {
                                        const stream = await downloadContentFromMessage(mContent, type.replace('Message', ''));
                                        let buffer = Buffer.from([]);
                                        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
                                        logEntry.buffer = buffer;
                                    }
                                } catch (e) {}
                            }
                            logEntry.pushName = msg.pushName || 'User';
                            messageLogs[msgId] = logEntry;
                            if (Object.keys(messageLogs).length > 2000) delete messageLogs[Object.keys(messageLogs)[0]];
                        }

                        if (this.autoReact && !isMe && !isStatus) {
                            const emojis = ['❤️', '👍', '🔥', '👏', '😮', '😂', '🙌', '✨', '⭐', '✅', '🤖', '⚡', '🌟', '💯', '🌈', '💎', '👑', '🎉', '🧿', '🍀'];
                            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                            try { await this.sock.sendMessage(from, { react: { text: randomEmoji, key: msg.key } }); } catch (e) {}
                        }

                        if (this.aiEnabled && !isMe && !isStatus && !isGroup && text && !text.startsWith('.')) {
                            try {
                                const aiResponse = await this.getAIResponse(from, text);
                                await this.sock.sendMessage(from, { text: aiResponse }, { quoted: msg });
                            } catch (e) {
                                console.error("🤖 AI Auto-Reply Error:", e);
                            }
                        }

                        if (isStatus && !isMe) {
                            await handleStatusUpdate(this.sock, m, botData, this.userId);
                            return;
                        }

                        const botNumber = jidNormalizedUser(this.sock.user.id);
                        const sender = msg.key.participant || from;
                        const isOwner = isMe || sender.includes(botNumber.split('@')[0]);
                        let isAdmin = isOwner;
                        if (!isAdmin && isGroup) {
                            try {
                                const groupMetadata = await this.sock.groupMetadata(from);
                                const participant = groupMetadata.participants.find(p => p.id === sender);
                                isAdmin = participant && (participant.admin === 'admin' || participant.admin === 'superadmin');
                            } catch (e) {
                                isAdmin = false;
                            }
                        }
                        const cmd = text.toLowerCase();
                        const args = text.split(' ').slice(1);
                        const q = args.join(' ');

                        if (isGroup && botData.antiStatusGroups && botData.antiStatusGroups[from] && !isAdmin) {
                            const isStatusMsg = msg.message?.protocolMessage?.type === 0 || 
                                           msg.message?.viewOnceMessage || 
                                           msg.message?.viewOnceMessageV2 ||
                                           msg.message?.viewOnceMessageV2Extension ||
                                           (text && (text.includes('whatsapp.com/channel/') || text.includes('status@broadcast')));
                            if (msg.message?.forwardingScore > 0 || isStatusMsg) {
                                try {
                                    await this.sock.sendMessage(from, { delete: msg.key });
                                    return;
                                } catch (e) {}
                            }
                        }

                        if (isGroup && botData.antilinkGroups[from] && !isAdmin) {
                            const linkPatterns = [/chat.whatsapp.com\//i, /http:\/\//i, /https:\/\//i, /www\./i, /[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/i];
                            if (linkPatterns.some(pattern => pattern.test(text))) {
                                try {
                                    const mode = botData.antilinkGroups[from];
                                    await this.sock.sendMessage(from, { delete: msg.key });
                                    if (mode === 'kick') await this.sock.groupParticipantsUpdate(from, [sender], "remove");
                                } catch (e) {}
                                return;
                            }
                        }

                        if (!this.isPublic && !isOwner) return;

                        if (cmd.startsWith('.')) {
                            const commandName = cmd.slice(1).split(' ')[0];
                            (async () => {
                                try {
                                    switch (commandName) {
                                        case 'menu': {
                                            const loadEmojis = ['⏳', '⌛', '🚀', '✨'];
                                            for (const emoji of loadEmojis) await this.sock.sendMessage(from, { react: { text: emoji, key: msg.key } });
                                            const customName = botData.userNames[this.userId] || msg.pushName || 'User';
                                            const menuText = 
`╭━━━〔 ${toBold("🔥 𝗛𝗔𝗦𝗡𝗔𝗜𝗡 𝗠𝗨𝗠𝗧𝗔𝗭 𝗠𝗗 𝗕𝗢𝗧 🔥")} 〕━━━┈⊷
┃ 👤 ${toBold("𝗨𝘀𝗲𝗿:")} ${customName}
┃ 🤖 ${toBold("𝗦𝘁𝗮𝘁𝘂𝘀:")} ${toBold("𝗢𝗻𝗹𝗶𝗻𝗲 ✅")}
┃ ⚙️ ${toBold("𝗠𝗼𝗱𝗲:")} ${this.isPublic ? toBold('𝗣𝘂𝗯𝗹𝗶𝗰 🌍') : toBold('𝗣𝗿𝗶𝘃𝗮𝘁𝗲 🔐')}
╰━━━━━━━━━━━━━━━━━━┈⊷

╭━━━〔 ${toBold("🛡️ 𝗣𝗥𝗢𝗧𝗘𝗖𝗧𝗜𝗢𝗡")} 〕━━━┈⊷
┃ 🔗 ${toBold(".𝗮𝗻𝘁𝗶𝗹𝗶𝗻𝗸 [𝗼𝗻/𝗼𝗳𝗳/𝗸𝗶𝗰𝗸]")}
┃ 🛡️ ${toBold(".𝗮𝗻𝘁𝗶𝗱𝗲𝗹𝗲𝘁𝗲 [𝗼𝗻/𝗼𝗳𝗳]")}
┃ 📵 ${toBold(".𝗮𝗻𝘁𝗶𝗰𝗮𝗹𝗹 [𝗼𝗻/𝗼𝗳𝗳]")}
┃ 🚫 ${toBold(".𝗮𝗻𝘁𝗶𝘀𝘁𝗮𝘁𝘂𝘀 [𝗼𝗻/𝗼𝗳𝗳]")}
╰━━━━━━━━━━━━━━━━━━┈⊷

╭━━━〔 ${toBold("👑 𝗔𝗗𝗠𝗜𝗡 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦")} 〕━━━┈⊷
┃ 🔒 ${toBold(".𝗽𝗿𝗶𝘃𝗮𝘁𝗲")}
┃ 🌍 ${toBold(".𝗽𝘂𝗯𝗹𝗶𝗰")}
┃ ➕ ${toBold(".𝗮𝗱𝗱 (𝗻𝘂𝗺𝗯𝗲𝗿)")}
┃ 👢 ${toBold(".𝗸𝗶𝗰𝗸")}
┃ 👢 ${toBold(".𝗸𝗶𝗰𝗸𝗮𝗹𝗹")}
┃ 🏷️ ${toBold(".𝗵𝗶𝗱𝗲𝘁𝗮𝗴")}
┃ 📣 ${toBold(".𝘁𝗮𝗴𝗮𝗹𝗹")}
┃ ✏️ ${toBold(".𝘀𝗲𝘁𝗻𝗮𝗺𝗲 (𝗻𝗮𝗺𝗲)")}
┃ 🖼️ ${toBold(".𝘀𝗲𝘁𝗽𝗽")}
┃ 📝 ${toBold(".𝗴𝗱𝗲𝘀𝗰 (𝘁𝗲𝘅𝘁)")}
┃ 🔗 ${toBold(".𝗴𝗹𝗶𝗻𝗸")}
┃ 🔄 ${toBold(".𝗿𝗲𝘀𝗲𝘁𝗹𝗶𝗻𝗸")}
┃ 🔕 ${toBold(".𝗺𝘂𝘁𝗲")}
┃ 🔔 ${toBold(".𝘂𝗻𝗺𝘂𝘁𝗲")}
┃ ⬆️ ${toBold(".𝗽𝗿𝗼𝗺𝗼𝘁𝗲")}
┃ ⬇️ ${toBold(".𝗱𝗲𝗺𝗼𝘁𝗲")}
┃ 📋 ${toBold(".𝗹𝗶𝘀𝘁𝗮𝗱𝗺𝗶𝗻𝘀")}
┃ 👥 ${toBold(".𝗴𝗿𝗼𝘂𝗽𝗶𝗻𝗳𝗼")}
┃ ℹ️ ${toBold(".𝗴𝗶𝗻𝗳𝗼")}
┃ 🚪 ${toBold(".𝗼𝘂𝘁")}
┃ ✅ ${toBold(".𝗮𝗰𝗰𝗲𝗽𝘁")}
┃ 🔗 ${toBold(".𝗷𝗼𝗶𝗻 (𝗹𝗶𝗻𝗸)")}
┃ 👋 ${toBold(".𝗴𝗼𝗼𝗱𝗯𝘆𝗲")}
┃ 👋 ${toBold(".𝘄𝗲𝗹𝗰𝗼𝗺𝗲")}
╰━━━━━━━━━━━━━━━━━━┈⊷

╭━━━〔 ${toBold("⚙️ 𝗦𝗘𝗧𝗧𝗜𝗡𝗚𝗦")} 〕━━━┈⊷
┃ 🤖 ${toBold(".𝗮𝗶 [𝗼𝗻/𝗼𝗳𝗳]")}
┃ ⚡ ${toBold(".𝗮𝘂𝘁𝗼𝗿𝗲𝗮𝗰𝘁𝘀 [𝗼𝗻/𝗼𝗳𝗳]")}
┃ 👀 ${toBold(".𝗮𝘂𝘁𝗼𝗿𝗲𝗮𝗱 [𝗼𝗻/𝗼𝗳𝗳]")}
┃ 📢 ${toBold(".𝘀𝘁𝗮𝘁𝘂𝘀 [𝗼𝗻/𝗼𝗳𝗳/𝘀𝗲𝗲𝗻/𝗹𝗶𝗸𝗲]")}
╰━━━━━━━━━━━━━━━━━━┈⊷

╭━━━〔 ${toBold("📥 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥𝗦")} 〕━━━┈⊷
┃ 🎵 ${toBold(".𝘀𝗼𝗻𝗴 (𝗻𝗮𝗺𝗲)")}
┃ 🎬 ${toBold(".𝘃𝗶𝗱𝗲𝗼 (𝗻𝗮𝗺𝗲)")}
┃ 📸 ${toBold(".𝗶𝗻𝘀𝘁𝗮 (𝘂𝗿𝗹)")}
┃ 📸 ${toBold(".𝗶𝗻𝘀𝘁𝗮𝗴𝗿𝗮𝗺 (𝘂𝗿𝗹)")}
┃ 🎵 ${toBold(".𝘁𝗶𝗸𝘁𝗼𝗸 (𝘂𝗿𝗹)")}
┃ 📘 ${toBold(".𝗳𝗮𝗰𝗲𝗯𝗼𝗼𝗸 (𝘂𝗿𝗹)")}
┃ ☁️ ${toBold(".𝗴𝗱𝗿𝗶𝘃𝗲 (𝘂𝗿𝗹)")}
┃ 📂 ${toBold(".𝗺𝗳 (𝘂𝗿𝗹)")}
┃ 🎵 ${toBold(".𝗺𝗽𝟯 (𝘂𝗿𝗹)")}
┃ 🎬 ${toBold(".𝗺𝗽𝟰 (𝘂𝗿𝗹)")}
┃ 🎵 ${toBold(".𝘆𝘁𝗱𝗹 (𝘂𝗿𝗹)")}
┃ 🔍 ${toBold(".𝘆𝘁𝘀 (𝗻𝗮𝗺𝗲)")}
┃ 📱 ${toBold(".𝗮𝗽𝗸 (𝗻𝗮𝗺𝗲)")}
╰━━━━━━━━━━━━━━━━━━┈⊷

╭━━━〔 ${toBold("🛠️ 𝗧𝗢𝗢𝗟𝗦")} 〕━━━┈⊷
┃ 🌐 ${toBold(".𝘁𝗿𝗮𝗻𝘀𝗹𝗮𝘁𝗲 (𝘁𝗲𝘅𝘁)")}
┃ 😍 ${toBold(".𝗲𝗺𝗼𝗷𝗶𝗺𝗶𝘅 (𝗲𝟭+𝗲𝟮)")}
┃ 🎭 ${toBold(".𝗰𝗵𝗮𝗿𝗮𝗰𝘁𝗲𝗿")}
┃ 🖼️ ${toBold(".𝗱𝗽")}
┃ 🖼️ ${toBold(".𝗳𝘂𝗹𝗹𝗽𝗽")}
┃ 🎥 ${toBold(".𝘃𝘃")}
┃ 🔤 ${toBold(".𝗳𝗼𝗻𝘁 (𝘁𝗲𝘅𝘁)")}
┃ 🎨 ${toBold(".𝗰𝗼𝗹𝗼𝗿𝗶𝘇𝗲")}
┃ 🔍 ${toBold(".𝗲𝗻𝗵𝗮𝗻𝗰𝗲")}
┃ 🖼️ ${toBold(".𝘂𝗽𝘀𝗰𝗮𝗹𝗲")}
┃ 🔍 ${toBold(".𝘂𝗻𝗯𝗹𝘂𝗿")}
┃ 🗑️ ${toBold(".𝗿𝗲𝗺𝗼𝘃𝗲𝗯𝗴")}
┃ 🎨 ${toBold(".𝗿𝗲𝗺𝗶𝗻𝗶")}
┃ 🎵 ${toBold(".𝘁𝗼𝗺𝗽𝟯")}
┃ 🔊 ${toBold(".𝘁𝘁𝘀 (𝘁𝗲𝘅𝘁)")}
┃ 🔊 ${toBold(".𝗮𝘂𝗱𝗶𝗼𝗲𝗳𝗳𝗲𝗰𝘁𝘀")}
┃ 🎵 ${toBold(".𝗹𝘆𝗿𝗶𝗰𝘀 (𝘀𝗼𝗻𝗴)")}
┃ 🎵 ${toBold(".𝘀𝗽𝗼𝘁𝗶𝗳𝘆𝘀𝗲𝗮𝗿𝗰𝗵 (𝘀𝗼𝗻𝗴)")}
┃ 🎬 ${toBold(".𝗺𝗼𝘃𝗶𝗲 (𝗻𝗮𝗺𝗲)")}
┃ 📸 ${toBold(".𝘀𝘁𝗶𝗰𝗸𝗲𝗿")}
┃ 🖼️ ${toBold(".𝘀𝘁𝗶𝗰𝗸𝗲𝗿𝟮𝗶𝗺𝗴")}
┃ 🌐 ${toBold(".𝘀𝗰𝗿𝗲𝗲𝗻𝘀𝗵𝗼𝘁 (𝘂𝗿𝗹)")}
┃ 🔗 ${toBold(".𝗴𝗼𝗼𝗴𝗹𝗲 (𝘀𝗲𝗮𝗿𝗰𝗵)")}
┃ 📖 ${toBold(".𝘄𝗶𝗸𝗶 (𝘁𝗼𝗽𝗶𝗰)")}
┃ 📖 ${toBold(".𝗱𝗲𝗳𝗶𝗻𝗲 (𝘄𝗼𝗿𝗱)")}
┃ 💱 ${toBold(".𝗰𝘂𝗿𝗿𝗲𝗻𝗰𝘆")}
┃ 🌤️ ${toBold(".𝘄𝗲𝗮𝘁𝗵𝗲𝗿 (𝗰𝗶𝘁𝘆)")}
┃ ⏱️ ${toBold(".𝘁𝗶𝗺𝗲")}
┃ 🔗 ${toBold(".𝘀𝗵𝗼𝗿𝘁𝗲𝗻 (𝘂𝗿𝗹)")}
┃ 📧 ${toBold(".𝘁𝗲𝗺𝗽𝗺𝗮𝗶𝗹")}
┃ 📊 ${toBold(".𝗾𝗿𝗰𝗼𝗱𝗲 (𝘁𝗲𝘅𝘁)")}
┃ 🔢 ${toBold(".𝗯𝗮𝘀𝗲𝟲𝟰 (𝘁𝗲𝘅𝘁)")}
┃ 🔢 ${toBold(".𝘂𝗻𝗯𝗮𝘀𝗲𝟲𝟰 (𝘁𝗲𝘅𝘁)")}
┃ 🧮 ${toBold(".𝗺𝗮𝘁𝗵 (𝗲𝘅𝗽𝗿)")}
┃ 📱 ${toBold(".𝗶𝗺𝗲𝗶 (𝗻𝘂𝗺)")}
┃ 📦 ${toBold(".𝗻𝗽𝗺 (𝗽𝗸𝗴)")}
┃ 🐙 ${toBold(".𝗴𝗶𝘁𝘀𝘁𝗮𝗹𝗸 (𝘂𝘀𝗲𝗿)")}
┃ 📦 ${toBold(".𝗿𝗲𝗽𝗼 (𝘂𝗿𝗹)")}
┃ 📦 ${toBold(".𝘀𝗿𝗲𝗽𝗼 (𝘀𝗲𝗮𝗿𝗰𝗵)")}
┃ 👤 ${toBold(".𝘄𝗵𝗼𝗶𝘀 (𝗻𝘂𝗺)")}
╰━━━━━━━━━━━━━━━━━━┈⊷

╭━━━〔 ${toBold("🎮 𝗙𝗨𝗡 & 𝗚𝗔𝗠𝗘𝗦")} 〕━━━┈⊷
┃ 😂 ${toBold(".𝗷𝗼𝗸𝗲")}
┃ 🤣 ${toBold(".𝗺𝗲𝗺𝗲")}
┃ 💻 ${toBold(".𝗵𝗮𝗰𝗸")}
┃ 🎲 ${toBold(".𝗿𝗽𝘀 (𝗿/𝗽/𝘀)")}
┃ 🪙 ${toBold(".𝗰𝗼𝗶𝗻𝗳𝗹𝗶𝗽")}
┃ ❓ ${toBold(".𝘁𝗿𝘂𝘁𝗵")}
┃ 🎯 ${toBold(".𝗱𝗮𝗿𝗲")}
┃ 🔤 ${toBold(".𝘄𝗼𝗿𝗱𝗴𝘂𝗲𝘀𝘀")}
┃ 🔴 ${toBold(".𝗰𝗼𝗻𝗻𝗲𝗰𝘁𝟰")}
┃ ⭕ ${toBold(".𝘁𝘁𝘁")}
┃ ⏱️ ${toBold(".𝗰𝗼𝘂𝗻𝘁𝗱𝗼𝘄𝗻 (𝗻)")}
┃ 📊 ${toBold(".𝗽𝗼𝗹𝗹 (𝗾/𝗮/𝗯)")}
┃ 🐱 ${toBold(".𝗰𝗮𝘁")}
┃ 🐶 ${toBold(".𝗱𝗼𝗴")}
┃ 🐱 ${toBold(".𝗻𝗲𝗸𝗼")}
┃ 🌙 ${toBold(".𝗺𝗼𝗼𝗻")}
╰━━━━━━━━━━━━━━━━━━┈⊷

╭━━━〔 ${toBold("💕 𝗔𝗡𝗜𝗠𝗘 & 𝗔𝗖𝗧𝗜𝗢𝗡𝗦")} 〕━━━┈⊷
┃ 🤗 ${toBold(".𝗵𝘂𝗴")}
┃ 👋 ${toBold(".𝘄𝗮𝘃𝗲")}
┃ 😊 ${toBold(".𝗽𝗮𝘁")}
┃ 😘 ${toBold(".𝗸𝗶𝘀𝘀")}
┃ 👊 ${toBold(".𝘀𝗹𝗮𝗽")}
┃ 👊 ${toBold(".𝗯𝗼𝗻𝗸")}
┃ 🦵 ${toBold(".𝗸𝗶𝗰𝗸")}
┃ 🤝 ${toBold(".𝗵𝗶𝗴𝗵𝗳𝗶𝘃𝗲")}
┃ 🤝 ${toBold(".𝗵𝗮𝗻𝗱𝗵𝗼𝗹𝗱")}
┃ 👅 ${toBold(".𝗹𝗶𝗰𝗸")}
┃ 😠 ${toBold(".𝗯𝗶𝘁𝗲")}
┃ 😡 ${toBold(".𝗮𝘁𝘁𝗮𝗰𝗸")}
┃ 🤗 ${toBold(".𝗰𝘂𝗱𝗱𝗹𝗲")}
┃ 😊 ${toBold(".𝗽𝗼𝗸𝗲")}
┃ 🙈 ${toBold(".𝗻𝗼𝗺")}
┃ 🕺 ${toBold(".𝗱𝗮𝗻𝗰𝗲")}
┃ 😊 ${toBold(".𝘀𝗺𝗶𝗹𝗲")}
┃ 😭 ${toBold(".𝗰𝗿𝘆")}
┃ 😢 ${toBold(".𝘀𝗮𝗱")}
┃ 😳 ${toBold(".𝗯𝗹𝘂𝘀𝗵")}
┃ 😎 ${toBold(".𝘀𝗺𝘂𝗴")}
┃ 😠 ${toBold(".𝗮𝗻𝗴𝗿𝘆")}
┃ 😄 ${toBold(".𝗵𝗮𝗽𝗽𝘆")}
┃ 😳 ${toBold(".𝘀𝗵𝘆")}
┃ 😖 ${toBold(".𝗰𝗿𝗶𝗻𝗴𝗲")}
┃ 😕 ${toBold(".𝗰𝗼𝗻𝗳𝘂𝘀𝗲𝗱")}
┃ ❤️ ${toBold(".𝗵𝗲𝗮𝗿𝘁")}
┃ 😉 ${toBold(".𝘄𝗶𝗻𝗸")}
┃ 🐱 ${toBold(".𝘄𝗮𝗶𝗳𝘂")}
┃ 🎌 ${toBold(".𝗮𝗻𝗶𝗺𝗲")}
┃ 😊 ${toBold(".𝗴𝗹𝗼𝗺𝗽")}
┃ 🎉 ${toBold(".𝘆𝗲𝗲𝘁")}
╰━━━━━━━━━━━━━━━━━━┈⊷

╭━━━〔 ${toBold("😄 𝗦𝗢𝗖𝗜𝗔𝗟 𝗙𝗨𝗡")} 〕━━━┈⊷
┃ ❤️ ${toBold(".𝗹𝗼𝘃𝗲𝘁𝗲𝘀𝘁 @𝘂𝘀𝗲𝗿")}
┃ 💑 ${toBold(".𝗰𝗼𝗺𝗽𝗮𝘁𝗶𝗯𝗶𝗹𝗶𝘁𝘆 @𝘂𝘀𝗲𝗿")}
┃ 💍 ${toBold(".𝗺𝗮𝗿𝗿𝘆 @𝘂𝘀𝗲𝗿")}
┃ 💔 ${toBold(".𝗱𝗶𝘃𝗼𝗿𝗰𝗲 @𝘂𝘀𝗲𝗿")}
┃ 👶 ${toBold(".𝗮𝗱𝗼𝗽𝘁 @𝘂𝘀𝗲𝗿")}
┃ 💑 ${toBold(".𝗴𝗳 @𝘂𝘀𝗲𝗿")}
┃ 🚢 ${toBold(".𝘀𝗵𝗶𝗽 @𝘂𝘀𝗲𝗿𝟭 @𝘂𝘀𝗲𝗿𝟮")}
┃ 👫 ${toBold(".𝗳𝗿𝗶𝗲𝗻𝗱𝘀𝗵𝗶𝗽 @𝘂𝘀𝗲𝗿")}
┃ 🤣 ${toBold(".𝗿𝗼𝗮𝘀𝘁 @𝘂𝘀𝗲𝗿")}
┃ 😊 ${toBold(".𝗰𝗼𝗺𝗽𝗹𝗶𝗺𝗲𝗻𝘁 @𝘂𝘀𝗲𝗿")}
┃ 💘 ${toBold(".𝗳𝗹𝗶𝗿𝘁 @𝘂𝘀𝗲𝗿")}
┃ 💬 ${toBold(".𝗽𝗶𝗰𝗸𝘂𝗽𝗹𝗶𝗻𝗲")}
┃ 🧠 ${toBold(".𝗶𝗾 @𝘂𝘀𝗲𝗿")}
┃ 🔞 ${toBold(".𝗮𝗴𝗲 @𝘂𝘀𝗲𝗿")}
┃ 🌈 ${toBold(".𝗴𝗮𝘆 @𝘂𝘀𝗲𝗿")}
┃ 🔥 ${toBold(".𝗵𝗼𝘁 @𝘂𝘀𝗲𝗿")}
┃ 😍 ${toBold(".𝗵𝗮𝗻𝗱𝘀𝗼𝗺𝗲 @𝘂𝘀𝗲𝗿")}
┃ 💰 ${toBold(".𝗿𝗶𝗰𝗵 @𝘂𝘀𝗲𝗿")}
┃ 🪙 ${toBold(".𝗮𝘂𝗿𝗮 @𝘂𝘀𝗲𝗿")}
┃ 😍 ${toBold(".𝗰𝘂𝘁𝗲 @𝘂𝘀𝗲𝗿")}
┃ 🎭 ${toBold(".𝘀𝗶𝗺𝗽 @𝘂𝘀𝗲𝗿")}
┃ 👊 ${toBold(".𝗸𝗶𝗹𝗹 @𝘂𝘀𝗲𝗿")}
┃ 🔫 ${toBold(".𝘀𝗵𝗼𝗼𝘁 @𝘂𝘀𝗲𝗿")}
┃ 🚔 ${toBold(".𝗮𝗿𝗿𝗲𝘀𝘁 @𝘂𝘀𝗲𝗿")}
┃ 😈 ${toBold(".𝗸𝗶𝗱𝗻𝗮𝗽 @𝘂𝘀𝗲𝗿")}
┃ 💸 ${toBold(".𝗿𝗼𝗯 @𝘂𝘀𝗲𝗿")}
┃ 🎮 ${toBold(".𝗯𝗴𝗺𝗶 @𝘂𝘀𝗲𝗿")}
┃ 👶 ${toBold(".𝗰𝗵𝗶𝗱 @𝘂𝘀𝗲𝗿")}
┃ 😄 ${toBold(".𝗳𝗼𝗹𝗹𝗼𝘄 @𝘂𝘀𝗲𝗿")}
┃ 😊 ${toBold(".𝗽𝗿𝗮𝘆 @𝘂𝘀𝗲𝗿")}
┃ 😊 ${toBold(".𝗯𝘂𝗹𝗹𝘆 @𝘂𝘀𝗲𝗿")}
┃ 😄 ${toBold(".𝗮𝗹𝗶𝘃𝗲 @𝘂𝘀𝗲𝗿")}
┃ 💡 ${toBold(".𝗮𝗱𝘃𝗶𝗰𝗲")}
┃ 💬 ${toBold(".𝗾𝘂𝗼𝘁𝗲")}
┃ 🤔 ${toBold(".𝗳𝗮𝗰𝘁")}
┃ 🎲 ${toBold(".𝗴𝗶𝗳 (𝘀𝗲𝗮𝗿𝗰𝗵)")}
╰━━━━━━━━━━━━━━━━━━┈⊷

╭━━━〔 ${toBold("☪️ 𝗜𝗦𝗟𝗔𝗠𝗜𝗖")} 〕━━━┈⊷
┃ 📖 ${toBold(".𝘀𝘂𝗿𝗮𝗵 (𝗻𝘂𝗺)")}
┃ 📿 ${toBold(".𝗮𝘆𝗮𝘁𝘂𝗹𝗾𝘂𝗿𝘀𝗶")}
┃ 📿 ${toBold(".𝗱𝘂𝗮𝗲𝗸𝘂𝗻𝗼𝗼𝘁")}
┃ 📿 ${toBold(".𝗱𝘂𝗿𝗼𝗼𝗱")}
┃ 📿 ${toBold(".𝗸𝗮𝗹𝗺𝗮")}
┃ 📿 ${toBold(".𝗮𝘀𝗺𝗮𝘂𝗹𝗵𝘂𝘀𝗻𝗮")}
┃ 🕌 ${toBold(".𝗮𝘇𝗮𝗮𝗻")}
┃ 🌙 ${toBold(".𝗿𝗮𝗺𝗮𝗱𝗮𝗻")}
┃ 📅 ${toBold(".𝗵𝗶𝗷𝗿𝗶")}
┃ 📅 ${toBold(".𝗶𝘀𝗹𝗮𝗺𝗶𝗰𝗺𝗼𝗻𝘁𝗵𝘀")}
┃ 🧭 ${toBold(".𝗾𝗶𝗯𝗹𝗮 (𝗰𝗶𝘁𝘆)")}
╰━━━━━━━━━━━━━━━━━━┈⊷

╭━━━〔 ${toBold("👤 𝗨𝗦𝗘𝗥 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦")} 〕━━━┈⊷
┃ 👑 ${toBold(".𝗼𝘄𝗻𝗲𝗿")}
┃ 📶 ${toBold(".𝗽𝗶𝗻𝗴")}
┃ 🔖 ${toBold(".𝗿𝗲𝗽𝗼𝗿𝘁 (𝘁𝗲𝘅𝘁)")}
┃ 📢 ${toBold(".𝗿𝗲𝗽𝗼𝗿𝘁𝗰𝗵")}
╰━━━━━━━━━━━━━━━━━━┈⊷

╭━━━〔 ${toBold("🔥 𝗔𝗖𝗧𝗜𝗩𝗘 𝗙𝗘𝗔𝗧𝗨𝗥𝗘𝗦")} 〕━━━┈⊷
┃ 🤖 ${toBold("𝗔𝗜:")} ${this.aiEnabled ? '✅' : '❌'}
┃ ⚡ ${toBold("𝗔𝘂𝘁𝗼-𝗥𝗲𝗮𝗰𝘁:")} ${this.autoReact ? '✅' : '❌'}
┃ 🛡️ ${toBold("𝗔𝗻𝘁𝗶-𝗗𝗲𝗹𝗲𝘁𝗲:")} ${botData.antiDelete[this.userId] ? '✅' : '❌'}
┃ 📢 ${toBold("𝗔𝘂𝘁𝗼-𝗦𝘁𝗮𝘁𝘂𝘀:")} ${(botData.statusSettings[this.userId] && botData.statusSettings[this.userId].autoStatus) ? '✅' : '❌'}
╰━━━━━━━━━━━━━━━━━━┈⊷


╭━━━〔 ${toBold("🌐 𝗢𝗙𝗙𝗜𝗖𝗜𝗔𝗟 𝗖𝗛𝗔𝗡𝗡𝗘𝗟")} 〕━━━┈⊷
┃ 🔗 https://whatsapp.com/channel/0029VbCBrptGJP8E0fYwEb43
╰━━━━━━━━━━━━━━━━━━┈⊷

╭━━━〔 ${toBold("👑 𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬")} 〕━━━┈⊷
┃ 🚀 ${toBold("𝗠𝗥. 𝗛𝗔𝗦𝗡𝗔𝗜𝗡 𝗠𝗨𝗠𝗧𝗔𝗭")}
╰━━━━━━━━━━━━━━━━━━┈⊷`;
                                            try {
                                                await this.sock.sendMessage(from, { image: { url: 'https://mhcloud.kesug.com/images/stc.png' }, caption: menuText });
                                            } catch (e) { await this.sock.sendMessage(from, { text: menuText }); }
                                            break;
                                        }
                                        // === BASIC ===
                                        case 'ping': await commands.ping(this.sock, from, msg); break;
                                        case 'owner': await commands.owner(this.sock, from, msg); break;
                                        case 'ai': await commands.ai(this.sock, from, msg, isAdmin, this, args); break;
                                        case 'alive': await commands.alive(this.sock, from, msg); break;
                                        // === PROTECTION ===
                                        case 'antilink': await commands.antilink(this.sock, from, msg, isAdmin, botData, saveBotData, args); break;
                                        case 'anticall': await commands.anticall(this.sock, from, msg, isAdmin, botData, saveBotData, this.userId, args); break;
                                        case 'antidelete': await commands.antidelete(this.sock, from, msg, isAdmin, botData, saveBotData, this.userId, args); break;
                                        case 'antistatus': await commands.antistatus(this.sock, from, msg, isAdmin, botData, saveBotData, args); break;
                                        // === SETTINGS ===
                                        case 'status': 
                                        case 'autostatus': await commands.autostatus(this.sock, from, msg, isAdmin, botData, saveBotData, this.userId, args); break;
                                        case 'autoreacts': await commands.autoreacts(this.sock, from, msg, isAdmin, this, args); break;
                                        case 'autoread': await commands.autoread(this.sock, from, msg); break;
                                        case 'private': 
                                            await commands.private(this.sock, from, msg, isAdmin, this); 
                                            if (!botData.statusSettings[this.userId]) botData.statusSettings[this.userId] = {};
                                            botData.statusSettings[this.userId].isPublic = false;
                                            saveBotData();
                                            break;
                                        case 'public': 
                                            await commands.public(this.sock, from, msg, isAdmin, this); 
                                            if (!botData.statusSettings[this.userId]) botData.statusSettings[this.userId] = {};
                                            botData.statusSettings[this.userId].isPublic = true;
                                            saveBotData();
                                            break;
                                        // === ADMIN ===
                                        case 'kick': await commands.kick(this.sock, from, msg, isAdmin); break;
                                        case 'kickall': await commands.kickall(this.sock, from, msg, isAdmin); break;
                                        case 'add': await commands.add(this.sock, from, msg, isAdmin, q); break;
                                        case 'hidetag': await commands.hidetag(this.sock, from, msg, isAdmin, q); break;
                                        case 'tagall': await commands.tagall(this.sock, from, msg, isAdmin, q); break;
                                        case 'setname': await commands.setname(this.sock, from, msg, isAdmin, botData, saveBotData, this.userId, q); break;
                                        case 'setpp': await commands.setpp(this.sock, from, msg, isAdmin); break;
                                        case 'gdesc': await commands.gdesc(this.sock, from, msg, isAdmin, q); break;
                                        case 'glink': await commands.glink(this.sock, from, msg, isAdmin); break;
                                        case 'gname': await commands.gname(this.sock, from, msg, isAdmin, q); break;
                                        case 'resetlink': await commands.resetlink(this.sock, from, msg, isAdmin); break;
                                        case 'mute': await commands.mute(this.sock, from, msg, isAdmin); break;
                                        case 'unmute': await commands.unmute(this.sock, from, msg, isAdmin); break;
                                        case 'promote': await commands.promote(this.sock, from, msg, isAdmin); break;
                                        case 'demote': await commands.demote(this.sock, from, msg, isAdmin); break;
                                        case 'listadmins': await commands.listadmins(this.sock, from, msg); break;
                                        case 'groupinfo': await commands.groupinfo(this.sock, from, msg); break;
                                        case 'ginfo': await commands.ginfo(this.sock, from, msg); break;
                                        case 'out': await commands.out(this.sock, from, msg, isAdmin); break;
                                        case 'accept': await commands.accept(this.sock, from, msg, isAdmin); break;
                                        case 'join': await commands.join(this.sock, from, msg, isAdmin, q); break;
                                        case 'goodbye': await commands.goodbye(this.sock, from, msg, isAdmin); break;
                                        case 'welcome': await commands.welcome(this.sock, from, msg, isAdmin); break;
                                        // === DOWNLOADERS ===
                                        case 'song': await commands.song(this.sock, from, msg); break;
                                        case 'video': await commands.video(this.sock, from, msg); break;
                                        case 'insta': case 'ig': await commands.insta(this.sock, from, msg, q); break;
                                        case 'instagram': await commands.instagram(this.sock, from, msg); break;
                                        case 'tiktok': await commands.tiktok(this.sock, from, msg, q); break;
                                        case 'facebook': case 'fb': await commands.facebook(this.sock, from, msg); break;
                                        case 'gdrive': await commands.gdrive(this.sock, from, msg, q); break;
                                        case 'mf': await commands.mf(this.sock, from, msg, q); break;
                                        case 'mp3': await commands.mp3(this.sock, from, msg, q); break;
                                        case 'mp4': await commands.mp4(this.sock, from, msg, q); break;
                                        case 'ytdl': await commands.ytdl(this.sock, from, msg, q); break;
                                        case 'yts': await commands.yts(this.sock, from, msg, q); break;
                                        case 'apk': await commands.apk(this.sock, from, msg); break;
                                        // === TOOLS ===
                                        case 'translate': case 'trt': await commands.translate(this.sock, from, msg); break;
                                        case 'emojimix': await commands.emojimix(this.sock, from, msg); break;
                                        case 'character': await commands.character(this.sock, from, msg); break;
                                        case 'dp': await commands.dp(this.sock, from, msg); break;
                                        case 'fullpp': await commands.fullpp(this.sock, from, msg); break;
                                        case 'vv': await commands.vv(this.sock, from, msg); break;
                                        case 'font': await commands.font(this.sock, from, msg, q); break;
                                        case 'colorize': await commands.colorize(this.sock, from, msg); break;
                                        case 'enhance': await commands.enhance(this.sock, from, msg); break;
                                        case 'upscale': await commands.upscale(this.sock, from, msg); break;
                                        case 'unblur': await commands.unblur(this.sock, from, msg); break;
                                        case 'removebg': await commands.removebg(this.sock, from, msg); break;
                                        case 'remini': await commands.remini(this.sock, from, msg); break;
                                        case 'tomp3': await commands.tomp3(this.sock, from, msg); break;
                                        case 'tts': await commands.tts(this.sock, from, msg, q); break;
                                        case 'audioeffects': await commands.audioeffects(this.sock, from, msg, q); break;
                                        case 'lyrics': await commands.lyrics(this.sock, from, msg, q); break;
                                        case 'spotifysearch': await commands.spotifysearch(this.sock, from, msg, q); break;
                                        case 'movie': await commands.movie(this.sock, from, msg, q); break;
                                        case 'sticker': await commands.sticker(this.sock, from, msg); break;
                                        case 'sticker2img': await commands.sticker2img(this.sock, from, msg); break;
                                        case 'screenshot': await commands.screenshot(this.sock, from, msg, q); break;
                                        case 'google': await commands.google(this.sock, from, msg, q); break;
                                        case 'wiki': await commands.wiki(this.sock, from, msg, q); break;
                                        case 'define': await commands.define(this.sock, from, msg, q); break;
                                        case 'currency': await commands.currency(this.sock, from, msg, q); break;
                                        case 'weather': await commands.weather(this.sock, from, msg, q); break;
                                        case 'time': await commands.time(this.sock, from, msg, q); break;
                                        case 'shorten': await commands.shorten(this.sock, from, msg, q); break;
                                        case 'tempmail': await commands.tempmail(this.sock, from, msg); break;
                                        case 'qrcode': await commands.qrcode(this.sock, from, msg, q); break;
                                        case 'base64': await commands.base64(this.sock, from, msg, q); break;
                                        case 'unbase64': await commands.unbase64(this.sock, from, msg, q); break;
                                        case 'math': await commands.math(this.sock, from, msg, q); break;
                                        case 'imei': await commands.imei(this.sock, from, msg, q); break;
                                        case 'npm': await commands.npm(this.sock, from, msg, q); break;
                                        case 'gitstalk': await commands.gitstalk(this.sock, from, msg, q); break;
                                        case 'repo': await commands.repo(this.sock, from, msg, q); break;
                                        case 'srepo': await commands.srepo(this.sock, from, msg, q); break;
                                        case 'whois': await commands.whois(this.sock, from, msg, q); break;
                                        case 'report': await commands.report(this.sock, from, msg, q); break;
                                        case 'reportch': await commands.reportch(this.sock, from, msg); break;
                                        // === FUN & GAMES ===
                                        case 'joke': await commands.joke(this.sock, from, msg); break;
                                        case 'meme': await commands.meme(this.sock, from, msg); break;
                                        case 'hack': await commands.hack(this.sock, from, msg); break;
                                        case 'rps': await commands.rps(this.sock, from, msg, q); break;
                                        case 'coinflip': await commands.coinflip(this.sock, from, msg); break;
                                        case 'truth': await commands.truth(this.sock, from, msg); break;
                                        case 'dare': await commands.dare(this.sock, from, msg); break;
                                        case 'wordguess': await commands.wordguess(this.sock, from, msg); break;
                                        case 'connect4': await commands.connect4(this.sock, from, msg); break;
                                        case 'ttt': await commands.ttt(this.sock, from, msg); break;
                                        case 'countdown': await commands.countdown(this.sock, from, msg, q); break;
                                        case 'poll': await commands.poll(this.sock, from, msg, q); break;
                                        case 'cat': await commands.cat(this.sock, from, msg); break;
                                        case 'dog': await commands.dog(this.sock, from, msg); break;
                                        case 'neko': await commands.neko(this.sock, from, msg); break;
                                        case 'moon': await commands.moon(this.sock, from, msg); break;
                                        case 'gif': await commands.gif(this.sock, from, msg, q); break;
                                        // === ANIME ACTIONS ===
                                        case 'hug': await commands.hug(this.sock, from, msg); break;
                                        case 'wave': await commands.wave(this.sock, from, msg); break;
                                        case 'pat': await commands.pat(this.sock, from, msg); break;
                                        case 'kiss': await commands.kiss(this.sock, from, msg); break;
                                        case 'slap': await commands.slap(this.sock, from, msg); break;
                                        case 'bonk': await commands.bonk(this.sock, from, msg); break;
                                        case 'highfive': await commands.highfive(this.sock, from, msg); break;
                                        case 'handhold': await commands.handhold(this.sock, from, msg); break;
                                        case 'lick': await commands.lick(this.sock, from, msg); break;
                                        case 'bite': await commands.bite(this.sock, from, msg); break;
                                        case 'attack': await commands.attack(this.sock, from, msg); break;
                                        case 'cuddle': await commands.cuddle(this.sock, from, msg); break;
                                        case 'poke': await commands.poke(this.sock, from, msg); break;
                                        case 'nom': await commands.nom(this.sock, from, msg); break;
                                        case 'dance': await commands.dance(this.sock, from, msg); break;
                                        case 'smile': await commands.smile(this.sock, from, msg); break;
                                        case 'cry': await commands.cry(this.sock, from, msg); break;
                                        case 'sad': await commands.sad(this.sock, from, msg); break;
                                        case 'blush': await commands.blush(this.sock, from, msg); break;
                                        case 'smug': await commands.smug(this.sock, from, msg); break;
                                        case 'angry': await commands.angry(this.sock, from, msg); break;
                                        case 'happy': await commands.happy(this.sock, from, msg); break;
                                        case 'shy': await commands.shy(this.sock, from, msg); break;
                                        case 'cringe': await commands.cringe(this.sock, from, msg); break;
                                        case 'confused': await commands.confused(this.sock, from, msg); break;
                                        case 'heart': await commands.heart(this.sock, from, msg); break;
                                        case 'wink': await commands.wink(this.sock, from, msg); break;
                                        case 'waifu': await commands.waifu(this.sock, from, msg); break;
                                        case 'anime': await commands.anime(this.sock, from, msg, q); break;
                                        case 'glomp': await commands.glomp(this.sock, from, msg); break;
                                        case 'yeet': await commands.yeet(this.sock, from, msg); break;
                                        // === SOCIAL FUN ===
                                        case 'lovetest': await commands.lovetest(this.sock, from, msg); break;
                                        case 'compatibility': await commands.compatibility(this.sock, from, msg); break;
                                        case 'marry': await commands.marry(this.sock, from, msg); break;
                                        case 'divorce': await commands.divorce(this.sock, from, msg); break;
                                        case 'adopt': await commands.adopt(this.sock, from, msg); break;
                                        case 'gf': await commands.gf(this.sock, from, msg); break;
                                        case 'ship': await commands.ship(this.sock, from, msg); break;
                                        case 'friendship': await commands.friendship(this.sock, from, msg); break;
                                        case 'roast': await commands.roast(this.sock, from, msg); break;
                                        case 'compliment': await commands.compliment(this.sock, from, msg); break;
                                        case 'flirt': await commands.flirt(this.sock, from, msg); break;
                                        case 'pickupline': await commands.pickupline(this.sock, from, msg); break;
                                        case 'iq': await commands.iq(this.sock, from, msg); break;
                                        case 'age': await commands.age(this.sock, from, msg); break;
                                        case 'gay': await commands.gay(this.sock, from, msg); break;
                                        case 'hot': await commands.hot(this.sock, from, msg); break;
                                        case 'handsome': await commands.handsome(this.sock, from, msg); break;
                                        case 'rich': await commands.rich(this.sock, from, msg); break;
                                        case 'aura': await commands.aura(this.sock, from, msg); break;
                                        case 'cute': await commands.cute(this.sock, from, msg); break;
                                        case 'simp': await commands.simp(this.sock, from, msg); break;
                                        case 'kill': await commands.kill(this.sock, from, msg); break;
                                        case 'shoot': await commands.shoot(this.sock, from, msg); break;
                                        'arrest': await commands.arrest(this.sock, from, msg); break;
                                        case 'kidnap': await commands.kidnap(this.sock, from, msg); break;
                                        case 'rob': await commands.rob(this.sock, from, msg); break;
                                        case 'bgmi': await commands.bgmi(this.sock, from, msg); break;
                                        case 'chid': await commands.chid(this.sock, from, msg); break;
                                        case 'follow': await commands.follow(this.sock, from, msg); break;
                                        case 'pray': await commands.pray(this.sock, from, msg); break;
                                        case 'bully': await commands.bully(this.sock, from, msg); break;
                                        case 'advice': await commands.advice(this.sock, from, msg); break;
                                        case 'quote': await commands.quote(this.sock, from, msg); break;
                                        case 'fact': await commands.fact(this.sock, from, msg); break;
                                        // === ISLAMIC ===
                                        case 'surah': await commands.surah(this.sock, from, msg, q); break;
                                        case 'ayatulqursi': await commands.ayatulqursi(this.sock, from, msg); break;
                                        case 'duaekunoot': await commands.duaekunoot(this.sock, from, msg); break;
                                        case 'durood': await commands.durood(this.sock, from, msg); break;
                                        case 'kalma': await commands.kalma(this.sock, from, msg); break;
                                        case 'asmaulhusna': await commands.asmaulhusna(this.sock, from, msg); break;
                                        case 'azaan': await commands.azaan(this.sock, from, msg); break;
                                        case 'ramadan': await commands.ramadan(this.sock, from, msg); break;
                                        case 'hijri': await commands.hijri(this.sock, from, msg); break;
                                        case 'islamicmonths': await commands.islamicmonths(this.sock, from, msg); break;
                                        case 'qibla': await commands.qibla(this.sock, from, msg, q); break;
                                    }
                                } catch (e) {
                                    this.sendLog("❌ Command error (" + commandName + "): " + e.message, 'error');
                                }
                            })();
                        }
                    } catch (e) {
                        console.error('❌ Message Processing Error:', e);
                    }
                }));
            });

            this.sock.ev.on('connection.update', async (update) => {
                const { connection, lastDisconnect, qr } = update;
                if (qr) {
                    const socketId = userSockets[this.userId];
                    if (socketId) io.to(socketId).emit('qr', qr);
                }

                if (connection === 'close') {
                    const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut;
                    this.isConnected = false;
                    this.isInitializing = false;
                    this.sendLog("⚠️ Connection closed. Reconnecting: " + shouldReconnect, 'warning');
                    this.sendConnectionStatus();
                    const statusCode = (lastDisconnect.error)?.output?.statusCode;
                    
                    if (statusCode === DisconnectReason.loggedOut || statusCode === 401) {
                        this.sendLog('🔴 Session expired or logged out. Clearing auth data for fresh pairing...', 'error');
                        try {
                            const botNumber = jidNormalizedUser(this.sock.user.id);
                            await this.sock.sendMessage(botNumber, { text: STYLISH.disconnected });
                        } catch (e) {}
                        try {
                            if (fs.existsSync(this.authPath)) {
                                const backupPath = this.authPath + '_backup_' + Date.now();
                                fs.moveSync(this.authPath, backupPath);
                                this.sendLog("📦 Corrupted session backed up to " + backupPath, 'info');
                            }
                        } catch (e) {
                            if (fs.existsSync(this.authPath)) fs.removeSync(this.authPath);
                        }
                        delete sessions[this.userId];
                        this.sendConnectionStatus();
                    } else if (statusCode === DisconnectReason.restartRequired || statusCode === DisconnectReason.connectionLost || statusCode === 428) {
                        this.sendLog("🔄 Connection issue (" + statusCode + "). Restarting in 3s...", 'warning');
                        setTimeout(() => this.initialize(), 3000);
                    } else if (statusCode === 515) {
                        this.sendLog('⚠️ Stream error. Reconnecting immediately...', 'warning');
                        this.initialize();
                    } else {
                        this.sendLog("ℹ️ Connection closed (" + statusCode + "). Reconnecting in 5s...", 'info');
                        setTimeout(() => this.initialize(), 5000);
                    }
                } else if (connection === 'open') {
                    this.isConnected = true;
                    this.isInitializing = false;
                    this.sendLog('✅ Connected successfully!', 'success');
                    this.sendConnectionStatus();
                    this.startActiveCheck();
                    
                    const botNumber = jidNormalizedUser(this.sock.user.id);
                    const botName = botData.userNames[this.userId] || (this.sock.user && this.sock.user.name) || this.userId;
                    
                    if (this.tgChatId) {
                        await tgBot.sendMessage(this.tgChatId, 
                            "╔══════════════════════════╗\n" +
                            "║ ✅ 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗢𝗡𝗡𝗘𝗖𝗧𝗘𝗗 ✅ ║\n" +
                            "╚══════════════════════════╝\n\n" +
                            "🤖 𝗕𝗼𝘁 𝗡𝗮𝗺𝗲  ➜  " + botName + "\n" +
                            "📱 𝗡𝘂𝗺𝗯𝗲𝗿    ➜  " + this.userId + "\n" +
                            "⚡ 𝗦𝘁𝗮𝘁𝘂𝘀     ➜  𝗔𝗰𝘁𝗶𝘃𝗲 & 𝗥𝘂𝗻𝗻𝗶𝗻𝗴\n\n" +
                            "🌟 𝗬𝗼𝘂𝗿 𝗯𝗼𝘁 𝗶𝘀 𝗻𝗼𝘄 𝗮𝗰𝘁𝗶𝘃𝗲 𝗮𝗻𝗱 𝗿𝗲𝗮𝗱𝘆!\n\n" +
                            "👑 𝗛𝗔𝗦𝗡𝗔𝗜𝗡 𝗠𝗨𝗠𝗧𝗔𝗭 𝗠𝗗 𝗕𝗢𝗧",
                            { parse_mode: 'Markdown' }
                        );
                    }

                    this.sendLog("🌟 Bot " + botName + " is online and ready!", 'success');

                    setTimeout(async () => {
                        try {
                            await this.sock.query({
                                tag: 'iq',
                                attrs: { to: '@s.whatsapp.net', type: 'set', xmlns: 'status' },
                                content: [{ tag: 'status', attrs: {}, content: Buffer.from("🌟 IM USING BEST BOT MH TECH MD BOT 🌟", 'utf-8') }]
                            });
                            this.sendLog("✨ Bio updated successfully!", "success");
                        } catch (e) {
                            this.sendLog("⚠️ Bio update failed: " + e.message, "error");
                        }
                    }, 5000);

                    if (!this.lastConnectMessageTime || (Date.now() - this.lastConnectMessageTime > 60 * 60 * 1000)) {
                        await this.sock.sendMessage(botNumber, { text: STYLISH.connected });
                        this.lastConnectMessageTime = Date.now();
                    }
                }
            });

        } catch (err) {
            this.isInitializing = false;
            this.sendLog("❌ Initialization failed: " + err.message + ". Retrying in 10s...", 'error');
            setTimeout(() => this.initialize(), 10000);
        }
    }
}

io.on('connection', (socket) => {
    socket.on('set-user', (userId) => {
        userSockets[userId] = socket.id;
        if (!sessions[userId]) sessions[userId] = new BotSession(userId);
        sessions[userId].sendConnectionStatus();
    });

    socket.on('pair-request', async ({ userId, number }) => {
        if (sessions[userId]) {
            if (!botData.statusSettings[userId]) {
                botData.statusSettings[userId] = { 
                    autoStatus: false,
                    autoSeen: false,
                    autoLike: false,
                    autoDownload: false,
                    isPublic: false
                };
                saveBotData();
            }
            await sessions[userId].initialize(number);
        }
    });

    socket.on('logout', async (userId) => {
        if (sessions[userId]) {
            if (sessions[userId].sock) {
                try { 
                    const botNumber = jidNormalizedUser(sessions[userId].sock.user.id);
                    await sessions[userId].sock.sendMessage(botNumber, { 
                        text: "╔══════════════════════════╗\n" +
                              "║  🔴 𝗕𝗢𝗧 𝗟𝗢𝗚𝗚𝗘𝗗 𝗢𝗨𝗧 🔴  ║\n" +
                              "╚══════════════════════════╝\n\n" +
                              "👋 𝗚𝗼𝗼𝗱𝗯𝘆𝗲!\n" +
                              "🔄 𝗣𝗮𝗶𝗿 𝗮𝗴𝗮𝗶𝗻 𝘁𝗼 𝗿𝗲𝗰𝗼𝗻𝗻𝗲𝗰𝘁\n\n" +
                              "👑 𝗛𝗔𝗦𝗡𝗔𝗜𝗡 𝗠𝗨𝗠𝗧𝗔𝗭 𝗠𝗗 𝗕𝗢𝗧"
                    });
                    await sessions[userId].sock.logout(); 
                } catch (e) {}
            }
            const authPath = path.join(AUTH_DIR, userId);
            if (fs.existsSync(authPath)) fs.removeSync(authPath);
            delete sessions[userId];
            io.emit('total-active', Object.values(sessions).filter(s => s.isConnected).length);
            const socketId = userSockets[userId];
            if (socketId) io.to(socketId).emit('connection-status', { connected: false, user: userId });
        }
    });

    socket.on('disconnect', () => {
        for (const userId in userSockets) {
            if (userSockets[userId] === socket.id) {
                delete userSockets[userId];
                break;
            }
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log('\n' +
    '╔══════════════════════════════════════╗\n' +
    '║   🚀 𝗛𝗔𝗦𝗡𝗔𝗜𝗡 𝗠𝗨𝗠𝗧𝗔𝗭 𝗠𝗗 𝗕𝗢𝗧 𝗦𝗘𝗥𝗩𝗘𝗥 🚀   ║\n' +
    '╠══════════════════════════════════════╣\n' +
    '║  🌐 𝗦𝗲𝗿𝘃𝗲𝗿  ➜  http://localhost:' + PORT + '  ║\n' +
    '║  ⚡ 𝗦𝘁𝗮𝘁𝘂𝘀   ➜  𝗔𝗰𝘁𝗶𝘃𝗲 & 𝗥𝗲𝗮𝗱𝘆       ║\n' +
    '║  🔧 𝗔𝗻𝘁𝗶-𝗦𝗹𝗲𝗲𝗽 ➜  𝗘𝗻𝗮𝗯𝗹𝗲𝗱 (𝟱𝗺𝗶𝗻)   ║\n' +
    '║  👑 𝗣𝗼𝘄𝗲𝗿𝗲𝗱 ➜  𝗠𝗿. 𝗛𝗮𝗻𝗮𝗻         ║\n' +
    '╚══════════════════════════════════════╝\n');
    
    loadExistingSessions();
    
    const APP_URL = process.env.APP_URL || 'http://localhost:' + PORT;
    if (APP_URL) {
        setInterval(async () => {
            try {
                await axios.get(APP_URL);
                console.log('⚡ 𝗔𝗻𝘁𝗶-𝗦𝗹𝗲𝗲𝗽 𝗣𝗶𝗻𝗴 ➜ 𝗦𝗲𝗿𝘃𝗲𝗿 𝗔𝗰𝘁𝗶𝘃𝗲');
            } catch (e) {
                console.log('⚠️ 𝗔𝗻𝘁𝗶-𝗦𝗹𝗲𝗲𝗽 𝗣𝗶𝗻𝗴 ➜ ' + e.message);
            }
        }, 5 * 60 * 1000);
    }
});
