// Surface a failed API call as a toast. Skips errors the axios interceptor
// already reported (5xx / network) or that trigger a redirect (401).
export function reportError(showToast, err, fallback = 'Something went wrong') {
  if (err?.toastShown || err?.response?.status === 401) return;
  showToast(err?.response?.data?.message || fallback, 'error');
}
