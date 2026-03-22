export default function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden w-full h-full flex-1  ${className}`}
    >
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(200%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
      {/* Base overlay for the skeleton */}
      <div className="absolute inset-0 bg-black/10 w-full h-full"></div>
      {/* The wave animation */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer w-full h-full"></div>
    </div>
  );
}
