import React from 'react';
import { usePropertyContact } from '../context/PropertyContactContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = usePropertyContact();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4">
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border transition-all transform translate-y-0 ${
              isSuccess
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : isWarning
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : isError
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : 'bg-slate-900 border-slate-800 text-white'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-amber-600" />}
              {isError && <XCircle className="w-5 h-5 text-rose-600" />}
              {!isSuccess && !isWarning && !isError && <Info className="w-5 h-5 text-cyan-400" />}
            </div>

            <div className="flex-1 text-sm">
              {toast.title && <p className="font-semibold mb-0.5">{toast.title}</p>}
              <p className="leading-snug">{toast.message}</p>
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="shrink-0 p-1 rounded-lg opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Tutup notifikasi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
