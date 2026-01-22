'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  LogOut,
  Gamepad2,
  Heart,
  BarChart3,
  Trophy,
  Settings,
  Bell,
  ChevronRight,
} from 'lucide-react';
import { useUserBacklog } from '@/hooks/use-backlog';
import { useUserFavorites } from '@/hooks/use-favorites';
import PageWrapper from '@/components/PageWrapper';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data: backlog = [], isLoading: backlogLoading } = useUserBacklog();
  const { data: favorites = [], isLoading: favoritesLoading } = useUserFavorites();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <PageWrapper className="p-6 lg:p-10 lg:pt-28 pb-28 lg:pb-10">
        <div className="flex flex-col items-center">
          <Skeleton className="w-24 h-24 rounded-full" />
          <Skeleton className="h-6 w-32 mt-4" />
          <Skeleton className="h-4 w-48 mt-2" />
        </div>
      </PageWrapper>
    );
  }

  if (!session?.user) {
    return null;
  }

  const stats = {
    total: backlog.length,
    favorites: favorites.length,
  };

  return (
    <PageWrapper className="p-6 lg:p-10 lg:pt-28 pb-28 lg:pb-10 max-w-lg mx-auto">
      {/* Profile Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-24 h-24 rounded-full overflow-hidden bg-white/10 border-2 border-white/20">
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || 'Avatar'}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl text-white/60">
              {session.user.name?.[0]?.toUpperCase() || '?'}
            </div>
          )}
        </div>
        <h1 className="text-xl font-bold text-white mt-4">
          {session.user.name || 'Gamer'}
        </h1>
        <p className="text-white/50 text-sm">{session.user.email}</p>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-center gap-3 mb-8">
        <QuickActionButton icon={Bell} label="Notifications" disabled />
        <QuickActionButton icon={Settings} label="Settings" disabled />
      </div>

      {/* Stats Section */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 px-1">
          Overview
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={Gamepad2}
            label="Backlog"
            value={backlogLoading ? '-' : stats.total}
          />
          <StatCard
            icon={Heart}
            label="Favorites"
            value={favoritesLoading ? '-' : stats.favorites}
          />
        </div>
      </section>

      {/* My Games Section */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 px-1">
          My Games
        </h2>
        <div className="space-y-2">
          <LinkCard
            href="/profile/backlog"
            icon={Gamepad2}
            label="My Backlog"
            subtitle={backlogLoading ? '...' : `${stats.total} games`}
          />
          <LinkCard
            href="/profile/favorites"
            icon={Heart}
            label="My Favorites"
            subtitle={favoritesLoading ? '...' : `${stats.favorites} games`}
          />
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 px-1">
          Coming Soon
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <ComingSoonCard icon={BarChart3} label="Statistics" />
          <ComingSoonCard icon={Trophy} label="Achievements" />
        </div>
      </section>

      {/* Sign Out */}
      <div className="mt-auto">
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign out
        </button>
        
        <p className="text-center text-white/30 text-xs mt-6">
          Gamerboxd v0.1.0
        </p>
      </div>
    </PageWrapper>
  );
}

function QuickActionButton({ 
  icon: Icon, 
  label, 
  disabled 
}: { 
  icon: typeof Bell; 
  label: string; 
  disabled?: boolean;
}) {
  return (
    <button
      disabled={disabled}
      className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      title={disabled ? 'Coming soon' : label}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
}

function StatCard({ 
  icon: Icon, 
  label, 
  value 
}: { 
  icon: typeof Gamepad2; 
  label: string; 
  value: number | string;
}) {
  return (
    <div
      className="p-5 rounded-2xl border border-white/[0.08] text-center"
      style={{
        background: 'linear-gradient(145deg, rgba(45, 80, 75, 0.12) 0%, rgba(25, 45, 45, 0.15) 100%)',
      }}
    >
      <Icon className="w-5 h-5 text-white/30 mx-auto mb-2" />
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="text-sm text-white/40">{label}</p>
    </div>
  );
}

function LinkCard({
  href,
  icon: Icon,
  label,
  subtitle,
}: {
  href: string;
  icon: typeof Gamepad2;
  label: string;
  subtitle: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/20 transition-all group"
    >
      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-white/60" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-white">{label}</p>
        <p className="text-sm text-white/40">{subtitle}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all" />
    </Link>
  );
}

function ComingSoonCard({
  icon: Icon,
  label,
}: {
  icon: typeof Gamepad2;
  label: string;
}) {
  return (
    <div
      className="p-5 rounded-2xl border border-dashed border-white/[0.08] text-center opacity-50"
      style={{
        background: 'rgba(255,255,255,0.01)',
      }}
    >
      <Icon className="w-5 h-5 text-white/20 mx-auto mb-2" />
      <p className="text-sm font-medium text-white/40">{label}</p>
      <p className="text-xs text-white/20 mt-1">Coming soon</p>
    </div>
  );
}
