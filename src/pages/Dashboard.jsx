import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTracker } from '../hooks/useTracker';
import Sidebar from '../components/Sidebar';
import WorkWellLogo from '../components/WorkWellLogo';
import Timer from '../components/Timer';
import ReminderPopup from '../components/ReminderPopup';
import HabitCard from '../components/HabitCard';
import StressCard from '../components/StressCard';
import ChartComponent from '../components/ChartComponent';
import ProgressBar from '../components/ProgressBar';
import WellnessScore from '../components/WellnessScore';
import { Droplet, Dumbbell, Calendar, HeartPulse, RefreshCw, FileDown, Clock, Activity, Menu } from 'lucide-react';

const Dashboard = () => {
  const { currentUser, userSettings } = useAuth();
  const { todayHabit, addWater, addStretch, addExercise, loading: trackerLoading, weeklyHabits, weeklySessions, weeklyMoods, sessionDuration, todayMood, isMobileSidebarOpen, setIsMobileSidebarOpen } = useTracker();
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  
  const [searchParams] = useSearchParams();
  const scrollTarget = searchParams.get('scroll');

  // Smooth scroll sync for navigation anchors
  useEffect(() => {
    if (scrollTarget) {
      setTimeout(() => {
        const el = document.getElementById(scrollTarget);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, [scrollTarget]);

  // Targets
  const waterTarget = 8;
  const movementTarget = 5;

  const stretches = todayHabit?.stretchingCount || 0;
  const exercises = todayHabit?.exerciseCount || 0;
  const totalMovement = stretches + exercises;

  const limitMinutes = userSettings?.screenLimit || 60;

  // Local helper YYYY-MM-DD
  const getLocalDateString = () => new Date().toLocaleDateString('sv-SE');
  
  const todaySession = weeklySessions?.find(s => s.date === getLocalDateString()) || { screenTime: 0 };
  const activeMinutes = Math.floor(sessionDuration / 60);
  const totalScreenMinutes = (todaySession.screenTime || 0) + activeMinutes;
  const totalWater = todayHabit?.waterIntake || 0;

  // Calculations for Today's Wellness Score (displayed in top stats)
  const getTodayWellnessScore = () => {
    let sScore = 25;
    if (totalScreenMinutes === 0) {
      sScore = 0;
    } else if (totalScreenMinutes > limitMinutes) {
      const excess = (totalScreenMinutes - limitMinutes) / limitMinutes;
      sScore = Math.max(0, 25 - excess * 25);
    }
    const wScore = Math.min(25, (totalWater / 8) * 25);
    const mScore = Math.min(25, (totalMovement / 5) * 25);
    let mdScore = 0; 
    const mKey = todayMood?.mood;
    if (mKey === 'happy') mdScore = 25;
    else if (mKey === 'normal') mdScore = 20;
    else if (mKey === 'tired') mdScore = 12;
    else if (mKey === 'stress') mdScore = 6;
    return Math.round(sScore + wScore + mScore + mdScore);
  };
  const todayScore = getTodayWellnessScore();

  const handleExportPDF = () => {
    if (!currentUser || !weeklySessions || !weeklyHabits) return;

    // Calculate wellness scores per day and average
    const getWellnessScoreForDay = (session, habit, moodKey) => {
      const limitVal = limitMinutes;
      let sScore = 25;
      if (session.screenTime === 0) {
        sScore = 0;
      } else if (session.screenTime > limitVal) {
        const excess = (session.screenTime - limitVal) / limitVal;
        sScore = Math.max(0, 25 - excess * 25);
      }
      const wScore = Math.min(25, ((habit.waterIntake || 0) / 8) * 25);
      const mScore = Math.min(25, (((habit.stretchingCount || 0) + (habit.exerciseCount || 0)) / 5) * 25);
      let mdScore = 0;
      if (moodKey === 'happy') mdScore = 25;
      else if (moodKey === 'normal') mdScore = 20;
      else if (moodKey === 'tired') mdScore = 12;
      else if (moodKey === 'stress') mdScore = 6;
      return Math.round(sScore + wScore + mScore + mdScore);
    };

    const scores = weeklySessions.map(session => {
      const habit = weeklyHabits.find(h => h.date === session.date) || { waterIntake: 0, stretchingCount: 0, exerciseCount: 0 };
      const moodLog = weeklyMoods.find(m => m.date === session.date) || { mood: null };
      return getWellnessScoreForDay(session, habit, moodLog.mood);
    });

    const avgWellnessScore = Math.round(scores.reduce((sum, val) => sum + val, 0) / scores.length);
    const avgScreenTime = Math.round(weeklySessions.reduce((sum, s) => sum + s.screenTime, 0) / weeklySessions.length);
    const avgWater = Math.round((weeklyHabits.reduce((sum, h) => sum + (h.waterIntake || 0), 0) / weeklyHabits.length) * 10) / 10;
    const avgMovement = Math.round((weeklyHabits.reduce((sum, h) => sum + (h.stretchingCount || 0) + (h.exerciseCount || 0), 0) / weeklyHabits.length) * 10) / 10;

    // Dominant Mood
    const moodCounts = {};
    weeklyMoods.forEach(m => {
      if (m.mood) moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1;
    });
    let dominantMood = 'Biasa (Normal)';
    let maxCount = 0;
    Object.keys(moodCounts).forEach(k => {
      if (moodCounts[k] > maxCount) {
        maxCount = moodCounts[k];
        if (k === 'happy') dominantMood = 'Senang (Happy)';
        if (k === 'normal') dominantMood = 'Biasa (Normal)';
        if (k === 'tired') dominantMood = 'Lelah (Tired)';
        if (k === 'stress') dominantMood = 'Stres (Stress)';
      }
    });

    // Recommendations based on average score
    let recommendation = '';
    let recommendationRating = '';
    if (avgWellnessScore >= 80) {
      recommendationRating = 'SANGAT SEHAT (KONDISI PRIMA)';
      recommendation = 'Selamat! Pola hidup sehat Anda saat bekerja sudah berada pada tingkat yang ideal. Anda berhasil mengimbangi waktu layar yang lama dengan berolahraga ringan, minum air putih yang cukup, dan menjaga tingkat stres tetap rendah. Teruskan kebiasaan sehat ini untuk menjaga performa optimal tubuh Anda.';
    } else if (avgWellnessScore >= 60) {
      recommendationRating = 'CUKUP SEHAT (PERLU SEDIKIT PERBAIKAN)';
      recommendation = 'Kerja bagus! Anda sudah berusaha menjaga kebugaran tubuh secara berkala. Namun, ada beberapa catatan minor seperti asupan air minum yang kurang atau waktu kerja layar yang sesekali melebihi batas. Cobalah untuk mengambil jeda microbreak lebih rutin dan minum 1 gelas air setiap jam untuk mendongkrak kebugaran mata dan tubuh Anda.';
    } else {
      recommendationRating = 'KURANG SEHAT (BUTUH TINDAKAN SEGERA)';
      recommendation = 'Perhatian! Skor kesehatan mingguan Anda berada di bawah rata-rata. Anda terdeteksi menghabiskan terlalu banyak waktu di depan layar tanpa jeda istirahat yang cukup, jarang bergerak, serta menumpuk kelelahan otot (RSI) dan stres emosional. Kami sangat menyarankan Anda mengaktifkan reminder otomatis WorkWell dan memaksakan diri melakukan stretching minimal 3-5 menit per sesi kerja.';
    }

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Laporan Kesehatan Mingguan - ${currentUser.name}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
            body {
              font-family: 'Inter', sans-serif;
              padding: 40px;
              color: #1e293b;
              background-color: #ffffff;
              line-height: 1.5;
            }
            .header-container {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 2px solid #e2e8f0;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .brand {
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .brand-name {
              font-size: 20px;
              font-weight: 800;
              color: #2FA084;
            }
            .title {
              font-size: 24px;
              font-weight: 800;
              margin: 0;
              color: #1F6F5F;
            }
            .meta-info {
              font-size: 11px;
              color: #64748b;
              margin-top: 5px;
            }
            .summary-grid {
              display: grid;
              grid-template-cols: 1fr 1fr;
              gap: 20px;
              margin-bottom: 30px;
            }
            .score-card {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 16px;
              padding: 20px;
              display: flex;
              align-items: center;
              gap: 20px;
            }
            .score-circle {
              width: 80px;
              height: 80px;
              border-radius: 50%;
              background: #2FA084;
              color: #ffffff;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              font-size: 24px;
              font-weight: 800;
              box-shadow: 0 4px 6px -1px rgba(47, 160, 132, 0.2);
            }
            .score-label {
              font-size: 8px;
              text-transform: uppercase;
              letter-spacing: 1px;
              font-weight: 700;
              margin-top: 2px;
            }
            .score-details h4 {
              margin: 0;
              font-size: 16px;
              font-weight: 700;
              color: #1F6F5F;
            }
            .score-details p {
              margin: 5px 0 0 0;
              font-size: 11px;
              color: #64748b;
            }
            .stats-card {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 16px;
              padding: 20px;
              display: grid;
              grid-template-cols: 1fr 1fr;
              gap: 12px;
            }
            .stat-item {
              display: flex;
              flex-direction: column;
            }
            .stat-label {
              font-size: 10px;
              color: #64748b;
              font-weight: 600;
              text-transform: uppercase;
            }
            .stat-value {
              font-size: 14px;
              font-weight: 700;
              color: #1F6F5F;
              margin-top: 2px;
            }
            .table-title {
              font-size: 14px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              color: #475569;
              margin-bottom: 12px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            th, td {
              border: 1px solid #e2e8f0;
              padding: 10px 12px;
              text-align: left;
              font-size: 12px;
            }
            th {
              background-color: #f1f5f9;
              color: #334155;
              font-weight: 700;
            }
            tr:nth-child(even) {
              background-color: #f8fafc;
            }
            .recommendation-card {
              background: rgba(47, 160, 132, 0.04);
              border: 1px solid rgba(47, 160, 132, 0.1);
              border-radius: 16px;
              padding: 20px;
            }
            .rec-title {
              font-size: 13px;
              font-weight: 800;
              color: #2FA084;
              text-transform: uppercase;
              margin: 0 0 8px 0;
            }
            .rec-text {
              font-size: 11.5px;
              color: #334155;
              margin: 0;
              line-height: 1.6;
            }
            .footer {
              text-align: center;
              margin-top: 50px;
              font-size: 10px;
              color: #94a3b8;
              border-top: 1px dashed #cbd5e1;
              padding-top: 15px;
            }
            @media print {
              body { padding: 0; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header-container">
            <div>
              <h1 class="title">Laporan Kesehatan Mingguan</h1>
              <div class="meta-info">
                Nama Pengguna: <strong>${currentUser.name}</strong> (${currentUser.email}) | Tanggal Ekspor: ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
            <div class="brand">
              <span class="brand-name">WorkWell</span>
            </div>
          </div>

          <div class="summary-grid">
            <div class="score-card">
              <div class="score-circle">
                <span>${avgWellnessScore}%</span>
                <span class="score-label">Skor</span>
              </div>
              <div class="score-details">
                <h4>Rata-rata Skor Kesehatan</h4>
                <p>Status Rata-rata: <strong>${recommendationRating}</strong></p>
                <p>Membantu mengevaluasi tingkat kepatuhan istirahat & hidrasi Anda.</p>
              </div>
            </div>

            <div class="stats-card">
              <div class="stat-item">
                <span class="stat-label">Rerata Screen Time</span>
                <span class="stat-value">${avgScreenTime} Menit/Hari</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Rerata Air Minum</span>
                <span class="stat-value">${avgWater} Gelas/Hari</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Rerata Peregangan</span>
                <span class="stat-value">${avgMovement} Sesi/Hari</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Mood Terbanyak</span>
                <span class="stat-value">${dominantMood}</span>
              </div>
            </div>
          </div>

          <div class="table-title">Detail Aktivitas Harian (7 Hari Terakhir)</div>
          <table>
            <thead>
              <tr>
                <th>Hari & Tanggal</th>
                <th>Waktu Layar</th>
                <th>Air Minum (Gelas)</th>
                <th>Aktivitas Peregangan</th>
                <th>Mood & Stres</th>
                <th>Skor Harian</th>
              </tr>
            </thead>
            <tbody>
              ${weeklySessions.map((session, index) => {
                const habit = weeklyHabits.find(h => h.date === session.date) || { waterIntake: 0, stretchingCount: 0, exerciseCount: 0 };
                 const moodLog = weeklyMoods.find(m => m.date === session.date) || { mood: null, stressLevel: 'Belum diisi' };
                 const dailyScore = scores[index];
                 
                 let moodLabel = 'Belum diisi';
                 let stressLabel = 'Belum diisi';
                 if (moodLog.mood === 'happy') {
                   moodLabel = 'Senang';
                   stressLabel = 'Rendah';
                 } else if (moodLog.mood === 'normal') {
                   moodLabel = 'Biasa';
                   stressLabel = 'Rendah';
                 } else if (moodLog.mood === 'tired') {
                   moodLabel = 'Lelah';
                   stressLabel = 'Sedang';
                 } else if (moodLog.mood === 'stress') {
                   moodLabel = 'Stres';
                   stressLabel = 'Tinggi';
                 }

                return `
                  <tr>
                    <td><strong>${session.day}</strong>, ${session.date}</td>
                    <td>${session.screenTime} Menit</td>
                    <td>${habit.waterIntake} / 8 Gelas</td>
                    <td>${(habit.stretchingCount || 0) + (habit.exerciseCount || 0)} Sesi</td>
                    <td>${moodLabel} (${stressLabel} Stress)</td>
                    <td><strong>${dailyScore}%</strong></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>

          <div class="recommendation-card">
            <div class="rec-title">Saran Medis & Evaluasi WorkWell</div>
            <p class="rec-text">${recommendation}</p>
          </div>

          <div class="footer">
            Laporan ini dibuat otomatis oleh aplikasi kesehatan produktivitas WorkWell. Jaga kesehatan fisik & mata Anda secara berkala saat bekerja di depan komputer.
          </div>

          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 19) return 'Selamat Sore';
    return 'Selamat Malam';
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

        {/* Dashboard Main Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Header Panel */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-brand-secondary/15">
            <div className="text-left">
              <h1 className="text-2xl font-black text-brand-dark leading-tight">
                {getGreeting()}, {currentUser?.name || 'User'}
              </h1>
              <p className="text-xs text-brand-secondary mt-1 font-semibold">
                Pantau kesehatan fisik dan mental Anda saat bekerja secara real-time.
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {trackerLoading && (
                <RefreshCw className="h-4.5 w-4.5 text-brand-secondary animate-spin" />
              )}

              <button
                onClick={handleExportPDF}
                className="flex items-center space-x-1.5 px-4 py-2.5 bg-brand-secondary hover:bg-brand-secondary/95 text-white rounded-2xl text-xs font-bold transition-all shadow-lg shadow-brand-secondary/10 hover:shadow-brand-secondary/20 active:scale-95 cursor-pointer"
                title="Ekspor laporan kesehatan ke PDF"
              >
                <FileDown className="h-4.5 w-4.5" />
                <span>Ekspor PDF</span>
              </button>

              <div className="flex items-center space-x-3.5 text-xs text-brand-secondary bg-white border border-brand-secondary/15 px-4 py-2.5 rounded-2xl w-fit font-bold shadow-sm">
                <Calendar className="h-4.5 w-4.5 text-brand-secondary" />
                <span>
                  {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

          {/* Section: Today's Status Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            <div className="lg:col-span-2 flex">
              <WellnessScore />
            </div>
            <div className="lg:col-span-1 flex">
              <StressCard />
            </div>
          </div>

          {/* Top Statistics Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stat 1: Screen Time */}
            <div className="glass-card-light p-6 rounded-3xl border border-brand-secondary/12 flex items-center space-x-4">
              <div className="p-3 bg-brand-secondary/10 text-brand-secondary rounded-2xl">
                <Clock className="h-6 w-6" />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-bold text-brand-secondary uppercase tracking-widest block">Screen Time</span>
                <span className="text-lg font-black text-brand-dark mt-0.5 block">
                  {Math.floor(totalScreenMinutes / 60)}j {totalScreenMinutes % 60}m / {Math.floor(limitMinutes / 60)}j
                </span>
                <span className="text-[10px] text-slate-500 font-medium block mt-0.5">Waktu aktif depan layar</span>
              </div>
            </div>

            {/* Stat 2: Water Intake */}
            <div className="glass-card-light p-6 rounded-3xl border border-brand-secondary/12 flex items-center space-x-4">
              <div className="p-3 bg-brand-secondary/10 text-brand-secondary rounded-2xl">
                <Droplet className="h-6 w-6" />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-bold text-brand-secondary uppercase tracking-widest block">Water Intake</span>
                <span className="text-lg font-black text-brand-dark mt-0.5 block">
                  {totalWater} / {waterTarget} Gelas
                </span>
                <span className="text-[10px] text-slate-500 font-medium block mt-0.5">Target air minum harian</span>
              </div>
            </div>

            {/* Stat 3: Movement */}
            <div className="glass-card-light p-6 rounded-3xl border border-brand-secondary/12 flex items-center space-x-4">
              <div className="p-3 bg-brand-secondary/10 text-brand-secondary rounded-2xl">
                <Dumbbell className="h-6 w-6" />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-bold text-brand-secondary uppercase tracking-widest block">Movement</span>
                <span className="text-lg font-black text-brand-dark mt-0.5 block">
                  {totalMovement} / {movementTarget} Sesi
                </span>
                <span className="text-[10px] text-slate-500 font-medium block mt-0.5">Sesi gerak & olahraga</span>
              </div>
            </div>

            {/* Stat 4: Wellness Score */}
            <div className="glass-card-light p-6 rounded-3xl border border-brand-secondary/12 flex items-center space-x-4">
              <div className="p-3 bg-brand-secondary/10 text-brand-secondary rounded-2xl">
                <HeartPulse className="h-6 w-6" />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-bold text-brand-secondary uppercase tracking-widest block">Wellness Score</span>
                <span className="text-lg font-black text-brand-dark mt-0.5 block">
                  {todayScore}%
                </span>
                <span className="text-[10px] text-slate-500 font-medium block mt-0.5">Skor kebugaran saat ini</span>
              </div>
            </div>
          </div>

          {/* Section: Habits Tracker widgets */}
          <div id="habits" className="scroll-mt-20 space-y-4">
            <div className="flex items-center space-x-2.5 mb-2 text-left">
              <div className="p-1.5 bg-brand-secondary/10 text-brand-secondary rounded-xl">
                <Activity className="h-4.5 w-4.5" />
              </div>
              <h2 className="text-base font-extrabold text-brand-dark">Habits & Ticks Tracker</h2>
            </div>
            
            {/* Grid Layout 1: Trackers */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Widget 1: Timer */}
              <Timer onOpenReminder={() => setIsReminderOpen(true)} />

              {/* Widget 2: Habit Card - Water Intake */}
              <HabitCard
                title="Water Intake"
                subtitle="Pantau asupan air mineral harian Anda"
                icon={Droplet}
                color="brand"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between gap-4">
                    {/* Left side: Stats */}
                    <div className="text-left space-y-2">
                      <div className="flex items-end space-x-1">
                        <span className="text-3xl font-black text-brand-dark">{todayHabit?.waterIntake || 0}</span>
                        <span className="text-sm text-brand-secondary font-bold"> / {waterTarget} Gelas</span>
                      </div>
                      <span className="inline-block text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-xl border border-blue-500/20">
                        {Math.round((todayHabit?.waterIntake || 0) * 250)} ml
                      </span>
                    </div>

                    {/* Right side: Animated Glass */}
                    <div className="relative w-16 h-24 flex items-end justify-center flex-shrink-0">
                      {/* Glass Body */}
                      <div className="w-12 h-20 border-3 border-slate-300 dark:border-slate-700 border-t-0 rounded-b-2xl relative overflow-hidden bg-slate-100/40 dark:bg-slate-800/30 flex items-end shadow-inner z-10">
                        {/* Water level */}
                        <div 
                          className="w-full bg-gradient-to-t from-blue-600 to-blue-450 dark:from-blue-500 dark:to-cyan-400 transition-all duration-700 ease-out relative"
                          style={{ height: `${Math.min(((todayHabit?.waterIntake || 0) / waterTarget) * 100, 100)}%` }}
                        >
                          {/* Animated Wave Top & Bubbles */}
                          {(todayHabit?.waterIntake || 0) > 0 && (
                            <>
                              <div className="absolute top-0 left-0 right-0 h-1 bg-white/40 animate-pulse" />
                              <div className="absolute bottom-1 left-2 w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDuration: '2s' }} />
                              <div className="absolute bottom-3 right-3 w-1 h-1 bg-white/60 rounded-full animate-bounce" style={{ animationDuration: '1.5s' }} />
                            </>
                          )}
                        </div>
                      </div>
                      {/* Glass Rim */}
                      <div className="absolute top-3 w-12 h-2.5 border-3 border-slate-300 dark:border-slate-700 rounded-full z-0" />
                    </div>
                  </div>

                  <ProgressBar
                    value={todayHabit?.waterIntake || 0}
                    max={waterTarget}
                    color="bg-brand-primary"
                  />

                  <button
                    onClick={addWater}
                    className="w-full py-3.5 px-4 bg-brand-primary hover:bg-brand-primary/95 text-brand-dark text-xs font-bold rounded-2xl flex items-center justify-center space-x-1.5 shadow-md shadow-brand-primary/10 active:scale-98 transition-all cursor-pointer border-0"
                  >
                    <Droplet className="h-4 w-4" />
                    <span>Tambah 1 Gelas (250ml)</span>
                  </button>
                </div>
              </HabitCard>

              {/* Widget 3: Habit Card - Movement Tracker */}
              <HabitCard
                title="Movement Tracker"
                subtitle="Catat aktivitas peregangan dan gerakan Anda"
                icon={Dumbbell}
                color="brand"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between gap-4">
                    {/* Left side: Stats */}
                    <div className="text-left space-y-2">
                      <div className="flex items-end space-x-1">
                        <span className="text-3xl font-black text-brand-dark">{totalMovement}</span>
                        <span className="text-sm text-brand-secondary font-bold"> / {movementTarget} Sesi</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1.5">
                        <span className="inline-block text-[9px] font-bold text-brand-dark bg-brand-primary/10 px-2 py-0.5 rounded-lg border border-brand-primary/20">Regangan: {stretches}</span>
                        <span className="inline-block text-[9px] font-bold text-brand-dark bg-brand-primary/10 px-2 py-0.5 rounded-lg border border-brand-primary/20">Olahraga: {exercises}</span>
                      </div>
                    </div>

                    {/* Right side: Animated Fitness Ring */}
                    <div className="relative w-16 h-20 flex items-center justify-center flex-shrink-0">
                      {/* Outer Ring */}
                      <div className="w-14 h-14 rounded-full border-3 border-slate-200 dark:border-slate-800 flex items-center justify-center relative">
                        {/* Dynamic Progress Ring Arc */}
                        <div 
                          className="absolute inset-[-3px] rounded-full border-3 border-brand-primary/60 dark:border-brand-primary/40 animate-pulse"
                          style={{ clipPath: `inset(0px ${100 - Math.min((totalMovement / movementTarget) * 100, 100)}% 0px 0px)` }}
                        />
                        {/* Center Icon */}
                        <div className={`p-2 bg-brand-primary/15 rounded-full text-brand-secondary ${totalMovement > 0 ? 'animate-bounce' : ''}`} style={{ animationDuration: '2.5s' }}>
                          <Dumbbell className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <ProgressBar
                    value={totalMovement}
                    max={movementTarget}
                    color="bg-brand-primary"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={addStretch}
                      className="py-3 px-3 bg-brand-primary hover:bg-brand-primary/95 text-brand-dark text-[11px] font-bold rounded-2xl flex items-center justify-center space-x-1 shadow-sm active:scale-98 transition-all cursor-pointer border-0"
                    >
                      <Dumbbell className="h-3.5 w-3.5" />
                      <span>Regangan (+1)</span>
                    </button>
                    <button
                      onClick={addExercise}
                      className="py-3 px-3 bg-brand-primary hover:bg-brand-primary/95 text-brand-dark text-[11px] font-bold rounded-2xl flex items-center justify-center space-x-1 shadow-sm active:scale-98 transition-all cursor-pointer border-0"
                    >
                      <HeartPulse className="h-3.5 w-3.5" />
                      <span>Olahraga (+1)</span>
                    </button>
                  </div>
                </div>
              </HabitCard>

            </div>
          </div>

          {/* Section: Analytics & Trends (Full Width) */}
          <div id="analytics" className="scroll-mt-20 space-y-4">
            <div className="w-full">
              <ChartComponent />
            </div>
          </div>

        </main>
      </div>

      {/* Break Trigger Popup Modal */}
      <ReminderPopup
        isOpen={isReminderOpen}
        onClose={() => setIsReminderOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
