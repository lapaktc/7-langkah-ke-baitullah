# Langkah Baitullah — MVP + Dashboard Admin

Aplikasi funnel untuk mengubah workbook *Langkah Nyata Menuju Baitullah* menjadi pengalaman online dan lead-management sederhana.

## Fitur
- Landing page
- Registrasi email + password melalui Supabase Auth
- Pengumpulan nama + WhatsApp
- Persetujuan penggunaan data/komunikasi
- 7 langkah refleksi
- Penyimpanan jawaban per pengguna
- Roadmap awal
- **Dashboard Admin/CRM**: total lead, progres, target, pencarian, filter, dan tombol WhatsApp

## Setup
1. Buat project di Supabase.
2. Jalankan seluruh isi `supabase.sql` di SQL Editor.
3. Aktifkan Email Auth di Supabase.
4. Salin `.env.example` menjadi `.env.local`, isi URL dan anon key.
5. `npm install`
6. `npm run dev`
7. Buat akun admin lewat halaman registrasi biasa.
8. Di Supabase SQL Editor, tambahkan email admin:
   `insert into public.admin_users(email) values ('email-anda@example.com');`
9. Buka `/admin` setelah login.
10. Deploy ke Vercel dan masukkan environment variables yang sama.

## Catatan keamanan
- Jangan pernah memasukkan Supabase service-role key ke browser.
- Dashboard menggunakan RLS + tabel `admin_users` untuk membaca data lead.
- Tambahkan Privacy Policy dan mekanisme persetujuan komunikasi sebelum dipakai untuk kampanye nyata.
- Untuk WhatsApp production, gunakan kanal/API resmi bila akan mengirim pesan otomatis.

## Pengembangan berikutnya
- WhatsApp OTP/login tanpa password
- Status CRM manual: New / Follow-up / Interested / Buyer / Community
- Export CSV
- CTA pembelian workbook
- Integrasi WhatsApp resmi/CRM
- Event tracking funnel
- Dashboard statistik konversi
