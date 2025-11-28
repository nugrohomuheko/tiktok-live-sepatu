const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffprobe = require('ffprobe-static');

// Set path ffprobe
ffmpeg.setFfprobePath(ffprobe.path);

// Fungsi ambil durasi video (ms)
function getDuration(filePath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) return reject(err);
      const seconds = metadata.format.duration || 0;
      resolve(Math.round(seconds * 1000));
    });
  });
}

// Fungsi utama
module.exports = async function getAllVideoDurations() {
  const dir = path.join(__dirname, 'videos');
  const files = fs.readdirSync(dir)
    .filter(f => f.endsWith('.mp4'))
    .sort();

  const durations = {
    etalaseCustom: {},     // etalase nomor
    interaksi: {},         // brandReady
    display: {},           // top, left, right, bottom
    brandLainnya: null     // brand lainnya info
  };

  for (const file of files) {
    const fullPath = path.join(dir, file);

    const matchEtalase = file.match(/^Etalase(\d{1,3})Video\.mp4$/i);
    const matchInteraksi = file.match(/^([A-Za-z0-9]+)ReadyVideo\.mp4$/i);
    const matchDisplay = file.match(/^Display(Top|Left|Right|Bottom)Video\.mp4$/i);
    const matchBrandLainnya = file === 'BrandLainnyaInfo.mp4';

    try {
      if (matchEtalase) {
        const nomor = matchEtalase[1];
        durations.etalaseCustom[nomor] = await getDuration(fullPath);
      } else if (matchInteraksi) {
        const brand = matchInteraksi[1].toLowerCase();
        durations.interaksi[brand] = await getDuration(fullPath);
      } else if (matchDisplay) {
        const pos = matchDisplay[1].toLowerCase();
        durations.display[pos] = await getDuration(fullPath);
      } else if (matchBrandLainnya) {
        durations.brandLainnya = await getDuration(fullPath);
      }
    } catch (err) {
      console.warn(`⚠️ Gagal membaca durasi untuk: ${file}`, err.message);
    }
  }

  return durations;
};
