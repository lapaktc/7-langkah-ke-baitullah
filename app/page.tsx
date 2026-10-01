'use client'

import { useState } from 'react'
import { supabaseBrowser } from '../lib/supabase'

export default function Home() {
  const [mode, setMode] = useState<'home' | 'register'>('home')
  const [name, setName] = useState('')
  const [wa, setWa] = useState('')
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [consent, setConsent] = useState(false)
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  async function register(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErr('')

    if (!consent) {
      setErr(
        'Mohon setujui penggunaan data untuk akun dan komunikasi.'
      )
      return
    }

    setLoading(true)

    const s = supabaseBrowser()

    const { data, error } = await s.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          name,
          whatsapp: wa,
        },
      },
    })

    if (error) {
      setLoading(false)
      setErr(error.message)
      return
    }

    if (!data.user) {
      setLoading(false)
      setErr('Akun belum berhasil dibuat. Silakan coba lagi.')
      return
    }

    const { error: profileError } = await s
      .from('profiles')
      .upsert({
        id: data.user.id,
        name,
        whatsapp: wa,
        email,
      })

    if (profileError) {
      setLoading(false)
      setErr(profileError.message)
      return
    }

    window.location.href = '/roadmap'
  }

  if (mode === 'register') {
    return (
      <div className="wrap">
        <div
          className="card"
          style={{
            maxWidth: 520,
            margin: '40px auto',
          }}
        >
          <span className="badge">LANGKAH BAITULLAH</span>

          <h1>Buat akun</h1>

          <p className="muted">
            Mulai menyusun ikhtiar menuju Baitullah.
          </p>

          <form onSubmit={register}>
            <label>Nama</label>

            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama lengkap"
              required
            />

            <label>WhatsApp</label>

            <input
              className="input"
              value={wa}
              onChange={(e) => setWa(e.target.value)}
              placeholder="08xxxxxxxxxx"
              required
            />

            <label>Email</label>

            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              required
            />

            <label>Password</label>

            <input
              className="input"
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Minimal 6 karakter"
              minLength={6}
              required
            />

            <label className="small">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) =>
                  setConsent(e.target.checked)
                }
              />{' '}
              Saya setuju data digunakan untuk akun,
              pendampingan, dan informasi terkait Langkah
              Baitullah.
            </label>

            <div className="space" />

            {err && (
              <div className="error">
                {err}
              </div>
            )}

            <button
              className="btn"
              type="submit"
              disabled={loading}
            >
              {loading
                ? 'Membuat akun...'
                : 'Buat akun & mulai'}
            </button>

            <div
              style={{
                marginTop: 16,
                textAlign: 'center',
              }}
            >
              <span className="muted">
                Sudah punya akun?{' '}
              </span>

              <a
                href="/login"
                style={{ fontWeight: 700 }}
              >
                Login
              </a>
            </div>
          </form>

          <div className="space" />

          <button
            className="btn alt"
            onClick={() => setMode('home')}
          >
            Kembali
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="wrap">
      <section className="hero">
        <span className="badge">
          LANGKAH BAITULLAH
        </span>

        <h1>
          Dari Niat, Menjadi Ikhtiar Nyata Menuju
          Baitullah.
        </h1>

        <p className="muted">
          Bukan sekadar ingin. Susun target, tabungan,
          ikhtiar, dan langkah pertama Anda.
        </p>

        <button
          className="btn"
          onClick={() => setMode('register')}
        >
          Mulai Sekarang
        </button>

        <div
          style={{
            marginTop: 18,
            textAlign: 'center',
          }}
        >
          <span className="muted">
            Sudah punya akun?{' '}
          </span>

          <a
            href="/login"
            style={{ fontWeight: 700 }}
          >
            Login
          </a>
        </div>
      </section>

      <section className="card">
        <h2>Bagaimana cara kerjanya?</h2>

        <div className="grid">
          <p>
            <b>1. Buat akun</b>
            <br />
            <span className="muted">
              Nama dan WhatsApp menjadi pintu masuk
              pendampingan.
            </span>
          </p>

          <p>
            <b>2. Isi 7 langkah</b>
            <br />
            <span className="muted">
              Refleksi singkat berdasarkan alur workbook
              Langkah Nyata Menuju Baitullah.
            </span>
          </p>

          <p>
            <b>3. Dapatkan roadmap</b>
            <br />
            <span className="muted">
              Hasil membantu Anda melihat langkah yang
              perlu dikerjakan berikutnya.
            </span>
          </p>
        </div>
      </section>

      <div className="footer">
        Langkah Baitullah • “Dari Niat, Menjadi Ikhtiar
        Nyata Menuju Baitullah.”
      </div>
    </div>
  )
}
