const { WebcastPushConnection } = require('tiktok-live-connector');
const WebSocket = require('ws');
const config = require('./config');

const tiktok = new WebcastPushConnection(config.tiktokUsername);
let ws;

// ✅ Connect ke WebSocket Server
function connectWebSocket() {
  ws = new WebSocket(config.websocketURL);

  ws.on('open', () => {
    console.log(`🔌 WebSocket connected to ${config.websocketURL}`);
  });

  ws.on('error', (err) => {
    console.error('❌ WebSocket error:', err.message);
  });

  ws.on('close', () => {
    console.warn('⚠️ WebSocket closed. Reconnecting in 3s...');
    setTimeout(connectWebSocket, 3000);
  });
}

// ✅ Connect ke TikTok Live
function connectTikTok() {
  tiktok.connect().then(() => {
    console.log(`🟢 Connected to TikTok Live @${config.tiktokUsername}`);
  }).catch(err => {
    console.error('❌ Failed to connect to TikTok:', err.message);
    setTimeout(connectTikTok, 5000);
  });
}

// ✅ Kirim komentar ke server untuk diproses (display, brand, spill)
tiktok.on('chat', data => {
  const user = data.uniqueId || 'unknown';
  const comment = data.comment?.trim() || '';
  const fullComment = `${user}: ${comment}`;
  console.log(`💬 ${fullComment}`);

  const isValid = comment.length > 0 && /\w/.test(comment);
  if (!isValid) return;

  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(comment);
  }
});

connectWebSocket();
connectTikTok();
