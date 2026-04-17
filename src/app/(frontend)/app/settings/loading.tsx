export default function SettingsLoading() {
  return (
    <div className="flex gap-6 items-start">
      <div
        className="w-56 shrink-0 bg-white rounded-2xl p-3 animate-pulse"
        style={{ boxShadow: '0px 20px 40px rgba(25,28,29,0.06)' }}
      >
        <div className="flex flex-col gap-1">
          <div className="h-10 rounded-xl bg-gray-100" />
          <div className="h-10 rounded-xl bg-gray-100" />
        </div>
      </div>
      <div
        className="flex-1 bg-white rounded-2xl animate-pulse"
        style={{ boxShadow: '0px 20px 40px rgba(25,28,29,0.06)', minHeight: 480 }}
      >
        <div className="px-6 pt-6 pb-4 flex gap-6 border-b border-gray-50">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 w-20 rounded-full bg-gray-100" />
          ))}
        </div>
        <div className="p-6 flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 rounded-lg bg-gray-100" />
          ))}
        </div>
      </div>
    </div>
  );
}
