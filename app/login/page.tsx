'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '../../lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = supabaseBrowser();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      setError(
        error.message.includes('Invalid login credentials')
          ? 'Email atau password salah.'
          : error.message
      );
      return;
    }

    if (!data.user) {
      setLoading(false);
      setError('Login belum berhasil. Silakan coba lagi.');
      return;
    }

    router.push('/roadmap');
    router.refresh();
  }

  return (
    <main className="wrap">
      <div
        className="card"
        style={{
          maxWidth: 520,
          margin: '60px auto',
        }}
      >
        <span className="badge">LOGIN</span>

        <h1>Selamat datang kembali</h1>

        <p className="muted">
          Masuk untuk melanjutkan 7 Langkah Menuju Baitullah.
        </p>

        <form onSubmit={login}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
            autoComplete="email"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan password"
            autoComplete="current-password"
            required
          />

          {error && (
            <p
              style={{
                marginTop: 14,
                padding: 12,
                borderRadius: 10,
                background: '#fff1f2',
              }}
            >
              {error}
            </p>
          )}

          <button
            className="btn"
            type="submit"
            disabled={loading}
            style={{ width: '100%', marginTop: 18 }}
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <span className="muted">Belum punya akun? </span>
          <a href="/" style={{ fontWeight: 700 }}>
            Buat akun
          </a>
        </div>
      </div>
    </main>
  );
}
