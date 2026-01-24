'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, Heart, Trophy } from 'lucide-react';
import { useUserFavorites } from '@/hooks/use-favorites';
import PageWrapper from '@/components/PageWrapper';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function FavoritesPage() {
  const { status } = useSession();
  const router = useRouter();
  const shouldReduce = useReducedMotion();
  const { data: favorites = [], isLoading } = useUserFavorites();

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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
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
                  My Favorites
                </h1>
                <p className="text-muted-foreground text-sm lg:text-base">
                  {favorites.length} {favorites.length === 1 ? 'game' : 'games'} ranked
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
                  <Heart className="w-5 h-5 text-pink-400" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Favorites Grid */}
        {favorites.length > 0 ? (
          <motion.div
            initial={shouldReduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {favorites.map((game: { id: string; gameSlug: string; gameName: string; gameImage: string | null; rank: number }, index: number) => (
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
                  className="flex items-center gap-4 p-4 lg:p-5 rounded-2xl transition-all relative overflow-hidden"
                  style={{
                    border: '1px solid var(--nav-border-color)',
                    background:
                      'linear-gradient(180deg, var(--glass-card-from) 0%, var(--glass-card-to) 100%)',
                    backdropFilter: 'blur(16px)',
                    boxShadow:
                      '0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)',
                  }}
                >
                  {/* Gradient Accent */}
                  <div
                    className="absolute inset-0 bg-linear-to-br from-pink-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />

                  {/* Rank Badge */}
                  <div className="relative z-10 shrink-0">
                    <div
                      className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center font-bold text-base lg:text-lg relative overflow-hidden border-0"
                      style={{
                        background:
                          game.rank === 1
                            ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(245, 158, 11, 0.3) 100%)'
                            : game.rank === 2
                              ? 'linear-gradient(135deg, rgba(209, 213, 219, 0.2) 0%, rgba(156, 163, 175, 0.3) 100%)'
                              : game.rank === 3
                                ? 'linear-gradient(135deg, rgba(205, 127, 50, 0.2) 0%, rgba(180, 100, 35, 0.3) 100%)'
                                : 'linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(239, 68, 68, 0.3) 100%)',
                        border:
                          game.rank === 1
                            ? '1px solid rgba(251, 191, 36, 0.4)'
                            : game.rank === 2
                              ? '1px solid rgba(209, 213, 219, 0.4)'
                              : game.rank === 3
                                ? '1px solid rgba(205, 127, 50, 0.4)'
                                : '1px solid rgba(236, 72, 153, 0.3)',
                        boxShadow:
                          game.rank === 1
                            ? '0 4px 12px rgba(251, 191, 36, 0.25)'
                            : game.rank === 2
                              ? '0 4px 12px rgba(209, 213, 219, 0.25)'
                              : game.rank === 3
                                ? '0 4px 12px rgba(205, 127, 50, 0.25)'
                                : '0 4px 12px rgba(236, 72, 153, 0.2)',
                      }}
                    >
                      {game.rank <= 3 && (
                        <Trophy
                          className="absolute inset-0 w-full h-full p-2 opacity-10"
                          style={{
                            color:
                              game.rank === 1
                                ? '#fbbf24'
                                : game.rank === 2
                                  ? '#d1d5db'
                                  : '#cd7f32',
                          }}
                        />
                      )}
                      <span
                        className="relative z-10 font-bold"
                        style={{
                          color:
                            game.rank === 1
                              ? '#fbbf24'
                              : game.rank === 2
                                ? '#9ca3af'
                                : game.rank === 3
                                  ? '#cd7f32'
                                  : '#ec4899',
                        }}
                      >
                        #{game.rank}
                      </span>
                    </div>
                  </div>

                  {/* Game Image */}
                  {game.gameImage && (
                    <div
                      className="relative w-16 h-16 lg:w-20 lg:h-20 rounded-xl overflow-hidden shrink-0 z-10"
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

                  {/* Game Info */}
                  <div className="flex-1 min-w-0 z-10">
                    <p className="font-semibold text-foreground text-base lg:text-lg truncate mb-1.5">
                      {game.gameName}
                    </p>
                    <div className="text-sm text-pink-400 flex items-center gap-1.5 font-medium">
                      <Heart className="w-4 h-4 fill-pink-400" />
                      Favorite
                    </div>
                  </div>

                  {/* Hover Arrow */}
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    style={{
                      background: 'var(--nav-hover)',
                    }}
                  >
                    <ArrowLeft className="w-4 h-4 text-muted-foreground rotate-180" />
                  </div>
                </motion.div>
              </Link>
            ))}
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
                  className="absolute inset-0 rounded-full bg-linear-to-br from-pink-500/20 to-rose-500/20 blur-2xl"
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
                  <Heart className="w-10 h-10 text-pink-400" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                No favorites yet
              </h3>
              <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                Start ranking your favorite games to showcase your top picks
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
