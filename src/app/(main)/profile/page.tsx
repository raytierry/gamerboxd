'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { FadeIn, FadeInUp, StaggerContainer, StaggerItem } from '@/components/Motion';
import { User, LogOut, Gamepad2, Clock, CheckCircle, XCircle, Pause } from 'lucide-react';
import { useUserBacklog } from '@/hooks/use-backlog';
import { BacklogStatus } from '@prisma/client';

const STATUS_CONFIG: Record<BacklogStatus, { label: string; icon: typeof Gamepad2; color: string }> = {
  WANT_TO_PLAY: { label: 'Want to Play', icon: Gamepad2, color: 'text-blue-400' },
  PLAYING: { label: 'Playing', icon: Clock, color: 'text-green-400' },
  COMPLETED: { label: 'Completed', icon: CheckCircle, color: 'text-emerald-400' },
  DROPPED: { label: 'Dropped', icon: XCircle, color: 'text-red-400' },
  ON_HOLD: { label: 'On Hold', icon: Pause, color: 'text-yellow-400' },
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data: backlog = [], isLoading: backlogLoading } = useUserBacklog();

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
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </FadeInUp>

        <StaggerContainer className="grid gap-6 md:grid-cols-3">
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
              <p className="text-sm text-muted-foreground">games in your backlog</p>
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
              <p className="text-sm text-muted-foreground">games currently playing</p>
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
              <p className="text-sm text-muted-foreground">games completed</p>
            </div>
          </StaggerItem>
        </StaggerContainer>

        <FadeIn className="mt-12">
          {backlog.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Your Games</h3>
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
              <Button
                onClick={() => router.push('/games')}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Discover Games
              </Button>
            </div>
          )}
        </FadeIn>
      </div>
    </main>
  );
}
