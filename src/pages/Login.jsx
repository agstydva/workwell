import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Activity, Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Harap masukkan alamat email dan kata sandi Anda!');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Gagal masuk. Periksa kembali email dan sandi Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-center items-center relative p-4 select-none transition-colors duration-200">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-650/5 dark:bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-650/5 dark:bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Floating navigation button */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="flex items-center space-x-2 text-sm text-slate-650 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors py-2.5 px-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali</span>
        </Link>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md glass-panel p-8 rounded-[32px] border border-slate-250 dark:border-slate-800 shadow-2xl relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="p-3 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/20">
            <Activity className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white">Selamat Datang Kembali</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Masuk untuk melanjutkan monitoring kesehatan Anda</p>
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
          
          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-550 dark:text-slate-400 uppercase tracking-wider pl-1">Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-550 dark:text-slate-550">
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
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-550 dark:text-slate-555">
                <Lock className="h-4.5 w-4.5" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
            <span>{loading ? 'Masuk...' : 'Masuk ke Dashboard'}</span>
          </button>
        </form>

        {/* Footer Links */}
        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2">
          <span>Belum punya akun? </span>
          <Link to="/register" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
            Daftar di sini
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
