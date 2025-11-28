// Generate Scenese OBS versi 50 Etalase
// node generate-scenes.js

const OBSWebSocket = require('obs-websocket-js').OBSWebSocket;
const fs = require('fs');
const path = require('path');
const config = require('./config');

const obs = new OBSWebSocket();
const VIDEO_FOLDER = path.join(__dirname, 'videos');

async function createSceneIfNotExists(sceneName) {
  try {
    await obs.call('GetSceneItemList', { sceneName });
    console.log(`✅ Scene sudah ada: ${sceneName}`);
  } catch {
    await obs.call('CreateScene', { sceneName });
    console.log(`🎬 Scene dibuat: ${sceneName}`);
  }
}

async function addMediaSource(sceneName, fileName, type) {
  const fullPath = path.join(VIDEO_FOLDER, fileName);
  if (!fs.existsSync(fullPath)) {
    console.warn(`⚠️ File video tidak ditemukan: ${fileName}`);
    return;
  }

  const inputName = `${sceneName}-media`;

  try {
    await obs.call('GetInputSettings', { inputName });
    console.log(`🎞️ Source sudah ada di scene: ${sceneName}`);
  } catch {
    const looping = type === 'Idle';
    const restart = type !== 'Idle';

    await obs.call('CreateInput', {
      sceneName,
      inputName,
      inputKind: 'ffmpeg_source',
      inputSettings: {
        local_file: fullPath,
        looping,
        restart_on_activate: restart,
        close_when_inactive: true,
        is_local_file: true,
      },
    });

    console.log(`➕ Source ditambahkan: ${sceneName} (${fileName})`);
  }
}

async function run() {
  await obs.connect(config.obs.url, config.obs.password || undefined);
  console.log('🔌 Terhubung ke OBS');

  const idleScene = [config.scenes.idle];
  const readyScenes = Object.values(config.scenes.interaksi).filter(Boolean);

  // ❗ Cuma ambil Etalase 1–50 dulu
  const etalaseScenes = Object.entries(config.scenes.etalase)
    .filter(([num]) => Number(num) <= 50)
    .map(([_, scene]) => scene);

  const displayScenes = [
  config.scenes.displayTopScene,
  config.scenes.displayLeftScene,
  config.scenes.displayRightScene,
  config.scenes.displayBottomScene,
];

const brandLainnyaScene = [config.scenes.brandLainnyaScene];

const allScenes = [
  ...idleScene,
  ...readyScenes,
  ...etalaseScenes,
  ...displayScenes,
  ...brandLainnyaScene,
];


  for (const sceneName of allScenes) {
    const type = sceneName === config.scenes.idle
      ? 'Idle'
      : sceneName.startsWith('Etalase')
      ? 'Etalase'
      : 'Ready';

    await createSceneIfNotExists(sceneName);
    await addMediaSource(sceneName, `${sceneName}Video.mp4`, type);
  }

  console.log('✅ Semua scene berhasil digenerate!');
  process.exit();
}

run().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
