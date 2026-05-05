export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-[#ff6b00]">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white">
          <span className="text-4xl font-bold text-[#ff6b00]">O</span>
        </div>
        <p className="text-lg font-medium text-white">Loading...</p>
      </div>
    </div>
  );
}
