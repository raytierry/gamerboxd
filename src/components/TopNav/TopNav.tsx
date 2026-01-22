'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Search, Bell, User, LogIn, X, Gamepad2 } from 'lucide-react';
import { useSearch } from '@/contexts/SearchContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home' },
];

export default function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { query, setQuery } = useSearch();

  const handleSearchChange = (value: string) => {
    setQuery(value);
    if (value && pathname !== '/') {
      router.push('/');
    }
  };

  const isActive = (path: string) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path);

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-3rem)] max-w-4xl hidden lg:block">
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-full border border-white/[0.1]"
        style={{
          background: 'linear-gradient(145deg, rgba(45, 80, 75, 0.4) 0%, rgba(25, 45, 45, 0.6) 100%)',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}
      >
        <Link href="/" className="p-2.5 ml-1">
          <Gamepad2 className="w-6 h-6 text-white" />
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200',
                  active
                    ? 'bg-white/90 text-black'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1 flex items-center mx-4 px-4 py-2.5 rounded-full bg-white/5 focus-within:bg-white/[0.08] transition-colors min-w-0">
          <Search className="w-5 h-5 text-white/40 mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search games..."
            className="flex-1 min-w-0 bg-transparent text-sm text-white placeholder:text-white/40 outline-none border-none ring-0 focus:ring-0 focus:outline-none"
          />
          <button
            onClick={() => setQuery('')}
            className={cn(
              'p-1.5 transition-all shrink-0',
              query ? 'text-white/40 hover:text-white opacity-100' : 'opacity-0 pointer-events-none'
            )}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 mr-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-3 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all">
                  <Bell className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Coming soon</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {session ? (
            <Link
              href="/profile"
              className={cn(
                'p-3 rounded-full transition-all',
                isActive('/profile')
                  ? 'bg-white/20 text-white'
                  : 'text-white/50 hover:text-white hover:bg-white/10'
              )}
            >
              <User className="w-5 h-5" />
            </Link>
          ) : (
            <Link
              href="/login"
              className="p-3 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all"
            >
              <LogIn className="w-5 h-5" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
