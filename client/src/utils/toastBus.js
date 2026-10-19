// Lets non-React code (e.g. the axios interceptor) raise toasts.
// ToastProvider registers its showToast here on mount.
let handler = null;

export function registerToastHandler(fn) {
  handler = fn;
  return () => {
    if (handler === fn) handler = null;
  };
}

export function emitToast(message, type = 'error') {
  if (handler) handler(message, type);
}
