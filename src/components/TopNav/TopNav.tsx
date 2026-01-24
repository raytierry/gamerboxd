'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, User, Bell } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function TopNav() {
  const router = useRouter();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border glass-modal backdrop-blur-xl">
      <div className="flex items-center gap-4 px-6 lg:pl-32 lg:pr-10 h-14">
        {/* Logo - Hidden on desktop since LeftNav shows it */}
        <Link href="/" className="flex items-center gap-2 shrink-0 lg:hidden">
          <span className="text-lg font-bold text-foreground">Gamerboxd</span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for games..."
              className="w-full h-9 pl-10 pr-4 rounded-full bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            className="w-9 h-9 rounded-full bg-secondary/50 hover:bg-secondary border border-border flex items-center justify-center transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-muted-foreground" />
          </button>

          <Link
            href={session ? '/profile' : '/login'}
            className="w-9 h-9 rounded-full bg-secondary/50 hover:bg-secondary border border-border flex items-center justify-center transition-colors"
            aria-label={session ? 'Go to profile' : 'Sign in'}
          >
            <User className="w-4 h-4 text-muted-foreground" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
