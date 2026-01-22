'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  LogOut,
  Gamepad2,
  Clock,
  CheckCircle,
  XCircle,
  Pause,
  Heart,
} from 'lucide-react';
import { useUserBacklog } from '@/hooks/use-backlog';
import { useUserFavorites } from '@/hooks/use-favorites';
import { BacklogStatus } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

const STATUS_CONFIG: Record<
  BacklogStatus,
  { label: string; icon: typeof Gamepad2; color: string }
> = {
  WANT_TO_PLAY: { label: 'Want to Play', icon: Gamepad2, color: 'text-blue-400' },
  PLAYING: { label: 'Playing', icon: Clock, color: 'text-emerald-400' },
  COMPLETED: { label: 'Completed', icon: CheckCircle, color: 'text-green-400' },
  DROPPED: { label: 'Dropped', icon: XCircle, color: 'text-red-400' },
  ON_HOLD: { label: 'On Hold', icon: Pause, color: 'text-amber-400' },
};

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
      <main className="p-6 lg:p-10 lg:pt-28 space-y-8">
        <Skeleton className="h-20 w-64" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      </main>
    );
  }

  if (!session?.user) {
    return null;
  }

  const stats = {
    total: backlog.length,
    playing: backlog.filter((g) => g.status === BacklogStatus.PLAYING).length,
    completed: backlog.filter((g) => g.status === BacklogStatus.COMPLETED).length,
    favorites: favorites.length,
  };

  return (
    <main className="p-6 lg:p-10 lg:pt-28 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {session.user.name || 'Gamer'}
          </h1>
          <p className="text-muted-foreground">{session.user.email}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ callbackUrl: '/' })}
          className="gap-2 text-white/60 hover:text-white hover:bg-white/10"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total" value={backlogLoading ? '-' : stats.total} />
        <StatCard label="Playing" value={backlogLoading ? '-' : stats.playing} />
        <StatCard label="Completed" value={backlogLoading ? '-' : stats.completed} />
        <StatCard label="Favorites" value={favoritesLoading ? '-' : stats.favorites} />
      </div>

      <Tabs defaultValue="backlog">
        <TabsList 
          className="p-1 rounded-xl border border-white/10 mb-6"
          style={{
            background: 'linear-gradient(145deg, rgba(45, 80, 75, 0.2) 0%, rgba(25, 45, 45, 0.3) 100%)',
          }}
        >
          <TabsTrigger 
            value="backlog"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-black"
          >
            Backlog
          </TabsTrigger>
          <TabsTrigger 
            value="favorites"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-black"
          >
            Favorites
          </TabsTrigger>
        </TabsList>

        <TabsContent value="backlog">
          {backlogLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-2xl" />
              ))}
            </div>
          ) : backlog.length > 0 ? (
            <div className="space-y-3">
              {backlog.map((game) => {
                const statusConfig = STATUS_CONFIG[game.status];
                const StatusIcon = statusConfig.icon;
                return (
                  <Link
                    key={game.id}
                    href={`/games/${game.gameSlug}`}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 hover:bg-white/5 transition-colors"
                    style={{
                      background: 'linear-gradient(145deg, rgba(45, 80, 75, 0.1) 0%, rgba(25, 45, 45, 0.15) 100%)',
                    }}
                  >
                    {game.gameImage && (
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
                        <Image
                          src={game.gameImage}
                          alt={game.gameName}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {game.gameName}
                      </p>
                      <p className={`text-sm ${statusConfig.color} flex items-center gap-1.5`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {statusConfig.label}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <EmptyState message="Your backlog is empty" />
          )}
        </TabsContent>

        <TabsContent value="favorites">
          {favoritesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-2xl" />
              ))}
            </div>
          ) : favorites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {favorites.map((game) => (
                <Link
                  key={game.id}
                  href={`/games/${game.gameSlug}`}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 hover:bg-white/5 transition-colors"
                  style={{
                    background: 'linear-gradient(145deg, rgba(45, 80, 75, 0.1) 0%, rgba(25, 45, 45, 0.15) 100%)',
                  }}
                >
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold border border-white/10"
                    style={{
                      background: 'linear-gradient(145deg, rgba(45, 80, 75, 0.3) 0%, rgba(25, 45, 45, 0.4) 100%)',
                    }}
                  >
                    {game.rank}
                  </div>
                  {game.gameImage && (
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
                      <Image
                        src={game.gameImage}
                        alt={game.gameName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {game.gameName}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5" />
                      #{game.rank} Favorite
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState message="No favorites yet" />
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div 
      className="p-5 rounded-2xl border border-white/10"
      style={{
        background: 'linear-gradient(145deg, rgba(45, 80, 75, 0.15) 0%, rgba(25, 45, 45, 0.2) 100%)',
      }}
    >
      <p className="text-3xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-16">
      <p className="text-muted-foreground mb-6">{message}</p>
      <Button asChild className="rounded-full bg-white text-black hover:bg-white/90">
        <Link href="/">Discover Games</Link>
      </Button>
    </div>
  );
}
