import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Activity, Mail, Lock, User, AlertCircle, ArrowLeft } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Semua kolom formulir harus diisi!');
      return;
    }

    if (password.length < 6) {
      setError('Kata sandi minimal harus terdiri dari 6 karakter!');
      return;
    }

    if (password !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok!');
      return;
    }

    try {
      setLoading(true);
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Gagal mendaftarkan akun. Silakan coba kembali.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-center items-center relative p-4 select-none transition-colors duration-200">
      {/* Decorative Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-purple-650/5 dark:bg-purple-600/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Back button */}
      <div className="absolute top-6 left-6">
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-sm text-slate-655 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors py-2.5 px-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali</span>
        </Link>
      </div>

      {/* Register Card */}
      <div className="w-full max-w-md glass-panel p-8 rounded-[32px] border border-slate-250 dark:border-slate-800 shadow-2xl relative z-10 space-y-6">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="p-3 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/20">
            <Activity className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white">Buat Akun WorkWell</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Langkah awal untuk hidup sehat di depan layar</p>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="flex items-start space-x-2 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-2xl text-xs font-medium animate-in fade-in duration-200">
            <AlertCircle className="h-4.5 w-4.5 mt-0.5 flex-shrink-0" />
            <span className="leading-normal">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-550 dark:text-slate-400 uppercase tracking-wider pl-1">Nama Lengkap</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-550">
                <User className="h-4.5 w-4.5" />
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Anda"
                className="w-full py-3 pl-11 pr-4 bg-white/80 dark:bg-slate-900/60 border border-slate-250 dark:border-slate-800 focus:border-indigo-500 text-sm rounded-2xl text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all focus:ring-1 focus:ring-indigo-500"
                disabled={loading}
              />
            </div>
          </div>

          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-550 dark:text-slate-400 uppercase tracking-wider pl-1">Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-550">
                <Mail className="h-4.5 w-4.5" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full py-3 pl-11 pr-4 bg-white/80 dark:bg-slate-900/60 border border-slate-250 dark:border-slate-800 focus:border-indigo-500 text-sm rounded-2xl text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all focus:ring-1 focus:ring-indigo-500"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-550 dark:text-slate-400 uppercase tracking-wider pl-1">Kata Sandi</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-550">
                <Lock className="h-4.5 w-4.5" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full py-3 pl-11 pr-4 bg-white/80 dark:bg-slate-900/60 border border-slate-250 dark:border-slate-800 focus:border-indigo-500 text-sm rounded-2xl text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all focus:ring-1 focus:ring-indigo-500"
                disabled={loading}
              />
            </div>
          </div>

          {/* Confirm Password input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-550 dark:text-slate-400 uppercase tracking-wider pl-1">Konfirmasi Kata Sandi</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-550">
                <Lock className="h-4.5 w-4.5" />
              </span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ketik ulang kata sandi"
                className="w-full py-3 pl-11 pr-4 bg-white/80 dark:bg-slate-900/60 border border-slate-250 dark:border-slate-800 focus:border-indigo-500 text-sm rounded-2xl text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all focus:ring-1 focus:ring-indigo-500"
                disabled={loading}
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-2xl text-sm shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none mt-2"
            disabled={loading}
          >
            <span>{loading ? 'Mendaftar...' : 'Buat Akun'}</span>
          </button>
        </form>

        {/* Footer Links */}
        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2">
          <span>Sudah punya akun? </span>
          <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
            Masuk di sini
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
