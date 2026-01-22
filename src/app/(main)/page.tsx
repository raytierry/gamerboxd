'use client';

import { useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { ChevronRight, ChevronLeft, Monitor, Gamepad, Star, Loader2 } from 'lucide-react';
import { usePopularGames, useTrendingGames, useNewReleases, useHighlightGames } from '@/hooks/use-games';
import FeaturedHero from '@/components/FeaturedHero';
import PageWrapper from '@/components/PageWrapper';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { RAWGGame } from '@/types/game.types';

const PlatformIcon = ({ platformSlug }: { platformSlug: string }) => {
  if (platformSlug.includes('pc')) {
    return <Monitor className="w-3.5 h-3.5" />;
  }
  if (platformSlug.includes('playstation')) {
    return (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8.985 2.596v17.548l3.915 1.261V6.688c0-.69.304-1.151.794-.991.636.181.76.814.76 1.505v5.876c2.441 1.193 4.362-.002 4.362-3.153 0-3.237-1.126-4.675-4.438-5.827-1.307-.448-3.728-1.186-5.393-1.502z"/>
        <path d="M1.485 16.451c-.95.39-1.485.96-1.485 1.605 0 1.067 1.357 1.845 4.298 2.072 1.67.118 3.485-.113 4.987-.688l2.315-.877v-2.67l-3.325 1.21c-.977.374-2.255.53-3.147.478-.894-.053-1.162-.324-1.162-.648 0-.337.214-.608.642-.788l3.992-1.534v-2.725l-5.604 2.103c-1.11.443-2.09 1.06-2.511 2.462z"/>
        <path d="M22.755 16.82c-.77-.382-1.735-.512-3.173-.267-1.438.245-3.084.712-3.084.712l-1.098.417v2.619l4.097-1.543c.977-.374 2.255-.532 3.148-.478.893.053 1.162.324 1.162.648 0 .337-.214.607-.643.788l-4.097 1.534v2.725l2.103-.787c2.68-.997 4.83-1.906 4.83-3.673 0-.89-.604-2.003-3.245-2.695z"/>
      </svg>
    );
  }
  if (platformSlug.includes('xbox')) {
    return (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4.102 21.033C6.211 22.881 8.977 24 12 24c3.026 0 5.789-1.119 7.902-2.967 1.877-1.912-4.316-8.709-7.902-11.417-3.582 2.708-9.779 9.505-7.898 11.417zm11.16-14.406c2.5 2.961 7.484 10.313 6.076 12.912C23.015 17.534 24 14.883 24 12c0-5.07-3.145-9.407-7.587-11.175-.61.746-1.051 2.102-1.151 5.802zm-6.524 0C8.638 3.027 8.196 1.671 7.587.825 3.145 2.593 0 6.93 0 12c0 2.883.985 5.534 2.662 7.539-1.408-2.599 3.576-9.951 6.076-12.912z"/>
      </svg>
    );
  }
  if (platformSlug.includes('nintendo')) {
    return (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14.176 24h3.674c3.376 0 6.15-2.774 6.15-6.15V6.15C24 2.775 21.226 0 17.85 0H14.1c-.074 0-.15.074-.15.15v23.7c-.001.076.075.15.226.15zm4.574-13.199c1.351 0 2.399 1.125 2.399 2.398 0 1.352-1.125 2.4-2.399 2.4-1.35 0-2.4-1.049-2.4-2.4-.075-1.349 1.05-2.398 2.4-2.398zM9.824 0H6.15C2.775 0 0 2.775 0 6.15v11.7C0 21.226 2.775 24 6.15 24h3.674c.075 0 .15-.074.15-.149V.15c.001-.076-.074-.15-.15-.15zM5.25 15.6c-1.35 0-2.399-1.126-2.399-2.4 0-1.273 1.05-2.398 2.399-2.398 1.35 0 2.4 1.05 2.4 2.398 0 1.352-1.05 2.4-2.4 2.4z"/>
      </svg>
    );
  }
  return <Gamepad className="w-3.5 h-3.5" />;
};

function getUniquePlatforms(platforms: RAWGGame['platforms']) {
  if (!platforms) return [];
  
  const seen = new Set<string>();
  const result: string[] = [];
  
  for (const p of platforms) {
    const slug = p.platform.slug;
    let category = 'other';
    
    if (slug.includes('pc')) category = 'pc';
    else if (slug.includes('playstation')) category = 'playstation';
    else if (slug.includes('xbox')) category = 'xbox';
    else if (slug.includes('nintendo') || slug.includes('switch')) category = 'nintendo';
    
    if (!seen.has(category)) {
      seen.add(category);
      result.push(slug);
    }
  }
  
  return result.slice(0, 4);
}

export default function HomePage() {
  const { data: session } = useSession();

  const { data: highlightGames, isLoading: loadingHighlight } = useHighlightGames(10);
  const { data: popularGames, isLoading: loadingPopular } = usePopularGames(20);
  const { data: trendingGames, isLoading: loadingTrending } = useTrendingGames(20);
  const { data: newReleases, isLoading: loadingNew } = useNewReleases(20);

  // Use high metacritic games for the hero section
  const heroGames = highlightGames?.results?.slice(0, 5) || [];

  return (
    <PageWrapper className="min-h-screen pb-28 lg:pb-10">
        {loadingHighlight ? (
          <Skeleton className="h-[500px] sm:h-[480px] lg:h-[520px]" />
        ) : (
          heroGames.length > 0 && <FeaturedHero games={heroGames} />
        )}

        <div className="mt-10 space-y-10">
          <CarouselSection
            title="Popular"
            games={popularGames?.results?.slice(5) || []}
            isLoading={loadingPopular}
          />

          <CarouselSection
            title="Trending"
            games={trendingGames?.results || []}
            isLoading={loadingTrending}
          />

          <CarouselSection
            title="New Releases"
            games={newReleases?.results || []}
            isLoading={loadingNew}
          />

          {!session && (
            <section className="text-center py-16 px-6">
              <h2 className="text-2xl font-semibold text-foreground mb-3">
                Track your gaming journey
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Create your backlog, rank your favorites, and discover new games.
              </p>
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 bg-white text-black hover:bg-white/90"
              >
                <Link href="/register">Get Started</Link>
              </Button>
            </section>
          )}
        </div>
    </PageWrapper>
  );
}

function CarouselSection({
  title,
  games,
  isLoading,
}: {
  title: string;
  games: RAWGGame[];
  isLoading: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section>
      <div className="flex items-center justify-between px-6 lg:px-10 mb-5">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
          >
            <ChevronLeft className="w-4 h-4 text-white/70" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
          >
            <ChevronRight className="w-4 h-4 text-white/70" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth hide-scrollbar px-6 lg:px-10 pt-2 pb-4"
      >
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="shrink-0 w-[280px] sm:w-[300px] lg:w-[340px]">
                <Skeleton className="aspect-[16/10] rounded-t-2xl" />
                <div className="p-4 bg-white/5 rounded-b-2xl">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-3" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            ))
          : games.map((game) => <CarouselCard key={game.id} game={game} />)}
      </div>
    </section>
  );
}

