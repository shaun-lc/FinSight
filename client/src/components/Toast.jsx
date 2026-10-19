import { CheckCircleIcon, ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

// Single notification. Positioning and auto-dismiss are handled by ToastProvider.
export default function Toast({ message, type = 'error', onClose }) {
  const isError = type === 'error';
  const Icon = isError ? ExclamationCircleIcon : CheckCircleIcon;

  return (
    <div
      role={isError ? 'alert' : 'status'}
      className={`pointer-events-auto flex items-start gap-2 rounded-lg px-4 py-3 text-sm text-white shadow-lg ${
        isError ? 'bg-red-600' : 'bg-green-600'
      }`}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <span className="flex-1 break-words">{message}</span>
      <button onClick={onClose} aria-label="Dismiss" className="flex-shrink-0 opacity-80 hover:opacity-100">
        <XMarkIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
