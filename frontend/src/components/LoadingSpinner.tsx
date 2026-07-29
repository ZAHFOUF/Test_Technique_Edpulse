function LoadingSpinner() {
  return (
    <div
      className="flex items-center justify-center py-20"
      role="status"
      aria-live="polite"
    >
      <span className="h-9 w-9 animate-spin rounded-full border-2 border-slate-200 border-t-slate-600" />
      <span className="sr-only">Loading products…</span>
    </div>
  );
}

export default LoadingSpinner;
