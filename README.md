# TikTok Live Automation (Pre-recorded System)

## 🧠 Konsep Umum

Sistem ini memungkinkan kamu menjalankan **TikTok Live** yang terlihat seperti live beneran, padahal semua kontennya adalah **video pre-recorded**. Video akan berubah otomatis berdasarkan **komentar penonton**, seperti:

* "spill etalase 3"
* "kok belum dispill min"
* "live bohongan ya?"

---

## ⚖️ Struktur Folder

```
📂 tiktok-live-bot-pro/
├─ config.js
├─ server.js
├─ obs-controller.js
├─ tiktok-listener.js
├─ package.json
├─ /videos → semua video disimpan & dimasukkan ke OBS scene
```

---

## ⚙️ File Konfigurasi (`config.js`)

### TikTok & OBS

```js
tiktokUsername: "yourtiktokusername",
websocketURL: "ws://localhost:XXXX",

obs: {
  url: 'ws://XXX.X.X.X:XXXX',
  password: 'PASSWORD_OBS_WEBSOCKET',
},
```

### Scene Setup

```js
scenes: {
  idle: 'Idle',
  etalase: {
    '1A': 'SpillEtalase1A',
    '1B': 'SpillEtalase1B',
    // dst hingga 12
  },
  interaksi: {
    belum: 'InteraksiBelumSpill',
    diskon: 'InteraksiDiskon',
    // dst sesuai kebutuhan
  },
}
```

### Durasi Video

```js
durasi: {
  etalase: {
    '1A': 57000,
    // dst
  },
  interaksi: {
    belum: 31000,
    // dst
  },
}
```

### Cooldown

```js
cooldown: {
  etalaseA: 5000,
  etalaseB: null,
  interaksi: null,
}
```

### Keyword Trigger

```js
triggers: {
  spillPrefix: "spill etalase"
}
```

---

## 💻 Cara Menjalankan

1. Install dulu dependensi:

```bash
npm install
```

2. Jalankan semua komponen:

```bash
npm start
```

> Ini otomatis jalanin:
>
> * server.js
> * tiktok-listener.js
> * obs-controller.js

---

## 🧪 Uji Coba

1. Buka OBS Studio & aktifkan WebSocket
2. Buat semua scene sesuai `config.js`
3. Mulai live TikTok
4. Kirim komentar:

   * `spill etalase 3`
   * `kak spill dong`
   * `bohong ya ini?`

Sistem akan:

* Menambahkan ke antrian
* Menampilkan interaksi jika cocok
* Lanjut ke SpillEtalaseXB
* Kembali ke Idle kalau antrian kosong

---

## 🔄 Tambah Produk Baru (Etalase)

1. Di `config.js`:

```js
scenes.etalase['13A'] = 'SpillEtalase13A';
scenes.etalase['13B'] = 'SpillEtalase13B';
durasi.etalase['13A'] = 60000;
durasi.etalase['13B'] = 65000;
```

2. Buat scene `SpillEtalase13A` dan `13B` di OBS

---

## 🔄 Tambah Interaksi Baru

1. Di `config.js`:

```js
scenes.interaksi.komentar = 'InteraksiKomentar';
durasi.interaksi.komentar = 28000;
```

2. Di `server.js`:

```js
if (msg.includes('komentar ga dibaca')) {
  addInteraksi('komentar');
}
```

3. Buat scene `InteraksiKomentar` di OBS

---

## 🛠️ Troubleshooting

| Masalah                  | Solusi                           |
| ------------------------ | -------------------------------- |
| Scene tidak berubah      | Cek koneksi OBS WebSocket        |
| Tidak respon komentar    | Cek `tiktokUsername` di config   |
| Komentar tidak dikenali  | Tambah keyword di `server.js`    |
| Tidak lanjut ke etalaseB | Pastikan kode resume sudah aktif |

---

## 🚀 Tips

* Idle scene sebaiknya looping video "nunggu request kakak"
* Interaksi harus terlihat natural
* Bisa digunakan live 24 jam nonstop

---

## 📌 Catatan Akhir

Sistem ini siap pakai. Kalau mau dikembangkan lebih lanjut:

* Auto spill random
* TTS auto reply
* Statistik performa

> Dibangun dengan otak, niat, dan kode bersih. Selamat berjualan bro! 🙏
