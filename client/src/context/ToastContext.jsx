import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Toast from '../components/Toast';
import { registerToastHandler } from '../utils/toastBus';

const ToastContext = createContext(null);

const DISMISS_MS = 5000;
let nextId = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = 'error') => {
      const id = nextId++;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => dismissToast(id), DISMISS_MS);
    },
    [dismissToast]
  );

  useEffect(() => registerToastHandler(showToast), [showToast]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm pointer-events-none"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} type={t.type} onClose={() => dismissToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
