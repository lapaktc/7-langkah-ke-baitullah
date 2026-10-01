'use client'
import {useState} from 'react'
import {supabaseBrowser} from '../lib/supabase'
const steps=[
['Niat','Apa target utama Anda?',['Umrah','Haji']],
['Target waktu','Kapan Anda ingin mulai menargetkan keberangkatan?',['≤ 1 tahun','1–2 tahun','> 2 tahun','Belum menentukan']],
['Komitmen','Apakah Anda sudah memiliki tabungan khusus Baitullah?',['Sudah','Belum']],
['Ikhtiar','Apa yang paling ingin Anda perbaiki?',['Menambah penghasilan','Mengatur pengeluaran','Konsisten menabung','Belajar & meningkatkan kemampuan']],
['Arah rezeki','Apakah Anda sudah memisahkan pos keuangan untuk tujuan Baitullah?',['Sudah','Belum']],
['Pendamping','Apakah Anda ingin punya komunitas/accountability partner?',['Ya','Belum perlu']],
['Langkah pertama','Apa langkah yang siap Anda lakukan minggu ini?',['Mulai tabungan khusus','Hitung target biaya','Tambah aktivitas penghasilan','Kurangi pengeluaran']]
]
export default function Home(){const [mode,setMode]=useState<'home'|'register'>('home');const [name,setName]=useState('');const [wa,setWa]=useState('');const [email,setEmail]=useState('');const [pass,setPass]=useState('');const [consent,setConsent]=useState(false);const [err,setErr]=useState('');
async function register(e:any){e.preventDefault();setErr('');if(!consent){setErr('Mohon setujui penggunaan data untuk akun dan komunikasi.');return}const s=supabaseBrowser();const {data,error}=await s.auth.signUp({email,password:pass,options:{data:{name,whatsapp:wa}}});if(error){setErr(error.message);return}if(data.user){await s.from('profiles').upsert({id:data.user.id,name,whatsapp:wa,email});window.location.href='/roadmap'}}
if(mode==='register')return <div className="wrap"><div className="card" style={{maxWidth:520,margin:'40px auto'}}><h1>Buat akun</h1><p className="muted">Mulai menyusun ikhtiar menuju Baitullah.</p><form onSubmit={register}><label>Nama</label><input className="input" value={name} onChange={e=>setName(e.target.value)} required/><label>WhatsApp</label><input className="input" value={wa} onChange={e=>setWa(e.target.value)} placeholder="08xxxxxxxxxx" required/><label>Email</label><input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/><label>Password</label><input className="input" type="password" value={pass} onChange={e=>setPass(e.target.value)} minLength={6} required/><label className="small"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/> Saya setuju data digunakan untuk akun, pendampingan, dan informasi terkait Langkah Baitullah.</label><div className="space"/>{err&&<div className="error">{err}</div>}<button className="btn">Buat akun & mulai</button><div style={{ marginTop: 16, textAlign: 'center' }}>
  <span className="muted">Sudah punya akun? </span>
  <a href="/login" style={{ fontWeight: 700 }}>
    Login
  </a>
</div></form><div className="space"/><button className="btn alt" onClick={()=>setMode('home')}>Kembali</button></div></div>
return <div className="wrap"><section className="hero"><span className="badge">LANGKAH BAITULLAH</span><h1>Dari Niat, Menjadi Ikhtiar Nyata Menuju Baitullah.</h1><p className="muted">Bukan sekadar ingin. Susun target, tabungan, ikhtiar, dan langkah pertama Anda.</p><button className="btn" onClick={()=>setMode('register')}>Mulai Sekarang</button></section><section className="card"><h2>Bagaimana cara kerjanya?</h2><div className="grid"><p><b>1. Buat akun</b><br/><span className="muted">Nama dan WhatsApp menjadi pintu masuk pendampingan.</span></p><p><b>2. Isi 7 langkah</b><br/><span className="muted">Refleksi singkat berdasarkan alur workbook Langkah Nyata Menuju Baitullah.</span></p><p><b>3. Dapatkan roadmap</b><br/><span className="muted">Hasil membantu Anda melihat langkah yang perlu dikerjakan berikutnya.</span></p></div></section><div className="footer">Langkah Baitullah • “Dari Niat, Menjadi Ikhtiar Nyata Menuju Baitullah.”</div></div>}
