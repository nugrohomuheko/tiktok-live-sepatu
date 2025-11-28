// obs-controller.js FINAL REVISI
const { OBSWebSocket } = require('obs-websocket-js');
const config = require('./config');

const obs = new OBSWebSocket();

// ✅ Connect ke OBS
async function connectOBS() {
  try {
    await obs.connect(config.obs.url, config.obs.password || undefined);
    console.log('✅ Terhubung ke OBS!');
  } catch (error) {
    console.error('❌ Gagal terhubung ke OBS:', error.message);
    setTimeout(() => {
      console.log('🔄 Mencoba reconnect ke OBS...');
      connectOBS();
    }, 5000);
  }
}

// 🔌 Reconnect otomatis jika koneksi putus
obs.on('ConnectionClosed', () => {
  console.warn('⚠️ Koneksi OBS terputus. Reconnecting...');
  connectOBS();
});

// 🎬 Ganti scene (dengan batasan 1–50)
async function switchScene(sceneName) {
  const isEtalase = /^Etalase(\d+)$/.test(sceneName);
  if (isEtalase) {
    const num = parseInt(sceneName.replace('Etalase', ''), 10);
    if (num > 50) {
      console.warn(`⛔ Scene ${sceneName} dilewati (etalase > 50)`);
      return;
    }
  }

  try {
    console.log(`➡️ Ganti scene ke: ${sceneName}`);
    await obs.call('SetCurrentProgramScene', { sceneName });

    const { currentProgramSceneName } = await obs.call('GetCurrentProgramScene');
    if (currentProgramSceneName === sceneName) {
      console.log(`🎬 Berhasil switch scene ke: ${sceneName}`);
    } else {
      console.warn(`⚠️ Scene tidak berubah, masih di: ${currentProgramSceneName}`);
    }
  } catch (error) {
    console.error(`❌ Gagal ganti scene ke "${sceneName}":`, error.message);
  }
}

module.exports = {
  connectOBS,
  switchScene,
};