function CarouselCard({ game }: { game: RAWGGame }) {
  const platforms = getUniquePlatforms(game.platforms);
  const releaseYear = game.released ? new Date(game.released).getFullYear() : null;
  const shouldReduce = useReducedMotion();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
  };

  return (
    <Link
      href={`/games/${game.slug}`}
      className="shrink-0 w-[280px] sm:w-[300px] lg:w-[340px]"
      onClick={handleClick}
    >
      <motion.div
        className="group relative rounded-2xl overflow-hidden glass-card"
        initial={false}
        whileHover={shouldReduce ? undefined : { 
          y: -8,
          transition: { type: 'spring', stiffness: 400, damping: 20 }
        }}
      >
        {/* Loading overlay */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-30 bg-black/60 backdrop-blur-sm flex items-center justify-center"
          >
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </motion.div>
        )}

        {/* Shine effect overlay */}
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none"
          initial={{ x: '-100%', opacity: 0 }}
          whileHover={shouldReduce ? undefined : { 
            x: '100%', 
            opacity: 1,
            transition: { duration: 0.6, ease: 'easeInOut' }
          }}
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
          }}
        />

        <div className="relative aspect-[16/10] overflow-hidden">
          {game.background_image ? (
            <Image
              src={game.background_image}
              alt={game.name}
              fill
              className="object-cover"
              sizes="340px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white/5">
              <span className="text-3xl opacity-20">🎮</span>
            </div>
          )}

          {game.metacritic && (
            <motion.div 
              className="absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-bold text-white z-20"
              style={{
                background: game.metacritic >= 75 
                  ? 'rgba(34, 197, 94, 0.9)' 
                  : game.metacritic >= 50 
                    ? 'rgba(234, 179, 8, 0.9)' 
                    : 'rgba(239, 68, 68, 0.9)',
                backdropFilter: 'blur(8px)',
              }}
              whileHover={shouldReduce ? undefined : { scale: 1.1 }}
            >
              {game.metacritic}
            </motion.div>
          )}
        </div>

        <div className="p-4">
          <motion.h3 
            className="font-semibold text-white text-base leading-tight line-clamp-1 mb-2"
            initial={false}
            whileHover={shouldReduce ? undefined : { x: 4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {game.name}
          </motion.h3>

          <div className="flex items-center gap-2 mb-3">
            {game.genres?.[0] && (
              <span className="text-xs text-white/50 bg-white/5 px-2 py-0.5 rounded-full">
                {game.genres[0].name}
              </span>
            )}
            {releaseYear && (
              <span className="text-xs text-white/40">{releaseYear}</span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {platforms.length > 0 && (
                <div className="flex items-center gap-1.5 text-white/40">
                  {platforms.map((slug) => (
                    <PlatformIcon key={slug} platformSlug={slug} />
                  ))}
                </div>
              )}
              {game.rating > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs font-medium text-white/60">
                    {game.rating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
