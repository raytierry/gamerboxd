export default function GameGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[3/4] rounded-lg bg-[#1a1a1d]" />
          <div className="mt-2 space-y-2">
            <div className="h-4 bg-[#1a1a1d] rounded w-3/4" />
            <div className="h-3 bg-[#1a1a1d] rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
