import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div 
          className="w-24 h-24 mx-auto mb-8 rounded-3xl flex items-center justify-center border border-white/10"
          style={{
            background: 'linear-gradient(145deg, rgba(45, 80, 75, 0.3) 0%, rgba(25, 45, 45, 0.4) 100%)',
          }}
        >
          <span className="text-5xl">🎮</span>
        </div>

        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-xl font-semibold text-white/80 mb-3">Page not found</h2>
        <p className="text-muted-foreground mb-8">
          The page you&apos;re looking for doesn&apos;t exist or the game data is temporarily unavailable.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-colors"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/10 text-white/80 font-medium hover:bg-white/10 transition-colors"
            style={{
              background: 'linear-gradient(145deg, rgba(45, 80, 75, 0.2) 0%, rgba(25, 45, 45, 0.3) 100%)',
            }}
          >
            <Search className="w-4 h-4" />
            Search Games
          </Link>
        </div>
      </div>
    </main>
  );
}
