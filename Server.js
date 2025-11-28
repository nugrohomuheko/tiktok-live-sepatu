const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const { connectOBS, switchScene } = require('./obs-controller');
const config = require('./config');
const getAllVideoDurations = require('./getVideoDurations');

const {
  scenes,
  durasi,
  brandTriggers = [],
  blacklistBrandTriggers = [],
  displayTopTriggers = [],
  displayLeftTriggers = [],
  displayRightTriggers = [],
  displayBottomTriggers = [],
} = config;

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let isBusy = false;
let lastEtalase = null;
let etalaseEndTime = null;
let pendingComments = [];
const MAX_PENDING = 3;

// Logging
function logToFile(filename, message) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(filename, `[${timestamp}] ${message}\n`);
}
function logSystem(message) {
  console.log(message);
  logToFile('log-system.txt', message);
}
function logKomentar(message) {
  logToFile('log-komentar.txt', message);
}

// Connect OBS
connectOBS();

// Cari scene dan durasi dari etalase
function getEtalaseSceneAndDuration(nomor) {
  const kode = nomor.toString();
  const num = parseInt(kode, 10);

  if (num > 150) {
    logSystem(`⛔ Etalase ${num} diminta, tapi belum tersedia (max 150)`);
    return null;
  }

  const scene = scenes.etalase?.[kode];
  if (!scene) {
    logSystem(`❌ Etalase ${kode} tidak ditemukan di config.scenes.etalase`);
    return null;
  }

  const duration = durasi.etalaseCustom?.[kode] || durasi.etalaseDefault;
  return { scene, duration, code: kode };
}

// Jalankan scene
function runJob(job) {
  isBusy = true;
  logSystem(`▶️ Menjalankan scene: ${job.code}`);
  switchScene(job.scene);

  logSystem(`🕒 Durasi scene "${job.code}": ${job.duration}ms`);

  setTimeout(() => {
    isBusy = false;
    if (job.type === 'etalase') {
      playNext();
    } else {
      switchScene(scenes.idle);
      logSystem('➡️ Interaksi selesai, kembali ke IDLE.');
    }
  }, job.duration);
}

// Proses komentar
function playNext() {
  if (pendingComments.length === 0) {
    switchScene(scenes.idle);
    isBusy = false;
    logSystem('💤 Tidak ada komentar, kembali ke IDLE.');
    return;
  }

  const msg = pendingComments.shift().toLowerCase();
  logSystem(`💬 Komentar: ${msg}`);
  logKomentar(msg);

  // 🔹 Etalase
  const match = msg.match(/(?:spill|liat|lihat|mau lihat|liatin|minta|pengen|tampilkan|no|nomor|et|etalase)?\s*(?:ke-)?\s*(\d{1,3})/i);
  if (match) {
    const nomor = match[1];
    const result = getEtalaseSceneAndDuration(nomor);
    if (result) {
      lastEtalase = result.code;
      etalaseEndTime = Date.now() + result.duration;
      return runJob({ type: 'etalase', ...result });
    } else {
      return playNext();
    }
  }

  // 🔹 Display arah
  if (displayTopTriggers.some(r => r.test(msg))) {
    const scene = scenes.displayTopScene;
    const duration = durasi.display?.top || durasi.interaksiDefault || 5000;
    return runJob({ type: 'interaksi', code: 'displayTop', scene, duration });
  }
  if (displayLeftTriggers.some(r => r.test(msg))) {
    const scene = scenes.displayLeftScene;
    const duration = durasi.display?.left || durasi.interaksiDefault || 5000;
    return runJob({ type: 'interaksi', code: 'displayLeft', scene, duration });
  }
  if (displayRightTriggers.some(r => r.test(msg))) {
    const scene = scenes.displayRightScene;
    const duration = durasi.display?.right || durasi.interaksiDefault || 5000;
    return runJob({ type: 'interaksi', code: 'displayRight', scene, duration });
  }
  if (displayBottomTriggers.some(r => r.test(msg))) {
    const scene = scenes.displayBottomScene;
    const duration = durasi.display?.bottom || durasi.interaksiDefault || 5000;
    return runJob({ type: 'interaksi', code: 'displayBottom', scene, duration });
  }

  // 🚫 Brand blacklist
  if (Array.isArray(blacklistBrandTriggers) && blacklistBrandTriggers.some(r => r.test(msg))) {
    const scene = scenes.brandLainnyaScene;
    const duration = durasi.brandLainnya || 5000;
    return runJob({ type: 'interaksi', code: 'brandLainnya', scene, duration });
  }

  // ✅ Brand ready
  for (const item of brandTriggers) {
    if (item.keyword.test(msg)) {
      const sceneKey = item.scene.replace('Ready', '').toLowerCase();
      const scene = scenes.interaksi?.[sceneKey];
      if (scene) {
        const duration = durasi.interaksi?.[sceneKey] || durasi.interaksiDefault || 5000;
        return runJob({ type: 'interaksi', code: sceneKey, scene, duration });
      }
    }
  }

  // ❓ Tidak cocok apa pun
  playNext();
}

// WebSocket
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    const komentar = message.toString().trim();
    pendingComments.unshift(komentar);
    if (pendingComments.length > MAX_PENDING) pendingComments.pop();
    if (!isBusy) playNext();
  });
});

// Jalankan setelah durasi siap
getAllVideoDurations().then(durations => {
  config.durasi.etalaseCustom = durations.etalaseCustom;
  config.durasi.display = durations.display;
  config.durasi.brandLainnya = durations.brandLainnya;
  config.durasi.interaksi = durations.interaksi;

  server.listen(3000, () => {
    logSystem('🚀 Server berjalan di http://localhost:XXXX');
  });
}).catch(err => {
  console.error("❌ Gagal membaca durasi video:", err);
});
