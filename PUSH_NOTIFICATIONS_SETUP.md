# Setup Push Notification Pettalopo Mobile

## Yang sudah disiapkan dalam aplikasi
- Capacitor Push Notifications untuk meminta izin dan mendaftarkan perangkat Android.
- Token perangkat disimpan pada dokumen `users/{uid}` di field `pushTokens`.
- Channel Android `pettalopo_general` menggunakan suara sistem default.
- Cloud Functions mengirim notifikasi saat dokumen baru dibuat pada `ambalan_chats` dan `pengumuman`.
- Notifikasi chat tidak dikirim kembali ke pengirim.
- Menekan notifikasi membuka halaman Chat, Program Kerja, atau Dashboard sesuai data notifikasi.

## Konfigurasi Firebase Android yang masih wajib
1. Buka Firebase Console untuk project `gen-lang-client-0600130774`.
2. Project settings → Your apps → Add app → Android.
3. Gunakan package ID persis: `id.sch.smpialwasi_maros.ambalan`.
4. Unduh `google-services.json`. File ini tidak disertakan karena harus diterbitkan oleh Firebase Console untuk Android app yang benar.
5. Simpan file itu sebagai `android/app/google-services.json` setelah Android platform dibuat. Build workflow proyek membuat folder Android secara otomatis, jadi file tersebut perlu disediakan ke proses build oleh pengelola proyek sebelum FCM native dapat aktif.

## Deploy Cloud Functions
Project Firebase harus menggunakan paket Blaze untuk Cloud Functions. Setelah Firebase CLI login dan project terpilih:
```bash
npm install -g firebase-tools
firebase login
firebase use gen-lang-client-0600130774
cd functions && npm install && cd ..
firebase deploy --only functions
```

Cloud Functions menggunakan koleksi:
- `ambalan_chats/{messageId}` untuk chat grup.
- `pengumuman/{announcementId}` untuk pengumuman.

Saat ini kode aplikasi yang ditinjau sudah memakai `ambalan_chats`; belum ditemukan penulis/pengelola koleksi `pengumuman`. Trigger pengumuman siap dipakai jika koleksi tersebut dibuat oleh fitur pengumuman.

## Terapkan tema Android setelah sync
Jalankan:
```bash
npx cap sync android
node scripts/configure-android-theme.mjs
```
Script mengatur kedua tema Capacitor yang ditemukan pada `styles.xml/themes.xml`: status bar putih dengan ikon gelap dan navigation bar putih dengan ikon gelap. Script tidak mengubah splash screen maupun ikon aplikasi.

## Batasan
Notifikasi push dapat diterima saat aplikasi ditutup biasa atau layar terkunci. Android dapat menahan notifikasi jika pengguna melakukan Force Stop dari Settings, mencabut izin notifikasi, atau perangkat membatasi aktivitas latar belakang.
