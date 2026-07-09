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
  Settings, Play, Bell, BarChart3, ChevronDown, ChevronUp,
  Music, Volume2, Heart, Award, Coffee, Eye, Star
} from 'lucide-react';

const StatCounter = ({ value, label, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value.replace(/[^0-9]/g, ''), 10);
    if (start === end || isNaN(end)) {
      setCount(value);
      return;
    }

    let totalDuration = 1500; // 1.5s duration
    let stepTime = 30;
    let steps = totalDuration / stepTime;
    let increment = Math.ceil(end / steps);

    let timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace('.0', '') + 'k';
    }
    return num;
  };

  const displayCount = value.includes('k') ? formatNumber(count) : count;

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-brand-secondary/15 shadow-sm text-center relative overflow-hidden group hover:border-brand-secondary/35 transition-all duration-300">
      <div className="absolute top-0 right-0 w-20 h-20 bg-brand-primary/10 rounded-full blur-lg pointer-events-none transform translate-x-6 -translate-y-6 group-hover:scale-150 transition-all duration-500" />
      <div className="text-3xl sm:text-4xl font-black text-brand-dark dark:text-white mb-2">
        {prefix}{displayCount}{suffix}
      </div>
      <div className="text-xs sm:text-sm font-semibold text-brand-secondary">{label}</div>
    </div>
  );
};

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

  // Carousel State
  const [activeSlide, setActiveSlide] = useState(0);

  // Wellness Tips State
  const [activeTip, setActiveTip] = useState(0);
  const wellnessTips = [
    {
      title: "Aturan 20-20-20",
      content: "Setiap 20 menit menatap layar, alihkan pandangan untuk melihat objek sejauh 20 kaki (6 meter) selama 20 detik untuk mengistirahatkan otot mata Anda.",
      category: "Kesehatan Mata"
    },
    {
      title: "Hidrasi Rutin",
      content: "Minum minimal satu gelas air putih setiap 2 jam. Hidrasi yang baik menjaga konsentrasi, mencegah sakit kepala, dan memperlancar metabolisme tubuh.",
      category: "Hidrasi Tubuh"
    },
    {
      title: "Peregangan Pundak & Leher",
      content: "Lakukan putaran pundak ke belakang sebanyak 5 kali dan miringkan leher ke kanan dan kiri perlahan untuk melemaskan otot trapezius yang tegang.",
      category: "Peregangan Fisik"
    },
    {
      title: "Napas Kotak (Box Breathing)",
      content: "Tarik napas 4 detik, tahan 4 detik, embuskan 4 detik, tahan 4 detik. Teknik ini menurunkan detak jantung dan membantu meredakan tingkat stres dengan cepat.",
      category: "Kesehatan Mental"
    }
  ];

  useEffect(() => {
    const tipTimer = setInterval(() => {
      setActiveTip((prev) => (prev + 1) % wellnessTips.length);
    }, 7000);
    return () => clearInterval(tipTimer);
  }, []);

  // FAQ State
  const [openFaq, setOpenFaq] = useState(null);
  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

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
      <section className="relative overflow-hidden pt-28 pb-36 lg:pt-36 lg:pb-44">
        {/* Floating Decorative Shapes */}
        <div className="absolute top-1/4 right-10 w-24 h-24 rounded-full bg-brand-primary/20 blur-xl pointer-events-none animate-float-slow" />
        <div className="absolute bottom-10 left-12 w-32 h-12 rounded-full bg-brand-secondary/20 blur-xl pointer-events-none animate-float-medium" />
        
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
        {/* Overlay */}
        <div className="absolute inset-0 z-[1] hero-overlay" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">

            {/* Left Content */}
            <div className="text-center lg:text-left lg:col-span-6 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-secondary/10 border border-brand-secondary/25 text-brand-dark dark:text-brand-primary text-xs font-bold animate-pulse">
                <Sparkles className="h-4.5 w-4.5 text-brand-secondary animate-spin" />
                <span>Modern Digital Wellbeing Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-brand-dark dark:text-white min-h-[7rem] md:min-h-[8.5rem] lg:min-h-[11rem]">
                {typedText1}
                <br />
                {typedText2}
                <span className="inline-block w-1.5 h-8 md:h-12 bg-brand-secondary ml-1 animate-pulse" />
              </h1>

              <p className="text-base sm:text-lg text-brand-secondary dark:text-emerald-400/90 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Pantau kebiasaan layar Anda, bangun rutinitas yang menyehatkan, dan tingkatkan fokus kerja Anda secara optimal tanpa mengorbankan kesehatan fisik.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                {currentUser ? (
                  <Link
                    to="/dashboard"
                    className="w-full sm:w-auto px-8 py-4 bg-brand-secondary hover:bg-brand-secondary/95 text-white rounded-2xl font-bold shadow-lg shadow-brand-secondary/20 transition-all text-center flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
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
                      <span>Mulai Gratis Sekarang</span>
                      <ArrowRight className="h-5 w-5" />
                    </button>
                    <button
                      onClick={openLoginModal}
                      className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 border border-slate-200 text-brand-secondary rounded-2xl font-bold shadow-sm transition-all text-center cursor-pointer active:scale-98"
                    >
                      Login
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Right SaaS Mock Dashboard Preview */}
            <div className="mt-16 lg:mt-0 lg:col-span-6 flex justify-center">
              <div className="w-full max-w-lg bg-white/70 dark:bg-slate-950/80 border border-brand-secondary/15 rounded-[32px] p-6 shadow-2xl space-y-5 backdrop-blur-md select-none">

                {/* Header Mockup */}
                <div className="flex justify-between items-center pb-3 border-b border-brand-secondary/10 dark:border-slate-800">
                  <div className="flex items-center space-x-2">
                    <div className="w-3.5 h-3.5 rounded-full bg-brand-secondary/10 flex items-center justify-center">
                      <WorkWellLogo iconOnly={true} className="h-4.5 w-4.5 text-brand-secondary animate-pulse" logoColorClass="text-brand-secondary" />
                    </div>
                    <span className="text-xs font-bold text-brand-dark dark:text-slate-350">WorkWell SaaS Preview</span>
                  </div>
                  <div className="flex space-x-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
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

                  <div className="bg-white dark:bg-slate-900 border border-brand-secondary/15 p-4 rounded-2xl flex flex-col justify-between h-24">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-secondary">Screen Time</span>
                      <span className="text-xs">⏱️</span>
                    </div>
                    <div className="text-lg font-extrabold text-brand-dark dark:text-white">2j 15m / 3j</div>
                  </div>
                </div>

                {/* Habits items list mockup */}
                <div className="space-y-3 bg-white dark:bg-slate-900 border border-brand-secondary/10 rounded-2xl p-4">
                  <div className="flex items-center justify-between text-xs font-bold text-brand-dark dark:text-slate-300 pb-2 border-b border-brand-secondary/5">
                    <span>Habit Tracker</span>
                    <span className="text-brand-primary">🔥 8 Days Streak</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2 text-brand-secondary">
                      <Droplet className="h-4 w-4 text-blue-500" />
                      <span className="dark:text-slate-300">Air Minum</span>
                    </div>
                    <span className="font-bold text-brand-dark dark:text-slate-200">6 / 8 Gelas</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2 text-brand-secondary">
                      <Dumbbell className="h-4 w-4 text-brand-secondary" />
                      <span className="dark:text-slate-300">Peregangan</span>
                    </div>
                    <span className="font-bold text-brand-dark dark:text-slate-200">3 / 5 Sesi</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1. Statistics Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCounter value="15400" label="Pengguna Aktif" prefix="" suffix="+" />
          <StatCounter value="42" label="Peningkatan Fokus" prefix="+" suffix="%" />
          <StatCounter value="890000" label="Break Reminders Dikirim" prefix="" suffix="+" />
          <StatCounter value="98" label="Kepuasan Pengguna" prefix="" suffix="%" />
        </div>
      </section>

      {/* 3. Interactive Feature Cards */}
      <section id="fitur" className="py-24 bg-white dark:bg-slate-950 border-y border-brand-secondary/10 relative overflow-hidden scroll-reveal">
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-brand-primary/10 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-brand-secondary/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-extrabold text-brand-secondary uppercase tracking-widest">Modul Wellbeing</h2>
            <p className="text-3xl sm:text-4xl font-black text-brand-dark dark:text-white">Fitur Cerdas Penjaga Kesehatan Anda</p>
            <p className="text-brand-secondary dark:text-slate-400 text-sm font-medium">Berbagai modul pintar yang bersinergi membantu menjaga kebugaran mata, otot, hidrasi, dan pikiran Anda secara berkala.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="glass-card-light overflow-hidden rounded-3xl border border-brand-secondary/10 flex flex-col justify-between hover:shadow-xl hover:border-brand-secondary/30 transition-all duration-300 group">
              <div>
                <div className="w-full h-44 bg-slate-50 dark:bg-slate-900/40 flex items-center justify-center p-4 border-b border-brand-secondary/5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <img src={screenTimeIcon} alt="Screen Time" className="h-full w-full object-contain max-h-36 transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="p-6 space-y-2 text-left">
                  <h3 className="text-lg font-bold text-brand-dark dark:text-white flex items-center gap-1.5">
                    <Clock className="h-4.5 w-4.5 text-brand-secondary" />
                    <span>Screen Time Monitor</span>
                  </h3>
                  <p className="text-xs text-brand-secondary dark:text-slate-400 font-medium leading-relaxed">Timer durasi kerja dengan reminder otomatis ketika melebihi batas waktu sehat. Jaga mata Anda agar tetap rileks.</p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="glass-card-light overflow-hidden rounded-3xl border border-brand-secondary/10 flex flex-col justify-between hover:shadow-xl hover:border-brand-secondary/30 transition-all duration-300 group">
              <div>
                <div className="w-full h-44 bg-slate-50 dark:bg-slate-900/40 flex items-center justify-center p-4 border-b border-brand-secondary/5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <img src={waterIntakeIcon} alt="Water Intake" className="h-full w-full object-contain max-h-36 transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="p-6 space-y-2 text-left">
                  <h3 className="text-lg font-bold text-brand-dark dark:text-white flex items-center gap-1.5">
                    <Droplet className="h-4.5 w-4.5 text-blue-500" />
                    <span>Habit Water Intake</span>
                  </h3>
                  <p className="text-xs text-brand-secondary dark:text-slate-400 font-medium leading-relaxed">Pengingat berkala untuk minum air. Capai target gelas harian Anda secara teratur agar tubuh tetap terhidrasi dengan baik.</p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="glass-card-light overflow-hidden rounded-3xl border border-brand-secondary/10 flex flex-col justify-between hover:shadow-xl hover:border-brand-secondary/30 transition-all duration-300 group">
              <div>
                <div className="w-full h-44 bg-slate-50 dark:bg-slate-900/40 flex items-center justify-center p-4 border-b border-brand-secondary/5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <img src={movementTrackerIcon} alt="Movement Tracker" className="h-full w-full object-contain max-h-36 transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="p-6 space-y-2 text-left">
                  <h3 className="text-lg font-bold text-brand-dark dark:text-white flex items-center gap-1.5">
                    <Dumbbell className="h-4.5 w-4.5 text-brand-secondary" />
                    <span>Movement Tracker</span>
                  </h3>
                  <p className="text-xs text-brand-secondary dark:text-slate-400 font-medium leading-relaxed">Mencatat aktivitas peregangan dan olahraga ringan Anda. Hindari kekakuan otot leher, punggung, dan bahu.</p>
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="glass-card-light overflow-hidden rounded-3xl border border-brand-secondary/10 flex flex-col justify-between hover:shadow-xl hover:border-brand-secondary/30 transition-all duration-300 group">
              <div>
                <div className="w-full h-44 bg-slate-50 dark:bg-slate-900/40 flex items-center justify-center p-4 border-b border-brand-secondary/5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <img src={stressAnalyticsIcon} alt="Stress & Analytics" className="h-full w-full object-contain max-h-36 transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="p-6 space-y-2 text-left">
                  <h3 className="text-lg font-bold text-brand-dark dark:text-white flex items-center gap-1.5">
                    <TrendingUp className="h-4.5 w-4.5 text-emerald-500" />
                    <span>Stress & Analytics</span>
                  </h3>
                  <p className="text-xs text-brand-secondary dark:text-slate-400 font-medium leading-relaxed">Pantau mood harian Anda dengan indikator tingkat stres, dan visualisasikan kemajuan mingguan Anda melalui grafik analitik interaktif.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. How WorkWell Works Section (Timeline 5-Step) */}
      <section id="carakerja" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-reveal">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-extrabold text-brand-secondary uppercase tracking-widest">Alur Integrasi</h2>
          <p className="text-3xl sm:text-4xl font-black text-brand-dark dark:text-white">Bagaimana WorkWell Membantu Anda</p>
          <p className="text-brand-secondary dark:text-slate-400 text-sm font-medium">Langkah sederhana untuk mengintegrasikan kebiasaan sehat ke dalam rutinitas kerja harian Anda.</p>
        </div>

        {/* 5-Step Timeline */}
        <div className="relative mt-12">
          {/* Connecting Line (hidden on small screen) */}
          <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0 hidden lg:block" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 relative z-10">
            {/* Step 1 */}
            <div className="glass-panel p-6 rounded-3xl border border-brand-secondary/15 flex flex-col items-center text-center space-y-4 hover:border-brand-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-dark dark:text-brand-primary flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-brand-dark dark:text-white flex items-center justify-center gap-1.5 text-sm">
                  <User className="h-4.5 w-4.5 text-brand-secondary" />
                  <span>Daftar Akun</span>
                </h4>
                <p className="text-[11px] text-brand-secondary dark:text-slate-400 leading-relaxed font-semibold">Buat akun WorkWell gratis Anda secara cepat dengan aman.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="glass-panel p-6 rounded-3xl border border-brand-secondary/15 flex flex-col items-center text-center space-y-4 hover:border-brand-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-dark dark:text-brand-primary flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-brand-dark dark:text-white flex items-center justify-center gap-1.5 text-sm">
                  <Settings className="h-4.5 w-4.5 text-brand-secondary" />
                  <span>Atur Batas Waktu</span>
                </h4>
                <p className="text-[11px] text-brand-secondary dark:text-slate-400 leading-relaxed font-semibold">Sesuaikan target screen time & frekuensi break sesuai kenyamanan.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="glass-panel p-6 rounded-3xl border border-brand-secondary/15 flex flex-col items-center text-center space-y-4 hover:border-brand-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-dark dark:text-brand-primary flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-brand-dark dark:text-white flex items-center justify-center gap-1.5 text-sm">
                  <Play className="h-4.5 w-4.5 text-brand-secondary" />
                  <span>Mulai Bekerja</span>
                </h4>
                <p className="text-[11px] text-brand-secondary dark:text-slate-400 leading-relaxed font-semibold">Aktifkan modul tracker saat Anda mulai bekerja di depan laptop.</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="glass-panel p-6 rounded-3xl border border-brand-secondary/15 flex flex-col items-center text-center space-y-4 hover:border-brand-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-dark dark:text-brand-primary flex items-center justify-center font-bold text-lg">
                4
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-brand-dark dark:text-white flex items-center justify-center gap-1.5 text-sm">
                  <Bell className="h-4.5 w-4.5 text-brand-secondary" />
                  <span>Notifikasi Rehat</span>
                </h4>
                <p className="text-[11px] text-brand-secondary dark:text-slate-400 leading-relaxed font-semibold">Terima pop-up interaktif ramah untuk minum dan regangkan otot.</p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="glass-panel p-6 rounded-3xl border border-brand-secondary/15 flex flex-col items-center text-center space-y-4 hover:border-brand-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-dark dark:text-brand-primary flex items-center justify-center font-bold text-lg">
                5
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-brand-dark dark:text-white flex items-center justify-center gap-1.5 text-sm">
                  <BarChart3 className="h-4.5 w-4.5 text-brand-secondary" />
                  <span>Evaluasi Progress</span>
                </h4>
                <p className="text-[11px] text-brand-secondary dark:text-slate-400 leading-relaxed font-semibold">Tinjau perkembangan kebiasaan mingguan Anda di dashboard.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Dashboard Screenshot Carousel (Interactive Panel Preview) */}
      <section className="py-24 bg-white dark:bg-slate-950 border-t border-brand-secondary/10 scroll-reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <h2 className="text-xs font-extrabold text-brand-secondary uppercase tracking-widest">SaaS Preview</h2>
            <p className="text-3xl sm:text-4xl font-black text-brand-dark dark:text-white">Eksplorasi Antarmuka WorkWell</p>
            <p className="text-brand-secondary dark:text-slate-400 text-sm font-medium">Lihat bagaimana kami menyajikan dasbor pemantauan kesehatan digital yang ramah dan menenangkan.</p>
          </div>

          {/* Interactive Slideshow Panel */}
          <div className="max-w-4xl mx-auto bg-slate-50 dark:bg-slate-900/60 rounded-[32px] p-4 sm:p-6 border border-brand-secondary/15 shadow-2xl relative overflow-hidden">
            
            {/* Title Tabs */}
            <div className="flex justify-center space-x-2 sm:space-x-4 mb-6 border-b border-brand-secondary/10 pb-4">
              {['Dasbor Utama', 'Wellness Center Room', 'Pengaturan Target'].map((tab, idx) => (
                <button
                  key={tab}
                  onClick={() => setActiveSlide(idx)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    activeSlide === idx 
                      ? 'bg-brand-secondary text-white shadow-md' 
                      : 'text-brand-secondary dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Slide Render Container */}
            <div className="relative min-h-[18rem] md:min-h-[22rem] flex flex-col justify-center transition-all duration-300">
              
              {activeSlide === 0 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  {/* Mock Dashboard */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-brand-secondary/10 flex flex-col justify-between h-36">
                      <div className="flex justify-between items-center text-xs font-bold text-brand-secondary">
                        <span>Wellness Score</span>
                        <span>🔥</span>
                      </div>
                      <div className="text-3xl font-black text-brand-dark dark:text-white">82%</div>
                      <p className="text-[10px] text-slate-450 dark:text-slate-400 font-semibold">Bagus! Sangat konsisten menjaga hidrasi hari ini.</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-brand-secondary/10 flex flex-col justify-between h-36">
                      <div className="flex justify-between items-center text-xs font-bold text-brand-secondary">
                        <span>Work Session Active</span>
                        <span>⏱️</span>
                      </div>
                      <div className="text-3xl font-black text-brand-dark dark:text-white text-glow-green">01j 42m</div>
                      <div className="w-full bg-slate-100 dark:bg-slate-850 h-2 rounded-full overflow-hidden">
                        <div className="bg-brand-secondary h-full" style={{ width: '56%' }} />
                      </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-brand-secondary/10 flex flex-col justify-between h-36">
                      <div className="flex justify-between items-center text-xs font-bold text-brand-secondary">
                        <span>Streaks Harian</span>
                        <span>⭐</span>
                      </div>
                      <div className="text-3xl font-black text-brand-dark dark:text-white">8 Hari</div>
                      <p className="text-[10px] text-slate-450 dark:text-slate-400 font-semibold">Tinggal 2 hari lagi untuk memecahkan rekor mingguan!</p>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-brand-secondary/10 space-y-3">
                    <h5 className="text-xs font-bold text-brand-dark dark:text-white text-left">Peregangan Hari Ini</h5>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="flex justify-between p-2.5 bg-slate-50 dark:bg-slate-850 rounded-xl">
                        <span className="font-semibold text-brand-secondary">Neck Roll</span>
                        <span className="font-bold text-brand-dark dark:text-white">Selesai (2x)</span>
                      </div>
                      <div className="flex justify-between p-2.5 bg-slate-50 dark:bg-slate-850 rounded-xl">
                        <span className="font-semibold text-brand-secondary">Shoulder Shrug</span>
                        <span className="font-bold text-brand-dark dark:text-white">Belum (0/3)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSlide === 1 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  {/* Mock Wellness Center */}
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-brand-secondary/10 flex flex-col md:flex-row items-center gap-6 justify-between">
                    <div className="space-y-3 text-left">
                      <div className="px-2 py-1 bg-brand-primary/20 text-brand-dark dark:text-brand-primary text-[10px] font-bold rounded-lg w-fit">
                        Ambient Audio Player
                      </div>
                      <h4 className="font-black text-brand-dark dark:text-white text-lg">Hutan Hujan Tropis (Rainforest)</h4>
                      <p className="text-xs text-brand-secondary dark:text-slate-400 max-w-sm">Dengarkan rintik hujan dan kicau burung lembut untuk menjaga fokus dan meredakan kecemasan.</p>
                      
                      <div className="flex items-center space-x-3 pt-2">
                        <button className="p-2.5 bg-brand-secondary text-white rounded-full hover:scale-105 transition-transform cursor-pointer">
                          <Play className="h-4.5 w-4.5 fill-white" />
                        </button>
                        <Volume2 className="h-4.5 w-4.5 text-brand-secondary" />
                        <div className="w-24 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full">
                          <div className="bg-brand-secondary h-full w-2/3" />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center space-y-2 p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl w-full md:w-56">
                      <span className="text-[10px] font-bold text-brand-secondary uppercase">Mulai Box Breathing</span>
                      <div className="w-20 h-20 rounded-full border-4 border-brand-secondary/20 flex items-center justify-center animate-pulse">
                        <div className="w-14 h-14 bg-brand-secondary/15 rounded-full flex items-center justify-center">
                          <span className="text-xs font-black text-brand-secondary">Tarik</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-brand-dark dark:text-white">4 Detik</span>
                    </div>
                  </div>
                </div>
              )}

              {activeSlide === 2 && (
                <div className="space-y-6 animate-in fade-in duration-300 text-left">
                  {/* Mock Settings */}
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-brand-secondary/10 space-y-6">
                    <div className="flex justify-between items-center pb-4 border-b border-brand-secondary/5">
                      <div>
                        <h4 className="font-bold text-brand-dark dark:text-white text-sm">Timer Otomatis Istirahat</h4>
                        <p className="text-[10px] text-brand-secondary dark:text-slate-400">Notifikasi pop-up akan muncul otomatis menyarankan opsi istirahat sejenak.</p>
                      </div>
                      <div className="w-10 h-6 bg-brand-secondary rounded-full p-1 cursor-pointer flex justify-end">
                        <div className="bg-white w-4 h-4 rounded-full shadow-md" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-brand-dark dark:text-slate-300 uppercase tracking-wide">Target Screen Time Harian</label>
                        <select className="w-full p-3 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-brand-dark dark:text-slate-200 outline-none">
                          <option>3 Jam Kerja</option>
                          <option>4 Jam Kerja</option>
                          <option>5 Jam Kerja</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-brand-dark dark:text-slate-300 uppercase tracking-wide">Durasi Break</label>
                        <select className="w-full p-3 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-brand-dark dark:text-slate-200 outline-none">
                          <option>10 Menit Istirahat</option>
                          <option>15 Menit Istirahat</option>
                          <option>20 Menit Istirahat</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* 5. Wellness Tips Section (Rotating Banner) */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 scroll-reveal">
        <div className="glass-panel p-6 sm:p-10 rounded-[32px] border border-brand-secondary/15 bg-gradient-to-tr from-brand-primary/5 via-white to-transparent dark:via-slate-900 relative overflow-hidden shadow-xl text-center">
          <div className="absolute top-4 left-6 flex items-center space-x-2 text-[10px] font-bold text-brand-secondary uppercase tracking-widest">
            <Heart className="h-4 w-4 text-rose-500 fill-rose-500 animate-pulse" />
            <span>Tips Sehat Hari Ini: {wellnessTips[activeTip].category}</span>
          </div>

          <div className="mt-8 space-y-4 min-h-[6rem] flex flex-col justify-center">
            <h4 className="text-xl sm:text-2xl font-black text-brand-dark dark:text-white">
              {wellnessTips[activeTip].title}
            </h4>
            <p className="text-xs sm:text-sm text-brand-secondary dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
              "{wellnessTips[activeTip].content}"
            </p>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-1.5 mt-8">
            {wellnessTips.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTip(idx)}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  activeTip === idx ? 'bg-brand-secondary w-5' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Video Preview Section (Wellness Center Showcase) */}
      <section className="py-24 bg-white dark:bg-slate-950 border-t border-brand-secondary/10 scroll-reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
            
            {/* Left Description */}
            <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-dark dark:text-brand-primary text-xs font-bold w-fit">
                <Award className="h-4 w-4 text-brand-secondary" />
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
                
                {/* Visual Placeholder: Zen Garden Ambient Scene */}
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

      {/* 7. Testimonials Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-reveal">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-extrabold text-brand-secondary uppercase tracking-widest">Testimoni</h2>
          <p className="text-3xl sm:text-4xl font-black text-brand-dark dark:text-white">Cerita Pengguna WorkWell</p>
          <p className="text-brand-secondary dark:text-slate-400 text-sm font-medium">Bagaimana WorkWell membantu para pekerja IT, desainer, dan pelajar mencapai keseimbangan hidup.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-brand-secondary/15 flex flex-col justify-between hover:shadow-lg hover:border-brand-secondary/30 transition-all duration-300">
            <div className="space-y-4 text-left">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 text-amber-500 fill-amber-500" />)}
              </div>
              <p className="text-xs sm:text-sm text-brand-secondary dark:text-slate-300 leading-relaxed font-semibold italic">
                "Sangat membantu mengatasi pegal punggung akibat ngoding seharian. Fitur pengingat minumnya jempolan, tidak berisik tapi sangat efektif!"
              </p>
            </div>
            <div className="flex items-center space-x-3.5 pt-6 border-t border-brand-secondary/10 dark:border-slate-800 mt-6">
              <div className="w-10 h-10 rounded-full bg-brand-primary text-brand-dark flex items-center justify-center font-black text-sm">
                AK
              </div>
              <div className="text-left">
                <h5 className="text-xs font-bold text-brand-dark dark:text-white">Andini Kartika</h5>
                <p className="text-[10px] text-brand-secondary font-medium">Software Engineer</p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-brand-secondary/15 flex flex-col justify-between hover:shadow-lg hover:border-brand-secondary/30 transition-all duration-300">
            <div className="space-y-4 text-left">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 text-amber-500 fill-amber-500" />)}
              </div>
              <p className="text-xs sm:text-sm text-brand-secondary dark:text-slate-300 leading-relaxed font-semibold italic">
                "Desain UI-nya sangat elegan dan menenangkan. WorkWell membuat saya sadar pentingnya mengambil jeda sejenak dari aktivitas mendesain layar."
              </p>
            </div>
            <div className="flex items-center space-x-3.5 pt-6 border-t border-brand-secondary/10 dark:border-slate-800 mt-6">
              <div className="w-10 h-10 rounded-full bg-brand-secondary text-white flex items-center justify-center font-black text-sm">
                BP
              </div>
              <div className="text-left">
                <h5 className="text-xs font-bold text-brand-dark dark:text-white">Budi Pratama</h5>
                <p className="text-[10px] text-brand-secondary font-medium">UI/UX Designer</p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-brand-secondary/15 flex flex-col justify-between hover:shadow-lg hover:border-brand-secondary/30 transition-all duration-300">
            <div className="space-y-4 text-left">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 text-amber-500 fill-amber-500" />)}
              </div>
              <p className="text-xs sm:text-sm text-brand-secondary dark:text-slate-300 leading-relaxed font-semibold italic">
                "Dulu sering sekali sakit kepala karena menatap layar laptop nonstop untuk tugas. Sejak pakai WorkWell, ritme kerja & kuliah saya jadi lebih terkontrol."
              </p>
            </div>
            <div className="flex items-center space-x-3.5 pt-6 border-t border-brand-secondary/10 dark:border-slate-800 mt-6">
              <div className="w-10 h-10 rounded-full bg-brand-primary text-brand-dark flex items-center justify-center font-black text-sm">
                CO
              </div>
              <div className="text-left">
                <h5 className="text-xs font-bold text-brand-dark dark:text-white">Cindy Olivia</h5>
                <p className="text-[10px] text-brand-secondary font-medium">Mahasiswi Kedokteran</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ Section (Accordion Components) */}
      <section className="py-24 bg-white dark:bg-slate-950 border-t border-brand-secondary/10 scroll-reveal">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-extrabold text-brand-secondary uppercase tracking-widest">Pertanyaan Umum</h2>
            <p className="text-3xl sm:text-4xl font-black text-brand-dark dark:text-white">Ada Pertanyaan?</p>
            <p className="text-brand-secondary dark:text-slate-400 text-sm font-medium">Jawaban lengkap atas beberapa pertanyaan mendasar mengenai penggunaan WorkWell.</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Apakah WorkWell sepenuhnya gratis?",
                a: "Ya, Anda bisa mendaftar dan menggunakan modul dasar seperti Screen Time Timer, Water Intake Tracker, dan Wellness Center secara gratis tanpa biaya apa pun."
              },
              {
                q: "Bagaimana cara kerja screen monitoring?",
                a: "WorkWell menghitung durasi aktif sesi browser Anda. Sistem akan memberi notifikasi pop-up ramah saat mendeteksi Anda bekerja terlalu lama untuk mengingatkan Anda beristirahat."
              },
              {
                q: "Apakah data kesehatan saya aman?",
                a: "Keamanan privasi Anda adalah prioritas kami. Semua data pelacakan disimpan secara aman dan terenkripsi menggunakan database terpercaya dan hanya bisa diakses oleh Anda sendiri."
              },
              {
                q: "Bisakah saya menyesuaikan batas waktu istirahat?",
                a: "Tentu! Anda dapat dengan bebas menyesuaikan target durasi kerja aktif (misal 1-3 jam) dan durasi istirahat (5, 10, atau 15 menit) sesuka hati melalui halaman Pengaturan Profil."
              }
            ].map((faq, idx) => (
              <div key={idx} className="glass-panel rounded-3xl border border-brand-secondary/15 overflow-hidden transition-all duration-300">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 sm:p-6 text-left font-extrabold text-brand-dark dark:text-white flex justify-between items-center text-sm sm:text-base cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="h-5 w-5 text-brand-secondary flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-brand-secondary flex-shrink-0" />
                  )}
                </button>

                <div
                  className={`accordion-content overflow-hidden text-xs sm:text-sm text-brand-secondary dark:text-slate-400 font-medium px-5 sm:px-6 text-left leading-relaxed transition-all`}
                  style={{
                    maxHeight: openFaq === idx ? '200px' : '0px',
                    opacity: openFaq === idx ? 1 : 0,
                    paddingBottom: openFaq === idx ? '20px' : '0px'
                  }}
                >
                  <p className="border-t border-brand-secondary/10 dark:border-slate-800 pt-4">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Final Call-to-Action Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-reveal">
        <div className="bg-gradient-to-tr from-brand-dark to-brand-secondary rounded-[40px] p-8 sm:p-16 text-center text-white relative overflow-hidden shadow-2xl">
          {/* Ambient Glows */}
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-brand-primary/15 rounded-full blur-3xl pointer-events-none animate-pulse" />

          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 rounded-full text-brand-primary text-[10px] font-extrabold uppercase tracking-wider mx-auto">
              <Coffee className="h-4 w-4" />
              <span>Free Forever</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">Mulai Transformasi Rutinitas Kerja Anda Hari Ini</h2>
            <p className="text-xs sm:text-sm text-slate-100/80 max-w-lg mx-auto leading-relaxed font-semibold">
              Kesehatan fisik adalah aset terbaik Anda dalam jangka panjang. Mulai pantau kebiasaan Anda dan jadilah produktif yang menyehatkan bersama WorkWell.
            </p>
            <div className="pt-4 flex justify-center">
              <button
                onClick={currentUser ? () => navigate('/dashboard') : openRegisterModal}
                className="w-full sm:w-auto px-8 py-4 bg-brand-primary hover:bg-brand-primary/95 text-brand-dark rounded-2xl font-black text-sm shadow-xl shadow-brand-primary/10 transition-all cursor-pointer active:scale-98"
              >
                Start Free Tracking
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Professional Footer */}
      <footer className="bg-white dark:bg-slate-950 border-t border-brand-secondary/10 py-16 text-brand-secondary mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Logo and Brand Note */}
            <div className="col-span-2 space-y-4 text-left">
              <WorkWellLogo logoColorClass="text-brand-dark dark:text-white" />
              <p className="text-xs text-brand-secondary dark:text-slate-400 font-semibold leading-relaxed max-w-sm">
                WorkWell adalah platform SaaS kebugaran digital modern yang dibuat untuk mendampingi para profesional IT, mahasiswa, dan pekerja kantoran agar tetap bugar, fokus, dan sehat di depan layar monitor.
              </p>
            </div>

            {/* Links 1 */}
            <div className="text-left space-y-3">
              <h5 className="text-[10px] font-black uppercase text-brand-dark dark:text-white tracking-widest">Produk</h5>
              <ul className="space-y-2 text-xs font-semibold">
                <li>
                  <a href="#fitur" className="hover:text-brand-dark dark:hover:text-white transition-colors">Daftar Fitur</a>
                </li>
                <li>
                  <a href="#carakerja" className="hover:text-brand-dark dark:hover:text-white transition-colors">Cara Kerja</a>
                </li>
                <li>
                  <Link to="/wellness-center" className="hover:text-brand-dark dark:hover:text-white transition-colors">Wellness Center</Link>
                </li>
              </ul>
            </div>

            {/* Links 2 */}
            <div className="text-left space-y-3">
              <h5 className="text-[10px] font-black uppercase text-brand-dark dark:text-white tracking-widest">Dukungan</h5>
              <ul className="space-y-2 text-xs font-semibold">
                <li>
                  <a href="#" className="hover:text-brand-dark dark:hover:text-white transition-colors">Pusat Bantuan</a>
                </li>
                <li>
                  <a href="#" className="hover:text-brand-dark dark:hover:text-white transition-colors">Kebijakan Privasi</a>
                </li>
                <li>
                  <a href="#" className="hover:text-brand-dark dark:hover:text-white transition-colors">Ketentuan Layanan</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-brand-secondary/10 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-bold">
            <p>© {new Date().getFullYear()} WorkWell. Dibuat untuk mahasiswa dan pekerja Indonesia agar tetap sehat di depan layar.</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-brand-dark dark:hover:text-white transition-colors">GitHub</a>
              <a href="#" className="hover:text-brand-dark dark:hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-brand-dark dark:hover:text-white transition-colors">LinkedIn</a>
            </div>
          </div>

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
