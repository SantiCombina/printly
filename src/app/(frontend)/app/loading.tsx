export default function AppLoading() {
  return (
    <div className="flex gap-6">
      <div className="flex-1 bg-white rounded-2xl p-8 animate-pulse" style={{ boxShadow: '0px 20px 40px rgba(25,28,29,0.06)' }}>
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 w-36 rounded-lg bg-gray-100" />
          <div className="h-12 w-44 rounded-xl bg-gray-100" />
        </div>
        <div className="flex flex-col gap-6">
          <div className="h-4 w-24 rounded bg-gray-100" />
          <div className="flex gap-2">
            <div className="h-16 w-36 rounded-xl bg-gray-100" />
            <div className="h-16 w-32 rounded-full bg-gray-100" />
            <div className="h-16 w-14 rounded-full bg-gray-100" />
          </div>
          <div className="grid grid-cols-2 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="h-3 w-20 rounded bg-gray-100" />
                <div className="flex gap-2">
                  <div className="h-8 w-16 rounded-full bg-gray-100" />
                  <div className="h-8 w-16 rounded-full bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-96 shrink-0 bg-white rounded-2xl animate-pulse" style={{ boxShadow: '0px 20px 40px rgba(25,28,29,0.06)', minHeight: 400 }} />
    </div>
  );
}
