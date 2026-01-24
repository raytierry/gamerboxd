'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
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
  const shouldReduce = useReducedMotion();
  const { data: backlog = [], isLoading } = useUserBacklog();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading' || isLoading) {
    return (
      <PageWrapper className="px-6 lg:px-10 pt-6 lg:pt-28 pb-28 lg:pb-10">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="px-6 lg:px-10 pt-6 lg:pt-28 pb-28 lg:pb-10">
      <div className="max-w-4xl mx-auto">
        {/* Header with Glass Effect */}
        <motion.div
          initial={shouldReduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <div
            className="rounded-3xl nav-glass p-6 lg:p-8"
            style={{
              border: '1px solid var(--nav-border-color)',
              boxShadow: 'var(--nav-shadow)',
            }}
          >
            <div className="flex items-center gap-4">
              <Link
                href="/profile"
                className="p-2.5 -ml-2 rounded-xl transition-all"
                style={{
                  color: 'var(--nav-icon)',
                  background: 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--nav-icon-hover)';
                  e.currentTarget.style.background = 'var(--nav-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--nav-icon)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex-1">
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-1">
                  My Backlog
                </h1>
                <p className="text-muted-foreground text-sm lg:text-base">
                  {backlog.length} {backlog.length === 1 ? 'game' : 'games'} to play
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="px-4 py-2 rounded-xl"
                  style={{
                    background:
                      'linear-gradient(180deg, var(--glass-button-from) 0%, var(--glass-button-to) 100%)',
                    border: '1px solid var(--nav-border-color)',
                  }}
                >
                  <Gamepad2 className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Game List */}
        {backlog.length > 0 ? (
          <motion.div
            initial={shouldReduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-3"
          >
            {backlog.map((game: { id: string; gameSlug: string; gameName: string; gameImage: string | null; status: BacklogStatus }, index: number) => {
              const statusConfig = STATUS_CONFIG[game.status];
              const StatusIcon = statusConfig.icon;

              return (
                <Link
                  key={game.id}
                  href={`/games/${game.gameSlug}`}
                  className="block group"
                >
                  <motion.div
                    initial={shouldReduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.05 * index,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    whileHover={shouldReduce ? undefined : { y: -2 }}
                    className="flex items-center gap-4 p-4 lg:p-5 rounded-2xl transition-all"
                    style={{
                      border: '1px solid var(--nav-border-color)',
                      background:
                        'linear-gradient(180deg, var(--glass-card-from) 0%, var(--glass-card-to) 100%)',
                      backdropFilter: 'blur(16px)',
                      boxShadow:
                        '0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)',
                    }}
                  >
                    {game.gameImage && (
                      <div
                        className="relative w-16 h-16 lg:w-20 lg:h-20 rounded-xl overflow-hidden shrink-0"
                        style={{
                          border: '1px solid var(--card-border-color)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        }}
                      >
                        <Image
                          src={game.gameImage}
                          alt={game.gameName}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-base lg:text-lg truncate mb-1.5">
                        {game.gameName}
                      </p>
                      <div className={`text-sm ${statusConfig.color} flex items-center gap-1.5 font-medium`}>
                        <StatusIcon className="w-4 h-4" />
                        {statusConfig.label}
                      </div>
                    </div>
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{
                        background: 'var(--nav-hover)',
                      }}
                    >
                      <ArrowLeft className="w-4 h-4 text-muted-foreground rotate-180" />
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            initial={shouldReduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center py-20"
          >
            <div
              className="rounded-3xl nav-glass p-12"
              style={{
                border: '1px solid var(--nav-border-color)',
                boxShadow: 'var(--nav-shadow)',
              }}
            >
              <div className="relative inline-block mb-6">
                <div
                  className="absolute inset-0 rounded-full bg-linear-to-br from-blue-500/20 to-cyan-500/20 blur-2xl"
                  style={{ transform: 'scale(1.3)' }}
                />
                <div
                  className="relative w-24 h-24 rounded-full flex items-center justify-center"
                  style={{
                    border: '1px solid var(--nav-border-color)',
                    background:
                      'linear-gradient(180deg, var(--glass-button-from) 0%, var(--glass-button-to) 100%)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  }}
                >
                  <Gamepad2 className="w-10 h-10 text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Your backlog is empty
              </h3>
              <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                Start building your gaming library by adding games you want to play
              </p>
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 font-semibold"
                style={{
                  background: 'var(--button-primary)',
                  color: 'var(--button-primary-text)',
                }}
              >
                <Link href="/search">Discover Games</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </PageWrapper>
  );
}
