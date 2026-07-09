import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, Cell, PieChart, Pie
} from 'recharts';
import { useTracker } from '../hooks/useTracker';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { BarChart3, Clock, Droplet, Dumbbell, PieChart as PieIcon } from 'lucide-react';

const ChartComponent = () => {
  const { userSettings } = useAuth();
  const { weeklyHabits, weeklySessions } = useTracker();
  const { activeTheme } = useTheme();
  
  const limitMinutes = userSettings?.screenLimit || 60;
  const waterTarget = 8;
  const movementTarget = 5;

  // Combine screen time sessions and habit counts per day
  const chartData = weeklySessions.map(session => {
    const habit = weeklyHabits.find(h => h.date === session.date) || {
      waterIntake: 0,
      stretchingCount: 0,
      exerciseCount: 0
    };

    return {
      name: session.day,
      'Screen Time (Min)': Math.round(session.screenTime),
      'Air Minum (Gelas)': habit.waterIntake || 0,
      'Olahraga/Peregangan': (habit.stretchingCount || 0) + (habit.exerciseCount || 0),
    };
  });

  // Calculate stats
  let waterDaysCompleted = 0;
  let movementDaysCompleted = 0;
  let screenTimeDaysUnder = 0;
  const totalDays = weeklySessions.length || 7;

  weeklySessions.forEach(session => {
    const habit = weeklyHabits.find(h => h.date === session.date);
    const water = habit?.waterIntake || 0;
    const movement = (habit?.stretchingCount || 0) + (habit?.exerciseCount || 0);
    const screen = session.screenTime || 0;

    if (water >= waterTarget) waterDaysCompleted++;
    if (movement >= movementTarget) movementDaysCompleted++;
    if (screen <= limitMinutes) screenTimeDaysUnder++;
  });

  // Brand completion colors
  const completionData = [
    { name: 'Target Air Terpenuhi', value: waterDaysCompleted, color: '#6FCF97' },
    { name: 'Target Gerak Terpenuhi', value: movementDaysCompleted, color: '#2FA084' },
    { name: 'Screen Time Sesuai Batas', value: screenTimeDaysUnder, color: '#1F6F5F' },
  ];

  // Theme colors synced with brand palette
  const strokeColor = '#e2e8f0';
  const textColor = '#2FA084';
  const tooltipBg = '#ffffff';
  const tooltipBorder = 'rgba(47, 160, 132, 0.15)';
  const tooltipText = '#1F6F5F';

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3.5 mb-2 text-left">
        <div className="p-3 rounded-2xl bg-brand-secondary/10 text-brand-secondary shadow-inner">
          <BarChart3 className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-brand-dark leading-tight">Dashboard Analitik</h2>
          <p className="text-xs text-brand-secondary mt-0.5 font-semibold">Analisis kebiasaan dan metrik kesehatan Anda selama seminggu terakhir</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Screen Time */}
        <div className="glass-card-light rounded-3xl p-5 border border-brand-secondary/12 flex flex-col justify-between h-80">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4.5 w-4.5 text-brand-secondary" />
              <h3 className="text-sm font-bold text-brand-dark">Screen Time Mingguan</h3>
            </div>
            <span className="text-[10px] text-brand-dark uppercase font-bold bg-brand-bg px-2.5 py-0.5 rounded-lg border border-brand-secondary/10">Batas: {limitMinutes}m</span>
          </div>
          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorScreenTime" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2FA084" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2FA084" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={strokeColor} opacity={0.5} />
                <XAxis dataKey="name" stroke={textColor} fontSize={10} fontWeight={600} tickLine={false} />
                <YAxis stroke={textColor} fontSize={10} fontWeight={600} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '16px', boxShadow: '0 4px 15px -3px rgba(0,0,0,0.05)' }}
                  labelStyle={{ color: tooltipText, fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="Screen Time (Min)" stroke="#2FA084" strokeWidth={2.5} fillOpacity={1} fill="url(#colorScreenTime)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Water Consumption */}
        <div className="glass-card-light rounded-3xl p-5 border border-brand-secondary/12 flex flex-col justify-between h-80">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Droplet className="h-4.5 w-4.5 text-brand-secondary" />
              <h3 className="text-sm font-bold text-brand-dark">Konsumsi Air Mingguan</h3>
            </div>
            <span className="text-[10px] text-brand-dark uppercase font-bold bg-brand-bg px-2.5 py-0.5 rounded-lg border border-brand-secondary/10">Target: {waterTarget} Gelas</span>
          </div>
          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={strokeColor} opacity={0.5} />
                <XAxis dataKey="name" stroke={textColor} fontSize={10} fontWeight={600} tickLine={false} />
                <YAxis stroke={textColor} fontSize={10} fontWeight={600} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '16px', boxShadow: '0 4px 15px -3px rgba(0,0,0,0.05)' }}
                  labelStyle={{ color: tooltipText, fontWeight: 'bold' }}
                />
                <Bar dataKey="Air Minum (Gelas)" fill="#6FCF97" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Stretches Line */}
        <div className="glass-card-light rounded-3xl p-5 border border-brand-secondary/12 flex flex-col justify-between h-80">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Dumbbell className="h-4.5 w-4.5 text-brand-secondary" />
              <h3 className="text-sm font-bold text-brand-dark">Aktivitas Olahraga / Peregangan</h3>
            </div>
            <span className="text-[10px] text-brand-dark uppercase font-bold bg-brand-bg px-2.5 py-0.5 rounded-lg border border-brand-secondary/10">Target: {movementTarget} Sesi</span>
          </div>
          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={strokeColor} opacity={0.5} />
                <XAxis dataKey="name" stroke={textColor} fontSize={10} fontWeight={600} tickLine={false} />
                <YAxis stroke={textColor} fontSize={10} fontWeight={600} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '16px', boxShadow: '0 4px 15px -3px rgba(0,0,0,0.05)' }}
                  labelStyle={{ color: tooltipText, fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="Olahraga/Peregangan" stroke="#2FA084" strokeWidth={3} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Pie Chart */}
        <div className="glass-card-light rounded-3xl p-5 border border-brand-secondary/12 flex flex-col justify-between h-80">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <PieIcon className="h-4.5 w-4.5 text-brand-secondary" />
              <h3 className="text-sm font-bold text-brand-dark">Statistik Capaian Target (7 Hari Terakhir)</h3>
            </div>
          </div>
          
          <div className="flex flex-row items-center justify-center h-56">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={completionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {completionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '16px', boxShadow: '0 4px 15px -3px rgba(0,0,0,0.05)' }}
                    itemStyle={{ color: tooltipText }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="w-1/2 flex flex-col space-y-3 justify-center pl-4 text-left">
              {completionData.map((item, idx) => (
                <div key={idx} className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[11px] font-bold text-brand-secondary">{item.name}</span>
                  </div>
                  <span className="text-xs font-black text-brand-dark ml-5">{item.value} / {totalDays} Hari</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartComponent;
