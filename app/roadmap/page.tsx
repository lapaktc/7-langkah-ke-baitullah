'use client'

import { useEffect, useState } from 'react'
import { supabaseBrowser } from '../../lib/supabase'

const steps: [string, string, string[]][] = [
  ['Niat', 'Apa target utama Anda?', ['Umrah', 'Haji', 'umrah dan haji']],
  [
    'Target waktu',
    'Kapan Anda ingin mulai menargetkan keberangkatan ke baitullah?',
    ['≤ 1 tahun', '1–2 tahun', '> 2 tahun', 'Belum menentukan']
  ],
  [
    'Komitmen',
    'Apakah Anda sudah memiliki tabungan khusus Baitullah?',
    ['Sudah', 'Belum']
  ],
  [
    'Ikhtiar',
    'Apa yang paling ingin Anda perbaiki?',
    [
      'Menambah penghasilan',
      'Mengatur pengeluaran',
      'Konsisten menabung',
      'Belajar & meningkatkan kemampuan'
    ]
  ],
  [
    'Arah rezeki',
    'Apakah Anda sudah memisahkan pos keuangan untuk tujuan Baitullah?',
    ['Sudah', 'Belum']
  ],
  [
    'Pendamping',
    'Apakah Anda ingin punya komunitas/accountability partner?',
    ['Ya', 'Belum perlu']
  ],
  [
    'Langkah pertama',
    'Apa langkah yang siap Anda lakukan minggu ini?',
    [
      'Mulai tabungan khusus',
      'Hitung target biaya',
      'Tambah aktivitas penghasilan',
      'Kurangi pengeluaran'
    ]
  ]
]

export default function Roadmap() {
  const [i, setI] = useState(0)
  const [ans, setAns] = useState<string[]>([])
  const [user, setUser] = useState<any>(null)
  const [saved, setSaved] = useState(false)

  const s = supabaseBrowser()

  useEffect(() => {
    s.auth.getUser().then(({ data }) => {
      if (!data.user) {
        window.location.href = '/'
        return
      }

      setUser(data.user)

      s.from('answers')
        .select('answers')
        .eq('user_id', data.user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data?.answers) {
            setAns(data.answers)
          }
        })
    })
  }, [])

  function choose(v: string) {
    const a = [...ans]
    a[i] = v
    setAns(a)
  }

  async function save() {
    if (!user) return

    await s.from('answers').upsert({
      user_id: user.id,
      answers: ans,
      updated_at: new Date().toISOString()
    })

    setSaved(true)
  }

  if (i >= steps.length) {
    const name =
      user?.user_metadata?.name ||
      user?.user_metadata?.full_name ||
      'Saya'

    const whatsappMessage = `Assalamu'alaikum, saya ${name}.

Saya sudah menyelesaikan 7 Langkah Menuju Baitullah.

📋 HASIL ROADMAP SAYA

Target: ${ans[0] || '-'}
Target waktu: ${ans[1] || '-'}
Tabungan khusus Baitullah: ${ans[2] || '-'}
Fokus ikhtiar: ${ans[3] || '-'}
Pos keuangan Baitullah: ${ans[4] || '-'}
Pendamping/accountability: ${ans[5] || '-'}
Langkah pertama: ${ans[6] || '-'}

Saya ingin mendapatkan informasi pendampingan selanjutnya.

Terima kasih.`

    const whatsappUrl =
      `https://wa.me/6281268419427?text=${encodeURIComponent(
        whatsappMessage
      )}`

    return (
      <div className="wrap">
        <div className="card">
          <span className="badge">ROADMAP AWAL</span>

          <h1>Ikhtiar Anda sudah punya arah.</h1>

          <p>
            Target: <b>{ans[0]}</b>
          </p>

          <p>
            Langkah pertama: <b>{ans[6]}</b>
          </p>

          <p>
            Fokus penguatan: <b>{ans[3]}</b>
          </p>

          <div className="row">
            <button className="btn" onClick={save}>
              Simpan Roadmap
            </button>

            <a
              className="btn alt"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Bedah hasil di WA
            </a>
          </div>

          {saved && (
            <p className="muted">
              Roadmap tersimpan.
            </p>
          )}

          <hr />

          <p className="muted">
            Roadmap ini adalah alat awal.
            Workbook “Langkah Nyata Menuju Baitullah” membantu Anda
            mengubah niat menjadi ikhtiar yang lebih terarah melalui
            latihan, evaluasi, dan roadmap, silahkan lanjutkan ke whatsapp admin untuk ditanggapi oleh admin kami
          </p>
        </div>
      </div>
    )
  }

  const [title, q, opts] = steps[i]

  return (
    <div className="wrap">
      <div
        className="card"
        style={{ maxWidth: 700, margin: '40px auto' }}
      >
        <div className="row">
          <span className="badge">
            Langkah {i + 1} dari {steps.length}
          </span>

          <span className="muted">
            {title}
          </span>
        </div>

        <div className="progress">
          <div
            style={{
              width: `${(i / steps.length) * 100}%`
            }}
          />
        </div>

        <div className="space" />

        <h1>{q}</h1>

        <div className="grid">
          {opts.map((o) => (
            <button
              key={o}
              className={
                'option ' +
                (ans[i] === o ? 'selected' : '')
              }
              onClick={() => choose(o)}
            >
              {o}
            </button>
          ))}
        </div>

        <div className="space" />

        <div className="row">
          <button
            className="btn alt"
            disabled={i === 0}
            onClick={() => setI(i - 1)}
          >
            Kembali
          </button>

          <button
            className="btn"
            disabled={!ans[i]}
            onClick={() => setI(i + 1)}
          >
            Lanjut
          </button>
        </div>
      </div>
    </div>
  )
}
