import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import WorkWellLogo from '../components/WorkWellLogo';
import authIllustration from '../assets/auth_illustration.png';
import registerIllustration from '../assets/register_illustration.png';
import heroWorkspaceBg from '../assets/hero_workspace_bg.png';
import screenTimeIcon from '../assets/screen_time.png';
import waterIntakeIcon from '../assets/water_intake.png';
import movementTrackerIcon from '../assets/movement_tracker.png';
import stressAnalyticsIcon from '../assets/stress_analytics.png';

import {
  Activity, Clock, Droplet, Dumbbell, ShieldAlert,
  ArrowRight, Shield, Zap, Sparkles, TrendingUp,
  X, Mail, Lock, User, AlertCircle, CheckCircle2,
  Play, Volume2, Star
} from 'lucide-react';

const LandingPage = () => {
  const { currentUser, login, register } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const authParam = searchParams.get('auth');

  // Modal states
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status states
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync url search parameters with modals
  useEffect(() => {
    if (authParam === 'login') {
      setShowLogin(true);
      setShowRegister(false);
      setError('');
    } else if (authParam === 'register') {
      setShowRegister(true);
      setShowLogin(false);
      setError('');
    } else {
      setShowLogin(false);
      setShowRegister(false);
    }
  }, [authParam]);

  const testimonials = [
    {
      name: "Aditya Pratama",
      role: "Mahasiswa Ilmu Komputer UNJ",
      initials: "AP",
      bgClass: "from-brand-secondary to-brand-primary",
      rating: 5,
      comment: "Sebagai mahasiswa ilmu komputer, tugas pemrograman sangat menyita waktu di depan laptop. Sejak memakai WorkWell, fitur peregangan ototnya sangat membantu meredakan pegal pundak saya."
    },
    {
      name: "Dewi Lestari",
      role: "IT Developer Biro Klasifikasi Indonesia (Persero)",
      initials: "DL",
      bgClass: "from-indigo-500 to-cyan-500",
      rating: 5,
      comment: "Notifikasi pengingat layar dan rehatnya sangat adaptif. Sangat menunjang kesehatan mata saya saat harus fokus mengoding sistem klasifikasi sepanjang hari kerja."
    },
    {
      name: "Rian Hidayat",
      role: "Mahasiswa Sistem Informasi Universitas Trisakti",
      initials: "RH",
      bgClass: "from-rose-500 to-amber-500",
      rating: 4,
      comment: "Fitur pelacak air minumnya sangat memotivasi saya untuk teratur menghidrasi tubuh saat kuliah daring. Target harian tercapai secara presisi."
    },
    {
      name: "Siti Rahma",
      role: "Mahasiswa Pendidikan Teknik Informatika UNJ",
      initials: "SR",
      bgClass: "from-emerald-500 to-teal-500",
      rating: 5,
      comment: "Wellness Center dengan musik latar alam tenangnya sangat membantu meredakan kepenatan saya setelah praktikum panjang. Desain aplikasinya menenangkan."
    },
    {
      name: "Budi Santoso",
      role: "DevOps Engineer Biro Klasifikasi Indonesia (Persero)",
      initials: "BS",
      bgClass: "from-blue-500 to-indigo-500",
      rating: 5,
      comment: "Menjaga konsistensi rutinitas sehat kini lebih mudah berkat fitur habit streaks. Tracker otomatis ini sangat membantu integrasi kebiasaan sehat saat WFO."
    },
    {
      name: "Alisha Putri",
      role: "Mahasiswa DKV Universitas Trisakti",
      initials: "AP",
      bgClass: "from-purple-500 to-pink-500",
      rating: 4,
      comment: "Latihan pernapasan box breathing di Wellness Center sangat berguna untuk meredakan kecemasan dan stres saat saya dikejar tenggat waktu tugas akhir."
    },
    {
      name: "Fikri Ramadhan",
      role: "Mahasiswa Teknologi Pendidikan UNJ",
      initials: "FR",
      bgClass: "from-amber-400 to-orange-500",
      rating: 5,
      comment: "Aplikasi yang sangat ringan dan mudah dioperasikan. Sangat cocok bagi mahasiswa yang sering harus begadang mengerjakan tugas riset di depan komputer."
    },
    {
      name: "Diana Nastiti",
      role: "System Analyst Biro Klasifikasi Indonesia (Persero)",
      initials: "DN",
      bgClass: "from-teal-500 to-cyan-500",
      rating: 5,
      comment: "Membantu melacak kebiasaan kesehatan kerja tim developer kami di kantor. Tingkat kebugaran dan kebahagiaan karyawan meningkat signifikan."
    },
    {
      name: "Kevin Wijaya",
      role: "Mahasiswa Teknik Industri Universitas Trisakti",
      initials: "KW",
      bgClass: "from-violet-500 to-fuchsia-500",
      rating: 5,
      comment: "Panduan peregangan dinamis di Wellness Center sangat mudah diikuti dan langsung meredakan pegal bahu serta punggung saya setelah kuliah panjang."
    }
  ];

  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const openLoginModal = () => {
    setSearchParams({ auth: 'login' });
  };

  const openRegisterModal = () => {
    setSearchParams({ auth: 'register' });
  };

  const closeModal = () => {
    setSearchParams({});
    setEmail('');
    setPassword('');
    setName('');
    setConfirmPassword('');
    setError('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Harap isi email dan kata sandi Anda.');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      closeModal();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Gagal masuk. Periksa kembali email dan kata sandi.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Semua kolom formulir harus diisi!');
      return;
    }

    if (password.length < 6) {
      setError('Kata sandi minimal harus 6 karakter!');
      return;
    }

    if (password !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok!');
      return;
    }

    try {
      setLoading(true);
      await register(name, email, password);
      closeModal();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Gagal mendaftar. Silakan coba kembali.');
    } finally {
      setLoading(false);
    }
  };

  // Looping Typewriter Effect for Hero Title
  const [typedText1, setTypedText1] = useState('');
  const [typedText2, setTypedText2] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const phrases = [
    { line1: 'Work smarter.', line2: 'Stay healthier.' },
    { line1: 'Stay active.', line2: 'Live better.' },
    { line1: 'Track screen.', line2: 'Reduce fatigue.' }
  ];

  useEffect(() => {
    let timer;
    const handleType = () => {
      const current = loopNum % phrases.length;
      const fullL1 = phrases[current].line1;
      const fullL2 = phrases[current].line2;
      
      if (!isDeleting) {
        // Typing phase (slower, more natural)
        if (typedText1.length < fullL1.length) {
          setTypedText1(fullL1.substring(0, typedText1.length + 1));
          setTypingSpeed(130);
        } else if (typedText2.length < fullL2.length) {
          setTypedText2(fullL2.substring(0, typedText2.length + 1));
          setTypingSpeed(130);
        } else {
          // Pause at peak (slightly longer pause)
          timer = setTimeout(() => setIsDeleting(true), 3200);
          return;
        }
      } else {
        // Deleting phase (slower)
        if (typedText2.length > 0) {
          setTypedText2(typedText2.substring(0, typedText2.length - 1));
          setTypingSpeed(75);
        } else if (typedText1.length > 0) {
          setTypedText1(typedText1.substring(0, typedText1.length - 1));
          setTypingSpeed(75);
        } else {
          setIsDeleting(false);
          setLoopNum(loopNum + 1);
          setTypingSpeed(450); // delay before next word starts
          return;
        }
      }
      
      timer = setTimeout(handleType, typingSpeed);
    };

    timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [typedText1, typedText2, isDeleting, loopNum, typingSpeed]);

  // Scroll animations implementation using IntersectionObserver
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.12
    };

    const handleIntersect = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          observer.unobserve(entry.target); // Trigger once
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const hiddenElements = document.querySelectorAll('.scroll-reveal');
    hiddenElements.forEach(el => observer.observe(el));

    return () => {
      hiddenElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="min-h-screen bg-brand-bg text-brand-dark flex flex-col selection:bg-brand-primary selection:text-brand-dark relative font-sans">
      <style dangerouslySetInnerHTML={{__html: `
        .scroll-reveal {
          opacity: 0;
          transform: translateY(45px);
          transition: opacity 1.3s cubic-bezier(0.16, 1, 0.3, 1), transform 1.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal-active {
          opacity: 1;
          transform: translateY(0);
        }
      `}} />
      {/* SaaS Navbar */}
      <Navbar onLoginClick={openLoginModal} onRegisterClick={openRegisterModal} />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32 lg:pt-32 lg:pb-40">

        {/* Background: office meeting photo from Unsplash */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroWorkspaceBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
          }}
        />
        {/* Overlay — strong fade on left (text area) → transparent on right (photo visible) */}
        <div className="absolute inset-0 z-[1] hero-overlay" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">

            {/* Left Content */}
            <div className="text-center lg:text-left lg:col-span-6 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-brand-secondary/10 border border-brand-secondary/25 text-brand-dark dark:text-brand-primary text-xs font-bold animate-pulse">
                <Sparkles className="h-4.5 w-4.5 text-brand-secondary" />
                <span>Modern Digital Wellbeing Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-brand-dark dark:text-white min-h-[7rem] md:min-h-[8.5rem] lg:min-h-[11rem]">
                {typedText1}
                <br />
                {typedText2}
                <span className="inline-block w-1.5 h-8 md:h-12 bg-brand-secondary ml-1 animate-pulse" />
              </h1>

              <p className="text-base sm:text-lg text-brand-secondary dark:text-emerald-400/90 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Monitor your screen habits, build healthy routines, and improve your digital wellbeing.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                {currentUser ? (
                  <Link
                    to="/dashboard"
                    className="w-full sm:w-auto px-8 py-4 bg-brand-primary hover:bg-brand-primary/90 text-brand-dark rounded-2xl font-bold shadow-lg shadow-brand-primary/20 transition-all text-center flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
                  >
                    <span>Masuk ke Dashboard</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={openRegisterModal}
                      className="w-full sm:w-auto px-8 py-4 bg-brand-primary hover:bg-brand-primary/95 text-brand-dark rounded-2xl font-bold shadow-lg shadow-brand-primary/20 transition-all text-center flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
                    >
                      <span>Start Tracking</span>
                      <ArrowRight className="h-5 w-5" />
                    </button>
                    <button
                      onClick={openLoginModal}
                      className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 border border-slate-200 text-brand-secondary rounded-2xl font-bold shadow-sm transition-all text-center cursor-pointer active:scale-98"
                    >
                      Login
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Right SaaS Mock Dashboard Preview */}
            <div className="mt-16 lg:mt-0 lg:col-span-6 flex justify-center">
              <div className="w-full max-w-lg bg-white/70 border border-brand-secondary/15 rounded-[32px] p-6 shadow-2xl space-y-5 backdrop-blur-sm select-none">

                {/* Header Mockup */}
                <div className="flex justify-between items-center pb-3 border-b border-brand-secondary/10">
                  <div className="flex items-center space-x-2">
                    <div className="w-3.5 h-3.5 rounded-full bg-brand-secondary/10 flex items-center justify-center">
                      <WorkWellLogo iconOnly={true} className="h-4.5 w-4.5 text-brand-secondary animate-pulse" logoColorClass="text-brand-secondary" />
                    </div>
                    <span className="text-xs font-bold text-brand-dark">WorkWell SaaS Preview</span>
                  </div>
                  <div className="flex space-x-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-455" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-455" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-455" />
                  </div>
                </div>

                {/* Score and Stats Row mockup */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-card p-4 rounded-2xl flex flex-col justify-between h-24">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">Wellness Score</span>
                      <span className="text-xs">✨</span>
                    </div>
                    <div className="text-2xl font-extrabold text-white">82%</div>
                  </div>

                  <div className="bg-white border border-brand-secondary/15 p-4 rounded-2xl flex flex-col justify-between h-24">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-secondary">Screen Time</span>
                      <span className="text-xs">⏱️</span>
                    </div>
                    <div className="text-lg font-extrabold text-brand-dark">2j 15m / 3j</div>
                  </div>
                </div>

                {/* Habits items list mockup */}
                <div className="space-y-3 bg-white border border-brand-secondary/10 rounded-2xl p-4">
                  <div className="flex items-center justify-between text-xs font-bold text-brand-dark pb-2 border-b border-brand-secondary/5">
                    <span>Habit Tracker</span>
                    <span className="text-brand-primary">🔥 8 Days Streak</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2 text-brand-secondary">
                      <Droplet className="h-4 w-4 text-blue-500" />
                      <span>Air Minum</span>
                    </div>
                    <span className="font-bold text-brand-dark">6 / 8 Gelas</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2 text-brand-secondary">
                      <Dumbbell className="h-4 w-4 text-brand-secondary" />
                      <span>Peregangan Tubuh</span>
                    </div>
                    <span className="font-bold text-brand-dark">3 / 5 Sesi</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* Feature section */}
      <section id="fitur" className="py-24 bg-white border-y border-brand-secondary/10 relative overflow-hidden scroll-reveal">
        {/* Animated Background Blobs */}
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-brand-primary/10 blur-3xl pointer-events-none" 
          style={{
            animation: 'float-blob-1 14s infinite alternate ease-in-out'
          }}
        />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-brand-secondary/10 blur-3xl pointer-events-none"
          style={{
            animation: 'float-blob-2 18s infinite alternate-reverse ease-in-out'
          }}
        />
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes float-blob-1 {
            0% { transform: translate(0px, 0px) scale(1); }
            50% { transform: translate(30px, -50px) scale(1.1); }
            100% { transform: translate(-20px, 20px) scale(0.9); }
          }
          @keyframes float-blob-2 {
            0% { transform: translate(0px, 0px) scale(1); }
            50% { transform: translate(-40px, 40px) scale(0.95); }
            100% { transform: translate(30px, -20px) scale(1.1); }
          }
        `}} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold text-brand-secondary uppercase tracking-widest">Fitur Utama</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-brand-dark">Dirancang untuk Menjaga Kesehatan Anda</p>
            <p className="text-brand-secondary text-sm font-medium">Berbagai modul pintar yang bersinergi membantu menjaga kebugaran mata, otot, hidrasi, dan pikiran Anda secara berkala.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="glass-card-light overflow-hidden rounded-3xl border border-brand-secondary/10 flex flex-col justify-between hover:shadow-lg transition-all duration-300">
              <div>
                <div className="w-full h-44 bg-slate-50 dark:bg-slate-900/20 flex items-center justify-center p-4 border-b border-brand-secondary/5">
                  <img src={screenTimeIcon} alt="Screen Time" className="h-full w-full object-contain max-h-36 transition-transform duration-500 hover:scale-105" />
                </div>
                <div className="p-6 space-y-2 text-left">
                  <h3 className="text-lg font-bold text-brand-dark">Screen Time Monitor</h3>
                  <p className="text-xs text-brand-secondary font-medium leading-relaxed">Timer durasi kerja dengan reminder otomatis ketika melebihi batas waktu sehat. Jaga mata Anda agar tetap rileks.</p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="glass-card-light overflow-hidden rounded-3xl border border-brand-secondary/10 flex flex-col justify-between hover:shadow-lg transition-all duration-300">
              <div>
                <div className="w-full h-44 bg-slate-50 dark:bg-slate-900/20 flex items-center justify-center p-4 border-b border-brand-secondary/5">
                  <img src={waterIntakeIcon} alt="Water Intake" className="h-full w-full object-contain max-h-36 transition-transform duration-500 hover:scale-105" />
                </div>
                <div className="p-6 space-y-2 text-left">
                  <h3 className="text-lg font-bold text-brand-dark">Habit Water Intake</h3>
                  <p className="text-xs text-brand-secondary font-medium leading-relaxed">Pengingat berkala untuk minum air. Capai target gelas harian Anda secara teratur agar tubuh tetap terhidrasi dengan baik.</p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="glass-card-light overflow-hidden rounded-3xl border border-brand-secondary/10 flex flex-col justify-between hover:shadow-lg transition-all duration-300">
              <div>
                <div className="w-full h-44 bg-slate-50 dark:bg-slate-900/20 flex items-center justify-center p-4 border-b border-brand-secondary/5">
                  <img src={movementTrackerIcon} alt="Movement Tracker" className="h-full w-full object-contain max-h-36 transition-transform duration-500 hover:scale-105" />
                </div>
                <div className="p-6 space-y-2 text-left">
                  <h3 className="text-lg font-bold text-brand-dark">Movement Tracker</h3>
                  <p className="text-xs text-brand-secondary font-medium leading-relaxed">Mencatat aktivitas peregangan dan olahraga ringan Anda. Hindari kekakuan otot leher, punggung, dan bahu.</p>
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="glass-card-light overflow-hidden rounded-3xl border border-brand-secondary/10 flex flex-col justify-between hover:shadow-lg transition-all duration-300">
              <div>
                <div className="w-full h-44 bg-slate-50 dark:bg-slate-900/20 flex items-center justify-center p-4 border-b border-brand-secondary/5">
                  <img src={stressAnalyticsIcon} alt="Stress & Analytics" className="h-full w-full object-contain max-h-36 transition-transform duration-500 hover:scale-105" />
                </div>
                <div className="p-6 space-y-2 text-left">
                  <h3 className="text-lg font-bold text-brand-dark">Stress & Analytics</h3>
                  <p className="text-xs text-brand-secondary font-medium leading-relaxed">Pantau mood harian Anda dengan indikator tingkat stres, dan visualisasikan kemajuan mingguan Anda melalui grafik analitik interaktif.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cara kerja aplikasi */}
      <section id="carakerja" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-reveal">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">

          {/* Left info column */}
          <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
            <h2 className="text-xs font-bold text-brand-secondary uppercase tracking-widest">Alur Penggunaan</h2>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-dark leading-tight">Cara Kerja WorkWell</h2>
            <p className="text-brand-secondary font-medium text-sm leading-relaxed">
              Kami menyederhanakan pelacakan kesehatan harian Anda ke dalam 3 langkah mudah yang otomatis membantu membangun kebiasaan sehat saat bekerja di depan komputer.
            </p>
            <div className="pt-4">
              <button
                onClick={currentUser ? () => navigate('/dashboard') : openRegisterModal}
                className="inline-flex items-center space-x-2 px-6 py-3.5 bg-brand-secondary hover:bg-brand-secondary/95 text-white font-bold rounded-2xl text-sm shadow-lg shadow-brand-secondary/10 transition-all cursor-pointer active:scale-98"
              >
                <span>Mulai Sekarang</span>
                <ArrowRight className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>

          {/* Right step list */}
          <div className="lg:col-span-7 mt-16 lg:mt-0 space-y-6">
            {/* Step 1 */}
            <div className="flex space-x-4 p-5 bg-white border border-brand-secondary/10 hover:border-brand-secondary/20 rounded-3xl transition-all shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-brand-secondary/10 text-brand-secondary flex items-center justify-center font-black text-lg flex-shrink-0">
                1
              </div>
              <div className="space-y-1 text-left">
                <h4 className="font-bold text-brand-dark">Daftarkan Akun & Atur Profil</h4>
                <p className="text-xs text-brand-secondary font-medium leading-relaxed">Buat akun Anda secara gratis. Sesuaikan target screen time (misal 1-3 jam) dan durasi istirahat yang Anda inginkan (5, 10, atau 15 menit) di menu profil.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex space-x-4 p-5 bg-white border border-brand-secondary/10 hover:border-brand-secondary/20 rounded-3xl transition-all shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-brand-secondary/10 text-brand-secondary flex items-center justify-center font-black text-lg flex-shrink-0">
                2
              </div>
              <div className="space-y-1 text-left">
                <h4 className="font-bold text-brand-dark">Bekerja dengan Timer Aktif</h4>
                <p className="text-xs text-brand-secondary font-medium leading-relaxed">Biarkan tracker menghitung waktu Anda bekerja. Saat limit tercapai, notifikasi popup break akan muncul otomatis menyarankan opsi regang atau hidrasi air.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex space-x-4 p-5 bg-white border border-brand-secondary/10 hover:border-brand-secondary/20 rounded-3xl transition-all shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-brand-secondary/10 text-brand-secondary flex items-center justify-center font-black text-lg flex-shrink-0">
                3
              </div>
              <div className="space-y-1 text-left">
                <h4 className="font-bold text-brand-dark">Pantau Kemajuan Kesehatan</h4>
                <p className="text-xs text-brand-secondary font-medium leading-relaxed">Catat kebiasaan harian Anda dan pantau grafik analitik mingguan di dashboard. Lihat seberapa baik Anda menyeimbangkan waktu kerja dan kesehatan fisik.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefit section */}
      <section id="tentang" className="py-24 bg-white border-t border-brand-secondary/10 relative scroll-reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-xs font-bold text-brand-secondary uppercase tracking-widest">Manfaat</h2>
            <h2 className="text-3xl font-extrabold text-brand-dark">Mengapa Menjaga Waktu Kerja Itu Penting?</h2>
            <p className="text-brand-secondary text-sm font-medium">Kebiasaan buruk di depan laptop dapat menyebabkan kelelahan kronis. WorkWell dirancang untuk mencegah efek samping tersebut.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 space-y-3 text-center">
              <div className="w-12 h-12 bg-brand-secondary/10 text-brand-secondary rounded-2xl flex items-center justify-center mx-auto">
                <Shield className="h-6 w-6" />
              </div>
              <h4 className="font-bold text-brand-dark">Hindari Cedera Fisik (RSI)</h4>
              <p className="text-xs text-brand-secondary font-medium leading-relaxed">Peregangan otot berkala membantu mencegah carpal tunnel syndrome, ketegangan tendon leher, dan nyeri tulang belakang bagian bawah.</p>
            </div>

            <div className="p-6 space-y-3 text-center">
              <div className="w-12 h-12 bg-brand-secondary/10 text-brand-secondary rounded-2xl flex items-center justify-center mx-auto">
                <Zap className="h-6 w-6" />
              </div>
              <h4 className="font-bold text-brand-dark">Tingkatkan Fokus & Produktivitas</h4>
              <p className="text-xs text-brand-secondary font-medium leading-relaxed">Studi menunjukkan istirahat kecil (microbreaks) yang terjadwal dapat memulihkan konsentrasi dan meningkatkan produktivitas hingga 20%.</p>
            </div>

            <div className="p-6 space-y-3 text-center">
              <div className="w-12 h-12 bg-brand-secondary/10 text-brand-secondary rounded-2xl flex items-center justify-center mx-auto">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <h4 className="font-bold text-brand-dark">Kurangi Ketegangan Mata</h4>
              <p className="text-xs text-brand-secondary font-medium leading-relaxed">Aturan 20-20-20 (melihat objek sejauh 20 kaki selama 20 detik tiap 20 menit) terbukti mengurangi sindrom penglihatan komputer (CVS).</p>
            </div>
          </div>
        </div>
      </section>

      {/* Wellness Center Preview Section */}
      <section className="py-24 bg-white dark:bg-slate-950 border-t border-brand-secondary/10 scroll-reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
            
            {/* Left Description */}
            <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-dark dark:text-brand-primary text-xs font-bold w-fit">
                <Sparkles className="h-4 w-4 text-brand-secondary" />
                <span>Wellness Center</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-brand-dark dark:text-white leading-tight">Pulihkan Pikiran & Regangkan Otot Anda</h2>
              <p className="text-brand-secondary dark:text-slate-400 font-medium text-sm leading-relaxed">
                Di dalam modul Wellness Center, kami menyediakan panduan visual yoga singkat, latihan peregangan statis, panduan pernapasan terarah, serta musik meditasi ambient berkualitas tinggi untuk meredakan ketegangan mata dan tubuh Anda sewaktu-waktu.
              </p>
              
              <div className="pt-2 flex justify-center lg:justify-start">
                <button
                  onClick={currentUser ? () => navigate('/wellness-center') : openRegisterModal}
                  className="flex items-center space-x-2 px-6 py-3.5 bg-brand-secondary hover:bg-brand-secondary/95 text-white font-bold rounded-2xl text-sm shadow-md shadow-brand-secondary/15 transition-all cursor-pointer active:scale-98"
                >
                  <span>Buka Wellness Center</span>
                  <ArrowRight className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>

            {/* Right Video Player Mockup */}
            <div className="lg:col-span-7 mt-16 lg:mt-0 flex justify-center">
              <div className="w-full max-w-xl bg-slate-950 rounded-[32px] overflow-hidden border border-slate-800 shadow-2xl relative aspect-video flex items-center justify-center group">
                
                {/* Visual Placeholder: Zen Garden Scene */}
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-dark/40 via-emerald-950/20 to-brand-primary/10 opacity-80 z-0" />
                
                <div className="relative z-10 flex flex-col items-center space-y-4 text-center p-6">
                  {/* Animated Breath Circle inside player */}
                  <div className="w-20 h-20 rounded-full bg-brand-secondary/25 flex items-center justify-center relative cursor-pointer group-hover:scale-105 transition-transform duration-300">
                    <div className="absolute inset-0 bg-brand-secondary/20 rounded-full animate-ping" />
                    <Play className="h-7 w-7 text-white fill-white relative z-10 translate-x-0.5" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-white text-sm">Zen Meditation: Napas Tenang</h5>
                    <p className="text-[10px] text-brand-primary font-bold">2 Menit Sesi Latihan</p>
                  </div>
                </div>

                {/* Video controls mockup bar */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950 to-transparent flex justify-between items-center text-slate-450 z-10 text-[10px]">
                  <div className="flex items-center space-x-2">
                    <Play className="h-3 w-3 fill-slate-300 text-slate-300" />
                    <span>0:42 / 2:00</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-12 h-1 bg-slate-700 rounded-full">
                      <div className="bg-brand-secondary h-full w-1/2" />
                    </div>
                    <Volume2 className="h-3.5 w-3.5 text-slate-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/30 border-t border-brand-secondary/10 scroll-reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <h2 className="text-xs font-bold text-brand-secondary uppercase tracking-widest">Testimoni Pengguna</h2>
            <h3 className="text-3xl sm:text-4xl font-black text-brand-dark dark:text-white">Kata Mereka Tentang WorkWell</h3>
            <p className="text-brand-secondary dark:text-slate-400 text-sm font-medium">Umpan balik nyata dari mahasiswa dan praktisi profesional yang telah mentransformasi kebiasaan harian mereka secara berkala.</p>
          </div>

          {/* Testimonial Slider Container */}
          <div className="relative max-w-6xl mx-auto px-2 sm:px-12">
            
            {/* Left/Right Arrow Buttons (Desktop/Tablet) */}
            <button
              onClick={() => setCurrentTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="absolute left-0 top-1/2 -translate-y-1/2 p-3 bg-white dark:bg-slate-900 border border-brand-secondary/15 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-md text-brand-secondary cursor-pointer z-10 hidden sm:block shadow-brand-secondary/5"
              title="Sebelumnya"
            >
              <ArrowRight className="h-5 w-5 transform rotate-180" />
            </button>

            <button
              onClick={() => setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length)}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-3 bg-white dark:bg-slate-900 border border-brand-secondary/15 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-md text-brand-secondary cursor-pointer z-10 hidden sm:block shadow-brand-secondary/5"
              title="Selanjutnya"
            >
              <ArrowRight className="h-5 w-5" />
            </button>

            {/* Testimonials Display Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500 ease-in-out">
              {[0, 1, 2].map((offset) => {
                const index = (currentTestimonialIndex + offset) % testimonials.length;
                const t = testimonials[index];
                
                // Hide second card on mobile, third card on tablet/mobile
                const visibilityClass = offset === 1 ? 'hidden md:flex' : offset === 2 ? 'hidden lg:flex' : 'flex';

                return (
                  <div
                    key={index}
                    className={`${visibilityClass} glass-card-light p-6 rounded-3xl border border-brand-secondary/10 flex flex-col justify-between hover:shadow-lg transition-all duration-500 h-64 animate-in fade-in duration-300`}
                  >
                    <div>
                      {/* Profile details at the TOP */}
                      <div className="flex items-center space-x-3.5 pb-4 border-b border-brand-secondary/10 dark:border-slate-800 mb-4">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${t.bgClass} text-white flex items-center justify-center font-black text-xs shadow-inner flex-shrink-0`}>
                          {t.initials}
                        </div>
                        <div className="text-left">
                          <h5 className="text-xs font-bold text-brand-dark dark:text-white line-clamp-1">{t.name}</h5>
                          <p className="text-[9px] text-brand-secondary dark:text-slate-400 font-semibold line-clamp-1">{t.role}</p>
                          <div className="flex space-x-0.5 mt-1">
                            {[...Array(t.rating)].map((_, i) => <Star key={i} className="h-3 w-3 text-amber-500 fill-amber-500" />)}
                            {[...Array(5 - t.rating)].map((_, i) => <Star key={i} className="h-3 w-3 text-slate-350 dark:text-slate-700" />)}
                          </div>
                        </div>
                      </div>
                      
                      {/* Comment text at the BOTTOM */}
                      <p className="text-xs text-brand-secondary dark:text-slate-350 leading-relaxed font-semibold italic text-left line-clamp-4">
                        "{t.comment}"
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile navigation buttons */}
            <div className="flex sm:hidden justify-between mt-6 px-4">
              <button
                onClick={() => setCurrentTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                className="px-4 py-2 bg-white dark:bg-slate-900 border border-brand-secondary/15 rounded-xl text-xs font-bold text-brand-secondary cursor-pointer"
              >
                Sebelumnya
              </button>
              <button
                onClick={() => setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length)}
                className="px-4 py-2 bg-white dark:bg-slate-900 border border-brand-secondary/15 rounded-xl text-xs font-bold text-brand-secondary cursor-pointer"
              >
                Selanjutnya
              </button>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentTestimonialIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                    currentTestimonialIndex === idx 
                      ? 'bg-brand-secondary w-5' 
                      : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                  title={`Ke slide ${idx + 1}`}
                />
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-brand-secondary/10 bg-white py-12 text-center text-xs text-brand-secondary">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <div className="flex justify-center">
            <WorkWellLogo logoColorClass="text-brand-dark dark:text-white" />
          </div>
          <p>© {new Date().getFullYear()} WorkWell. Dibuat untuk pekerja dan mahasiswa Indonesia agar tetap sehat di depan layar.</p>
        </div>
      </footer>

      {/* ========================================================
          AUTHENTICATION MODALS
      ======================================================== */}

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Blur Overlay */}
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
          />

          {/* Modal Container */}
          <div className="bg-white border border-brand-secondary/15 w-full max-w-3xl rounded-[32px] shadow-2xl relative z-10 flex overflow-hidden animate-in fade-in zoom-in-95 duration-200">

            {/* Left Pane - Illustration (Hidden on mobile) */}
            <div className="hidden md:flex md:w-1/2 flex-col justify-center items-center p-8 bg-brand-secondary/5 border-r border-brand-secondary/10 text-center space-y-6">
              <div className="relative">
                <div className="w-56 h-56 rounded-full bg-brand-primary/10 absolute -inset-1 blur-md animate-pulse" />
                <img
                  src={authIllustration}
                  alt="WorkWell Illustration"
                  className="w-52 h-52 object-contain rounded-full relative z-10 border border-brand-secondary/20 shadow-sm"
                />
              </div>
              <div className="space-y-2 max-w-xs mx-auto text-center">
                <h3 className="font-extrabold text-brand-dark text-base">Mulai Hidup Sehat Saat Bekerja</h3>
                <p className="text-[10px] text-brand-secondary font-semibold leading-relaxed">
                  Pantau durasi layar, asupan air minum harian, peregangan fisik, dan pantau tingkat stres psikologis Anda secara berkala.
                </p>
              </div>
            </div>

            {/* Right Pane - Form */}
            <div className="w-full md:w-1/2 p-8 md:p-10 relative space-y-6 flex flex-col justify-center">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Brand Header */}
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-1 px-3 bg-brand-secondary rounded-2xl shadow-md">
                  <WorkWellLogo iconOnly={true} className="h-10 w-10 text-white" logoColorClass="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-brand-dark">Welcome Back</h2>
                  <p className="text-xs text-brand-secondary mt-1 font-semibold">Masuk untuk melanjutkan monitoring kesehatan Anda</p>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-start space-x-2.5 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 rounded-2xl text-xs font-bold animate-in fade-in duration-150 text-left">
                  <AlertCircle className="h-4.5 w-4.5 mt-0.5 flex-shrink-0" />
                  <span className="leading-normal">{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold text-brand-dark uppercase tracking-wider pl-1">Email</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                      <Mail className="h-4.5 w-4.5" />
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className="w-full py-3.5 pl-11 pr-4 bg-brand-bg/50 border border-slate-200 focus:border-brand-secondary text-sm rounded-2xl text-slate-800 placeholder-slate-400 outline-none transition-all focus:ring-1 focus:ring-brand-secondary font-semibold"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold text-brand-dark uppercase tracking-wider pl-1">Kata Sandi</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                      <Lock className="h-4.5 w-4.5" />
                    </span>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full py-3.5 pl-11 pr-4 bg-brand-bg/50 border border-slate-200 focus:border-brand-secondary text-sm rounded-2xl text-slate-800 placeholder-slate-400 outline-none transition-all focus:ring-1 focus:ring-brand-secondary font-semibold"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Remember me */}
                <div className="flex items-center space-x-2 pl-1 pt-1 select-none">
                  <input
                    type="checkbox"
                    id="remember"
                    className="rounded border-slate-300 text-brand-secondary focus:ring-brand-secondary h-4 w-4 cursor-pointer"
                  />
                  <label htmlFor="remember" className="text-xs font-semibold text-brand-secondary cursor-pointer">Remember me</label>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 px-4 bg-brand-primary hover:bg-brand-primary/95 text-brand-dark font-bold rounded-2xl text-sm shadow-md shadow-brand-primary/10 transition-all cursor-pointer flex items-center justify-center space-x-2 mt-4 active:scale-98 disabled:opacity-55"
                  disabled={loading}
                >
                  <span>{loading ? 'Masuk...' : 'Login'}</span>
                </button>
              </form>

              {/* Footer */}
              <div className="text-center text-xs text-brand-secondary font-semibold pt-1">
                <span>Don't have an account? </span>
                <button
                  onClick={openRegisterModal}
                  className="text-brand-secondary font-bold hover:underline cursor-pointer"
                >
                  Register
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegister && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Blur Overlay */}
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
          />

          {/* Modal Container */}
          <div className="bg-white border border-brand-secondary/15 w-full max-w-3xl rounded-[32px] shadow-2xl relative z-10 flex overflow-hidden animate-in fade-in zoom-in-95 duration-200">

            {/* Left Pane - Illustration (Hidden on mobile) */}
            <div className="hidden md:flex md:w-1/2 flex-col justify-center items-center p-8 bg-brand-secondary/5 border-r border-brand-secondary/10 text-center space-y-6">
              <div className="relative">
                <div className="w-56 h-56 rounded-full bg-brand-primary/10 absolute -inset-1 blur-md animate-pulse" />
                <img
                  src={registerIllustration}
                  alt="WorkWell Illustration"
                  className="w-52 h-52 object-contain rounded-full relative z-10 border border-brand-secondary/20 shadow-sm"
                />
              </div>
              <div className="space-y-2 max-w-xs mx-auto text-center">
                <h3 className="font-extrabold text-brand-dark text-base">Gabung Bersama WorkWell</h3>
                <p className="text-[10px] text-brand-secondary font-semibold leading-relaxed">
                  Bergabunglah bersama ribuan pekerja & mahasiswa untuk hidup lebih sehat, produktif, dan seimbang di depan layar komputer.
                </p>
              </div>
            </div>

            {/* Right Pane - Form */}
            <div className="w-full md:w-1/2 p-8 md:p-10 relative space-y-5 flex flex-col justify-center">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Header */}
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-1 px-3 bg-brand-secondary rounded-2xl shadow-md">
                  <WorkWellLogo iconOnly={true} className="h-10 w-10 text-white" logoColorClass="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-brand-dark">Create Account</h2>
                  <p className="text-xs text-brand-secondary mt-1 font-semibold">Langkah awal untuk hidup sehat di depan layar</p>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-start space-x-2.5 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 rounded-2xl text-xs font-bold animate-in fade-in duration-150 text-left">
                  <AlertCircle className="h-4.5 w-4.5 mt-0.5 flex-shrink-0" />
                  <span className="leading-normal">{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">

                {/* Name */}
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-bold text-brand-dark uppercase tracking-wider pl-1">Nama Lengkap</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                      <User className="h-4.5 w-4.5" />
                    </span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nama Lengkap"
                      className="w-full py-3 pl-11 pr-4 bg-brand-bg/50 border border-slate-200 focus:border-brand-secondary text-sm rounded-2xl text-slate-800 placeholder-slate-400 outline-none transition-all focus:ring-1 focus:ring-brand-secondary font-semibold"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-bold text-brand-dark uppercase tracking-wider pl-1">Email</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                      <Mail className="h-4.5 w-4.5" />
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className="w-full py-3 pl-11 pr-4 bg-brand-bg/50 border border-slate-200 focus:border-brand-secondary text-sm rounded-2xl text-slate-800 placeholder-slate-400 outline-none transition-all focus:ring-1 focus:ring-brand-secondary font-semibold"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-bold text-brand-dark uppercase tracking-wider pl-1">Kata Sandi</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                      <Lock className="h-4.5 w-4.5" />
                    </span>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      className="w-full py-3 pl-11 pr-4 bg-brand-bg/50 border border-slate-200 focus:border-brand-secondary text-sm rounded-2xl text-slate-800 placeholder-slate-400 outline-none transition-all focus:ring-1 focus:ring-brand-secondary font-semibold"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-bold text-brand-dark uppercase tracking-wider pl-1">Konfirmasi Kata Sandi</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                      <Lock className="h-4.5 w-4.5" />
                    </span>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ketik ulang kata sandi"
                      className="w-full py-3 pl-11 pr-4 bg-brand-bg/50 border border-slate-200 focus:border-brand-secondary text-sm rounded-2xl text-slate-800 placeholder-slate-400 outline-none transition-all focus:ring-1 focus:ring-brand-secondary font-semibold"
                      disabled={loading}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 px-4 bg-brand-primary hover:bg-brand-primary/95 text-brand-dark font-bold rounded-2xl text-sm shadow-md shadow-brand-primary/10 transition-all cursor-pointer flex items-center justify-center space-x-2 mt-4 active:scale-98 disabled:opacity-55"
                  disabled={loading}
                >
                  <span>{loading ? 'Mendaftar...' : 'Register'}</span>
                </button>
              </form>

              {/* Footer */}
              <div className="text-center text-xs text-brand-secondary font-semibold pt-1">
                <span>Already have an account? </span>
                <button
                  onClick={openLoginModal}
                  className="text-brand-secondary font-bold hover:underline cursor-pointer"
                >
                  Login
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
