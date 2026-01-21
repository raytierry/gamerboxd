'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Gamepad2, Search, User } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0d0d0f]/80 backdrop-blur-xl border-b border-white/5">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <Gamepad2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              gamer<span className="text-indigo-400">boxd</span>
            </span>
          </Link>

          <div className="hidden sm:flex items-center gap-1">
            <Link
              href="/games"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/games')
                  ? 'bg-white/10 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Explore
              </span>
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Get started
          </Link>
        </div>
      </nav>
    </header>
  );
}
