'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PushButton } from '@/components/PushButton';
import { FadeIn, FadeInUp, StaggerContainer, StaggerItem } from '@/components/Motion';
import { User, LogOut, Gamepad2, Clock, CheckCircle, XCircle, Pause, Heart, Trophy } from 'lucide-react';
import { useUserBacklog } from '@/hooks/use-backlog';
import { useUserFavorites } from '@/hooks/use-favorites';
import { BacklogStatus } from '@prisma/client';

const STATUS_CONFIG: Record<BacklogStatus, { label: string; icon: typeof Gamepad2; color: string }> = {
  WANT_TO_PLAY: { label: 'Want to Play', icon: Gamepad2, color: 'text-blue-400' },
  PLAYING: { label: 'Playing', icon: Clock, color: 'text-green-400' },
  COMPLETED: { label: 'Completed', icon: CheckCircle, color: 'text-emerald-400' },
  DROPPED: { label: 'Dropped', icon: XCircle, color: 'text-red-400' },
  ON_HOLD: { label: 'On Hold', icon: Pause, color: 'text-yellow-400' },
};

const RANK_COLORS = [
  'from-amber-400 to-yellow-500',
  'from-slate-300 to-slate-400',
  'from-amber-600 to-amber-700',
  'from-indigo-400 to-indigo-500',
  'from-purple-400 to-purple-500',
  'from-pink-400 to-pink-500',
  'from-rose-400 to-rose-500',
  'from-orange-400 to-orange-500',
  'from-teal-400 to-teal-500',
  'from-cyan-400 to-cyan-500',
];

type Tab = 'backlog' | 'favorites';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('backlog');
  const { data: backlog = [], isLoading: backlogLoading } = useUserBacklog();
  const { data: favorites = [], isLoading: favoritesLoading } = useUserFavorites();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </main>
    );
  }

  if (!session?.user) {
    return null;
  }

  const totalGames = backlog.length;
  const playingGames = backlog.filter((g) => g.status === BacklogStatus.PLAYING).length;
  const completedGames = backlog.filter((g) => g.status === BacklogStatus.COMPLETED).length;
  const totalFavorites = favorites.length;

  async function handleSignOut() {
    await signOut({ callbackUrl: '/' });
  }

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="container mx-auto max-w-4xl">
        <FadeInUp>
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-purple-600">
                <User className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {session.user.name || 'Gamer'}
                </h1>
                <p className="text-muted-foreground">{session.user.email}</p>
              </div>
            </div>
            <PushButton
              variant="outline"
              size="sm"
              onClick={handleSignOut}
            >
              <span className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Sign out
              </span>
            </PushButton>
          </div>
        </FadeInUp>

        <StaggerContainer className="grid gap-6 md:grid-cols-4">
          <StaggerItem>
            <div className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <Gamepad2 className="h-5 w-5 text-blue-500" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Backlog</h2>
              </div>
              <p className="text-3xl font-bold text-foreground">
                {backlogLoading ? '...' : totalGames}
              </p>
              <p className="text-sm text-muted-foreground">total games</p>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                  <Clock className="h-5 w-5 text-green-500" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Playing</h2>
              </div>
              <p className="text-3xl font-bold text-foreground">
                {backlogLoading ? '...' : playingGames}
              </p>
              <p className="text-sm text-muted-foreground">currently playing</p>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Completed</h2>
              </div>
              <p className="text-3xl font-bold text-foreground">
                {backlogLoading ? '...' : completedGames}
              </p>
              <p className="text-sm text-muted-foreground">games beaten</p>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-500/10">
                  <Heart className="h-5 w-5 text-pink-500" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Favorites</h2>
              </div>
              <p className="text-3xl font-bold text-foreground">
                {favoritesLoading ? '...' : totalFavorites}
              </p>
              <p className="text-sm text-muted-foreground">top picks</p>
            </div>
          </StaggerItem>
        </StaggerContainer>

        <FadeIn className="mt-12">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('backlog')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'backlog'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className="flex items-center gap-2">
                <Gamepad2 className="h-4 w-4" />
                Backlog
              </span>
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'favorites'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Favorites
              </span>
            </button>
          </div>

          {activeTab === 'backlog' && (
            <>
              {backlog.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid gap-3">
                    {backlog.map((game) => {
                      const statusConfig = STATUS_CONFIG[game.status];
                      const StatusIcon = statusConfig.icon;
                      return (
                        <Link
                          key={game.id}
                          href={`/games/${game.gameSlug}`}
                          className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:bg-card/80"
                        >
                          {game.gameImage && (
                            <Image
                              src={game.gameImage}
                              alt={game.gameName}
                              width={64}
                              height={64}
                              className="rounded-lg object-cover"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{game.gameName}</p>
                            <div className={`flex items-center gap-1.5 text-sm ${statusConfig.color}`}>
                              <StatusIcon className="h-3.5 w-3.5" />
                              {statusConfig.label}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-border bg-card p-8 text-center">
                  <Gamepad2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Your backlog is empty
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Start by searching for games and adding them to your backlog
                  </p>
                  <PushButton onClick={() => router.push('/games')} size="sm">
                    Discover Games
                  </PushButton>
                </div>
              )}
            </>
          )}

          {activeTab === 'favorites' && (
            <>
              {favorites.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {favorites.map((game) => (
                    <Link
                      key={game.id}
                      href={`/games/${game.gameSlug}`}
                      className="group relative flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:bg-card/80 overflow-hidden"
                    >
                      <div
                        className={`absolute top-0 left-0 w-1.5 h-full bg-linear-to-b ${RANK_COLORS[game.rank - 1]}`}
                      />
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ${RANK_COLORS[game.rank - 1]} text-white font-bold text-lg shadow-lg`}
                      >
                        {game.rank}
                      </div>
                      {game.gameImage && (
                        <Image
                          src={game.gameImage}
                          alt={game.gameName}
                          width={56}
                          height={56}
                          className="rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                          {game.gameName}
                        </p>
                        <div className="flex items-center gap-1.5 text-sm text-pink-400">
                          <Heart className="h-3.5 w-3.5 fill-current" />
                          #{game.rank} Favorite
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-border bg-card p-8 text-center">
                  <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No favorites yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Add your top 10 favorite games to create your personal tierlist
                  </p>
                  <PushButton onClick={() => router.push('/games')} size="sm">
                    Find Games to Love
                  </PushButton>
                </div>
              )}
            </>
          )}
        </FadeIn>
      </div>
    </main>
  );
}
