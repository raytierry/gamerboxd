'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Gamepad2, Clock, CheckCircle, XCircle, Pause } from 'lucide-react';
import { useUserBacklog } from '@/hooks/use-backlog';
import { BacklogStatus } from '@prisma/client';
import PageWrapper from '@/components/PageWrapper';
import { Button } from '@/components/ui/button';
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

export default function BacklogPage() {
  const { status } = useSession();
  const router = useRouter();
  const { data: backlog = [], isLoading } = useUserBacklog();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading' || isLoading) {
    return (
      <PageWrapper className="p-6 lg:p-10 lg:pt-28 pb-28 lg:pb-10">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="p-6 lg:p-10 lg:pt-28 pb-28 lg:pb-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/profile"
          className="p-2 -ml-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">My Backlog</h1>
          <p className="text-white/50 text-sm">{backlog.length} games</p>
        </div>
      </div>

      {/* Game List */}
      {backlog.length > 0 ? (
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
                  <p className="font-medium text-white truncate">
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
        <div className="text-center py-16">
          <div
            className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center border border-white/10"
            style={{
              background: 'linear-gradient(145deg, rgba(45, 80, 75, 0.2) 0%, rgba(25, 45, 45, 0.3) 100%)',
            }}
          >
            <Gamepad2 className="w-8 h-8 text-white/30" />
          </div>
          <p className="text-white/50 mb-6">Your backlog is empty</p>
          <Button asChild className="rounded-full bg-white text-black hover:bg-white/90">
            <Link href="/search">Discover Games</Link>
          </Button>
        </div>
      )}
    </PageWrapper>
  );
}
