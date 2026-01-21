'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Gamepad2, Search, User, Compass } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-background/60 backdrop-blur-xl border-b border-white/5" />
      
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between relative">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 group-hover:scale-105 transition-all duration-300">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight hidden sm:block">
              gamer<span className="text-indigo-400">boxd</span>
            </span>
          </Link>

          <div className="hidden sm:flex items-center gap-1">
            <NavLink href="/games" isActive={isActive('/games')}>
              <Compass className="w-4 h-4" />
              Explore
            </NavLink>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile search */}
          <Link
            href="/games"
            className="sm:hidden p-2 text-gray-400 hover:text-white transition-colors"
          >
            <Search className="w-5 h-5" />
          </Link>

          {status === 'loading' ? (
            <div className="h-9 w-9 rounded-full bg-white/5 animate-pulse" />
          ) : session?.user ? (
            <Link
              href="/profile"
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-300 ${
                isActive('/profile')
                  ? 'bg-white/10 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center ring-2 ring-white/10">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="hidden sm:inline text-sm font-medium max-w-[120px] truncate">
                {session.user.name || 'Profile'}
              </span>
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

function NavLink({ 
  href, 
  isActive, 
  children 
}: { 
  href: string; 
  isActive: boolean; 
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
        isActive
          ? 'bg-white/10 text-white'
          : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
    >
      {children}
    </Link>
  );
}
