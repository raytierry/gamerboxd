'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Heart } from 'lucide-react';
import { useUserFavorites } from '@/hooks/use-favorites';
import PageWrapper from '@/components/PageWrapper';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function FavoritesPage() {
  const { status } = useSession();
  const router = useRouter();
  const { data: favorites = [], isLoading } = useUserFavorites();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading' || isLoading) {
    return (
      <PageWrapper className="p-6 lg:p-10 lg:pt-28 pb-28 lg:pb-10">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
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
          <h1 className="text-2xl font-bold text-white">My Favorites</h1>
          <p className="text-white/50 text-sm">{favorites.length} games</p>
        </div>
      </div>

      {/* Favorites List */}
      {favorites.length > 0 ? (
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
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg border border-white/20"
                style={{
                  background: 'linear-gradient(145deg, rgba(239, 68, 68, 0.3) 0%, rgba(185, 28, 28, 0.4) 100%)',
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
                <p className="font-medium text-white truncate">
                  {game.gameName}
                </p>
                <p className="text-sm text-white/50 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-red-400" />
                  #{game.rank} Favorite
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div
            className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center border border-white/10"
            style={{
              background: 'linear-gradient(145deg, rgba(239, 68, 68, 0.2) 0%, rgba(185, 28, 28, 0.3) 100%)',
            }}
          >
            <Heart className="w-8 h-8 text-white/30" />
          </div>
          <p className="text-white/50 mb-6">No favorites yet</p>
          <Button asChild className="rounded-full bg-white text-black hover:bg-white/90">
            <Link href="/search">Discover Games</Link>
          </Button>
        </div>
      )}
    </PageWrapper>
  );
}
