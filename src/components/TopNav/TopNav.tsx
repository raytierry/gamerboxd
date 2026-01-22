'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Bell, User, LogIn, Gamepad2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export default function TopNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (path: string) => {
    return pathname.startsWith(path);
  };

  return (
    <header className="fixed top-6 right-6 z-50 hidden lg:block">
      <div
        className="flex items-center gap-6 px-6 py-3 rounded-full border border-white/[0.1]"
        style={{
          background: 'linear-gradient(145deg, rgba(45, 80, 75, 0.4) 0%, rgba(25, 45, 45, 0.6) 100%)',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}
      >
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-2 rounded-xl bg-white/10 group-hover:bg-white/15 transition-colors">
            <Gamepad2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-white tracking-tight">
            Gamerboxd
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-2.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all">
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
                'p-2.5 rounded-full transition-all',
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
              className="p-2.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all"
            >
              <LogIn className="w-5 h-5" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
