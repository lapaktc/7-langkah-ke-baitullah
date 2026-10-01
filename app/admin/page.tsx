'use client'
import {useEffect,useMemo,useState} from 'react'
import {supabaseBrowser} from '../../lib/supabase'

type Lead={id:string;name:string;whatsapp:string;email:string|null;created_at:string;answers?:string[]}
const labels=['Target','Waktu','Tabungan','Ikhtiar','Arah rezeki','Pendamping','Langkah pertama']

export default function Admin(){
 const [leads,setLeads]=useState<Lead[]>([]); const [loading,setLoading]=useState(true); const [error,setError]=useState(''); const [q,setQ]=useState(''); const [status,setStatus]=useState('Semua');
 const s=supabaseBrowser()
 useEffect(()=>{(async()=>{const {data:{user}}=await s.auth.getUser(); if(!user){window.location.href='/';return}
   const {data:p,error:pe}=await s.from('profiles').select('id,name,whatsapp,email,created_at').order('created_at',{ascending:false});
   if(pe){setError(pe.message);setLoading(false);return}
   const ids=(p||[]).map(x=>x.id); let a:any[]=[]; if(ids.length){const r=await s.from('answers').select('user_id,answers').in('user_id',ids); if(r.error){setError(r.error.message)} else a=r.data||[]}
   setLeads((p||[]).map(x=>({...x,answers:a.find(y=>y.user_id===x.id)?.answers||[]}))); setLoading(false)
 })()},[])
 const filtered=useMemo(()=>leads.filter(l=>{const text=`${l.name} ${l.whatsapp} ${l.email||''} ${l.answers?.join(' ')||''}`.toLowerCase(); const match=text.includes(q.toLowerCase()); const progress=l.answers?.length||0; const st=status==='Semua'||(status==='Selesai'&&progress===7)||(status==='Belum selesai'&&progress<7); return match&&st}),[leads,q,status])
 const completed=leads.filter(x=>(x.answers?.length||0)===7).length
 const wa=(n:string)=>`https://wa.me/${n.replace(/^0/,'62').replace(/\D/g,'')}`
 return <div className="wrap"><div className="row" style={{justifyContent:'space-between'}}><div><span className="badge">ADMIN CRM</span><h1>Leads Langkah Baitullah</h1><p className="muted">Pantau pendaftar dan progres 7 langkah.</p></div><button className="btn alt" onClick={()=>s.auth.signOut().then(()=>window.location.href='/')}>Keluar</button></div>
 <div className="grid" style={{gridTemplateColumns:'repeat(3,1fr)',margin:'20px 0'}}><div className="card"><div className="muted">Total lead</div><div className="stat">{leads.length}</div></div><div className="card"><div className="muted">Selesai 7 langkah</div><div className="stat">{completed}</div></div><div className="card"><div className="muted">Belum selesai</div><div className="stat">{leads.length-completed}</div></div></div>
 <div className="card"><div className="row"><input className="input" style={{flex:1,minWidth:220,margin:0}} placeholder="Cari nama, WhatsApp, email..." value={q} onChange={e=>setQ(e.target.value)}/><select className="input" style={{width:180,margin:0}} value={status} onChange={e=>setStatus(e.target.value)}><option>Semua</option><option>Selesai</option><option>Belum selesai</option></select></div><div className="space"/>
 {loading?<p>Memuat data...</p>:error?<div className="error">{error}<br/><small>Pastikan email admin sudah ditambahkan di tabel admin_users dan policy Supabase sudah dijalankan.</small></div>:filtered.length===0?<p className="muted">Belum ada lead yang sesuai.</p>:<div style={{overflowX:'auto'}}><table><thead><tr><th>Nama</th><th>WhatsApp</th><th>Target</th><th>Progress</th><th>Status</th><th>Aksi</th></tr></thead><tbody>{filtered.map(l=>{const p=l.answers?.length||0;return <tr key={l.id}><td><b>{l.name}</b><br/><small>{l.email}</small></td><td>{l.whatsapp}</td><td>{l.answers?.[0]||'—'}</td><td><div className="progress"><div style={{width:`${p/7*100}%`}}/></div><small>{p}/7</small></td><td>{p===7?'Selesai':'Follow-up'}</td><td><a className="btn" href={wa(l.whatsapp)} target="_blank">WhatsApp</a></td></tr>})}</tbody></table></div>}</div>
 <div className="card" style={{marginTop:18}}><h2>7 data yang tersimpan</h2><div className="grid">{labels.map((x,i)=><div key={x}><b>{i+1}. {x}</b><div className="muted">Jawaban pengguna tersimpan di answers[{i}].</div></div>)}</div></div>
 </div>
}
