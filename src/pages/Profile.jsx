import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/Sidebar';
import WorkWellLogo from '../components/WorkWellLogo';
import { User, Settings, Save, CheckCircle, AlertCircle, RefreshCw, Menu, Activity, Camera } from 'lucide-react';
import { useTracker } from '../hooks/useTracker';

const Profile = () => {
  const { currentUser, userSettings, updateProfileAndSettings } = useAuth();
  const { isMobileSidebarOpen, setIsMobileSidebarOpen } = useTracker();
  const navigate = useNavigate();

  // Local states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [screenLimit, setScreenLimit] = useState(60);
  const [breakDuration, setBreakDuration] = useState(5);
  const [profilePicture, setProfilePicture] = useState('');
  const [status, setStatus] = useState('');
  
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync state values when data loads
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
      setProfilePicture(currentUser.profilePicture || '');
      setStatus(currentUser.status || '');
    }
    if (userSettings) {
      setScreenLimit(userSettings.screenLimit || 60);
      setBreakDuration(userSettings.breakDuration || 5);
    }
  }, [currentUser, userSettings]);

  // Clear success notification
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1.5 * 1024 * 1024) {
        setError('Ukuran file maksimal adalah 1.5MB!');
        return;
      }
      setError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email) {
      setError('Nama dan Email tidak boleh kosong!');
      return;
    }

    try {
      setLoading(true);
      await updateProfileAndSettings(
        name,
        email,
        {
          screenLimit: Number(screenLimit),
          breakDuration: Number(breakDuration)
        },
        profilePicture,
        status
      );
      setSuccess('Profil dan pengaturan berhasil diperbarui!');
    } catch (err) {
      setError(err.message || 'Gagal menyimpan perubahan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-dark flex flex-col transition-colors duration-200">
      {/* Mobile Header (only visible on mobile since top Navbar is removed) */}
      <div className="flex md:hidden items-center justify-between px-6 py-4 bg-white border-b border-brand-secondary/15 dark:bg-slate-950">
        <WorkWellLogo logoColorClass="text-brand-dark dark:text-white" />
        
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white focus:outline-none cursor-pointer"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-4xl mx-auto w-full space-y-6">
          <div className="pb-4 border-b border-brand-secondary/15 text-left">
            <h1 className="text-2xl font-black text-brand-dark leading-tight">Pengaturan Profil</h1>
            <p className="text-xs text-brand-secondary mt-1 font-semibold">
              Sesuaikan informasi akun dan preferensi pengingat batas waktu kerja layar Anda.
            </p>
          </div>

          {/* Messages */}
          {success && (
            <div className="flex items-center space-x-2.5 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-2xl text-xs font-bold animate-in fade-in duration-200 text-left">
              <CheckCircle className="h-4.5 w-4.5 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="flex items-center space-x-2.5 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 rounded-2xl text-xs font-bold animate-in fade-in duration-200 text-left">
              <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Box 1: Account Info */}
            <div className="bg-white border border-brand-secondary/15 p-6 sm:p-8 rounded-[32px] shadow-sm space-y-6 text-left">
              <div className="flex items-center space-x-3 text-brand-secondary pb-3 border-b border-brand-secondary/10">
                <User className="h-5.5 w-5.5 text-brand-secondary" />
                <h3 className="font-extrabold text-brand-dark text-sm">Detail Informasi Pengguna</h3>
              </div>

              {/* Avatar Upload Section */}
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-4 border-b border-brand-secondary/5">
                <div className="relative group w-24 h-24 rounded-full border-2 border-brand-primary overflow-hidden flex items-center justify-center bg-brand-bg shadow-sm">
                  {profilePicture ? (
                    <img src={profilePicture} alt="Avatar Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-black text-brand-secondary">
                      {name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                  <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer">
                    <Camera className="h-5 w-5 mb-1" />
                    Ganti Foto
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="text-center sm:text-left space-y-1">
                  <h4 className="font-bold text-brand-dark text-sm">Foto Profil Anda</h4>
                  <p className="text-[10px] text-brand-secondary font-medium leading-relaxed max-w-md">
                    Pilih file gambar (.jpg, .png, max 1.5MB) dari PC/laptop Anda. Foto ini akan otomatis terpasang pada sidebar utama.
                  </p>
                  {profilePicture && (
                    <button
                      type="button"
                      onClick={() => setProfilePicture('')}
                      className="text-[10px] font-extrabold text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      Hapus Foto
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-brand-secondary uppercase tracking-widest pl-1">Nama Lengkap</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full py-3.5 px-4 bg-brand-bg/50 border border-slate-200 focus:border-brand-secondary text-sm rounded-2xl text-slate-800 placeholder-slate-400 outline-none transition-all focus:ring-1 focus:ring-brand-secondary font-semibold"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-brand-secondary uppercase tracking-widest pl-1">Alamat Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full py-3.5 px-4 bg-brand-bg/50 border border-slate-200 focus:border-brand-secondary text-sm rounded-2xl text-slate-800 placeholder-slate-400 outline-none transition-all focus:ring-1 focus:ring-brand-secondary font-semibold"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-brand-secondary uppercase tracking-widest pl-1">Status / Pekerjaan</label>
                <input
                  type="text"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  placeholder="Contoh: Mahasiswa, Software Engineer di PT Telkom, dll."
                  className="w-full py-3.5 px-4 bg-brand-bg/50 border border-slate-200 focus:border-brand-secondary text-sm rounded-2xl text-slate-800 placeholder-slate-400 outline-none transition-all focus:ring-1 focus:ring-brand-secondary font-semibold"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Box 2: Time Settings */}
            <div className="bg-white border border-brand-secondary/15 p-6 sm:p-8 rounded-[32px] shadow-sm space-y-6 text-left">
              <div className="flex items-center space-x-3 text-brand-secondary pb-3 border-b border-brand-secondary/10">
                <Settings className="h-5.5 w-5.5 text-brand-secondary" />
                <h3 className="font-extrabold text-brand-dark text-sm">Konfigurasi Pengingat Kesehatan</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                 {/* Screen Time Limit selection */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-brand-secondary uppercase tracking-widest pl-1 block">Batas Waktu Kerja (Screen Limit)</label>
                  <p className="text-[10px] text-slate-500 pl-1 leading-relaxed">
                    Durasi kerja di depan laptop sebelum sistem memicu reminder istirahat.
                  </p>
                  <div className="flex flex-col gap-2">
                    <div className="relative flex items-center">
                      <input
                        type="number"
                        min={1}
                        max={720}
                        value={screenLimit}
                        onChange={(e) => setScreenLimit(e.target.value)}
                        placeholder="Masukkan menit"
                        className="w-full py-3.5 pl-4 pr-16 bg-brand-bg/40 border border-slate-200 focus:border-brand-secondary text-sm rounded-2xl text-slate-800 outline-none transition-all focus:ring-1 focus:ring-brand-secondary font-extrabold"
                      />
                      <span className="absolute right-4 text-xs font-bold text-slate-400 select-none">Menit</span>
                    </div>
                    
                    {/* Presets Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {[
                        { label: '30m', val: 30 },
                        { label: '1 Jam', val: 60 },
                        { label: '2 Jam', val: 120 },
                        { label: '3 Jam', val: 180 }
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setScreenLimit(preset.val)}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all border cursor-pointer ${
                            Number(screenLimit) === preset.val
                              ? 'bg-brand-secondary/15 border-brand-secondary text-brand-secondary'
                              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Break Duration Settings */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-brand-secondary uppercase tracking-widest pl-1 block">Durasi Istirahat (Break Duration)</label>
                  <p className="text-[10px] text-slate-500 pl-1 leading-relaxed">
                    Lama hitung mundur timer saat jeda istirahat (break).
                  </p>
                  <div className="flex flex-col gap-2">
                    <div className="relative flex items-center">
                      <input
                        type="number"
                        min={1}
                        max={120}
                        value={breakDuration}
                        onChange={(e) => setBreakDuration(e.target.value)}
                        placeholder="Masukkan menit"
                        className="w-full py-3.5 pl-4 pr-16 bg-brand-bg/40 border border-slate-200 focus:border-brand-secondary text-sm rounded-2xl text-slate-800 outline-none transition-all focus:ring-1 focus:ring-brand-secondary font-extrabold"
                      />
                      <span className="absolute right-4 text-xs font-bold text-slate-400 select-none">Menit</span>
                    </div>

                    {/* Presets Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {[
                        { label: '5m', val: 5 },
                        { label: '10m', val: 10 },
                        { label: '15m', val: 15 },
                        { label: '20m', val: 20 }
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setBreakDuration(preset.val)}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all border cursor-pointer ${
                            Number(breakDuration) === preset.val
                              ? 'bg-brand-secondary/15 border-brand-secondary text-brand-secondary'
                              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Save Buttons Panel */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="py-3.5 px-8 bg-brand-primary hover:bg-brand-primary/95 text-brand-dark font-bold rounded-2xl text-sm shadow-md shadow-brand-primary/10 transition-all flex items-center space-x-2 active:scale-98 cursor-pointer disabled:opacity-50"
                disabled={loading}
              >
                <Save className="h-4.5 w-4.5" />
                <span>{loading ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
              </button>
            </div>

          </form>

        </main>
      </div>
    </div>
  );
};

export default Profile;
