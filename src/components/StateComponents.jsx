import React from 'react';
import { RefreshCw, Inbox, AlertTriangle, Home } from 'lucide-react';

// 1. Reusable Loading State Component
export const LoadingState = ({ message = 'Memuat data...', height = 'min-h-[300px]' }) => {
  return (
    <div className={`flex flex-col items-center justify-center space-y-4 p-8 w-full ${height}`}>
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-brand-secondary/20 border-t-brand-secondary animate-spin" />
        <RefreshCw className="absolute h-5 w-5 text-brand-secondary animate-pulse" />
      </div>
      <p className="text-brand-secondary text-sm font-semibold tracking-wide animate-pulse">
        {message}
      </p>
    </div>
  );
};

// 2. Reusable Empty State Component
export const EmptyState = ({
  title = 'Tidak Ada Data',
  description = 'Belum ada catatan yang tersimpan untuk kriteria ini.',
  icon: Icon = Inbox,
  actionText,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-brand-secondary/20 rounded-3xl bg-white/50 min-h-[250px] w-full">
      <div className="p-4 bg-brand-bg text-brand-secondary rounded-2xl mb-4 border border-brand-secondary/15">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-base font-bold text-brand-dark">{title}</h3>
      <p className="text-xs text-brand-secondary max-w-sm mt-1.5 leading-relaxed font-semibold">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-5 px-5 py-2.5 bg-brand-primary hover:bg-brand-primary/95 text-brand-dark rounded-xl text-xs font-bold transition-all shadow-md shadow-brand-primary/10 active:scale-98 cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

// 3. Reusable Error State Component
export const ErrorState = ({
  title = 'Terjadi Kesalahan',
  message = 'Aplikasi mengalami kendala teknis saat memuat bagian ini.',
  error,
  onRetry
}) => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-rose-500/10 bg-white rounded-3xl min-h-[300px] w-full max-w-lg mx-auto relative overflow-hidden shadow-sm">
      <div className="p-4 bg-rose-500/10 text-rose-600 rounded-2xl mb-4 border border-rose-500/20">
        <AlertTriangle className="h-8 w-8" />
      </div>
      
      <h3 className="text-lg font-black text-rose-700">{title}</h3>
      <p className="text-xs text-brand-secondary max-w-md mt-2 leading-relaxed font-semibold">
        {message}
      </p>

      {/* Error detail (safe for production: collapsible and formatted) */}
      {error && (
        <details className="w-full text-left mt-4 bg-slate-900 border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-rose-300 max-h-40 overflow-y-auto cursor-pointer">
          <summary className="font-semibold text-slate-400 select-none pb-1 hover:text-white transition-colors">
            Detail Teknis (Error Stack)
          </summary>
          <pre className="mt-1 whitespace-pre-wrap select-text leading-normal">
            {error.toString()}
            {error.stack && `\n\nStack:\n${error.stack}`}
          </pre>
        </details>
      )}

      <div className="flex items-center space-x-3 mt-6">
        {onRetry ? (
          <button
            onClick={onRetry}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-rose-600/10 cursor-pointer active:scale-98"
          >
            Coba Lagi
          </button>
        ) : (
          <button
            onClick={handleReload}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-rose-600/10 cursor-pointer active:scale-98"
          >
            Muat Ulang Halaman
          </button>
        )}
        
        <a
          href="/"
          className="flex items-center space-x-1.5 px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-650 hover:text-slate-900 rounded-xl text-xs font-bold transition-all"
        >
          <Home className="h-3.5 w-3.5" />
          <span>Kembali Beranda</span>
        </a>
      </div>
    </div>
  );
};
