tsx
export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-3/4 mx-auto" />
      <div className="h-14 bg-slate-200 dark:bg-slate-800 rounded-2xl max-w-2xl mx-auto" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      </div>
    </div>
  );
}
