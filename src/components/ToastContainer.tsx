import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm w-full px-3">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto p-4 rounded-2xl shadow-xl border flex items-start gap-3 transition-all animate-fade-in ${
            t.type === 'success'
              ? 'bg-white border-emerald-200 text-stone-900'
              : t.type === 'error'
              ? 'bg-white border-rose-200 text-stone-900'
              : 'bg-white border-stone-200 text-stone-900'
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {t.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            {t.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600" />}
            {t.type === 'info' && <Info className="w-4 h-4 text-indigo-600" />}
          </div>

          <div className="flex-1 min-w-0">
            <h5 className="font-bold text-xs text-stone-900 leading-none mb-1">{t.title}</h5>
            <p className="text-[11px] text-stone-600 leading-snug">{t.message}</p>
          </div>

          <button
            onClick={() => removeToast(t.id)}
            className="text-stone-400 hover:text-stone-700 p-1 shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
