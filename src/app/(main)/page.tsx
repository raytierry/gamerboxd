"use client";

import { useRef, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import {
  ChevronRight,
  ChevronLeft,
  Monitor,
  Gamepad,
  Loader2,
  Star,
} from "lucide-react";
import { FaPlaystation, FaXbox } from "react-icons/fa";
import { SiNintendoswitch } from "react-icons/si";
import {
  usePopularGames,
  useTrendingGames,
  useNewReleases,
  useHighlightGames,
} from "@/hooks/use-games";
import FeaturedHero from "@/components/FeaturedHero";
import PageWrapper from "@/components/PageWrapper";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { RAWGGame } from "@/types/game.types";
import { formatRating } from "@/lib/format";

const PlatformIcon = ({ platformSlug }: { platformSlug: string }) => {
  if (platformSlug.includes("pc")) {
    return <Monitor className="w-3.5 h-3.5" />;
  }
  if (platformSlug.includes("playstation")) {
    return <FaPlaystation className="w-3.5 h-3.5" />;
  }
  if (platformSlug.includes("xbox")) {
    return <FaXbox className="w-3.5 h-3.5" />;
  }
  if (platformSlug.includes("nintendo")) {
    return <SiNintendoswitch className="w-3.5 h-3.5" />;
  }
  return <Gamepad className="w-3.5 h-3.5" />;
};

function getUniquePlatforms(
  platforms:
    | { platform: { id: number; name: string; slug: string } }[]
    | undefined,
) {
  if (!platforms) return [];

  const seen = new Set<string>();
  const result: string[] = [];

  for (const p of platforms) {
    const slug = p.platform.slug;
    let category = "other";

    if (slug.includes("pc")) category = "pc";
    else if (slug.includes("playstation")) category = "playstation";
    else if (slug.includes("xbox")) category = "xbox";
    else if (slug.includes("nintendo") || slug.includes("switch"))
      category = "nintendo";

    if (!seen.has(category)) {
      seen.add(category);
      result.push(slug);
    }
  }

  return result.slice(0, 4);
}

export default function HomePage() {
  const { data: session } = useSession();

  const { data: highlightGames, isLoading: loadingHighlight } =
    useHighlightGames(10);
  const { data: popularGames, isLoading: loadingPopular } = usePopularGames(20);
  const { data: trendingGames, isLoading: loadingTrending } =
    useTrendingGames(20);
  const { data: newReleases, isLoading: loadingNew } = useNewReleases(20);

  // Use high metacritic games for the hero section
  const heroGames = highlightGames?.results?.slice(0, 5) || [];

  return (
    <PageWrapper className="min-h-screen pb-28 lg:pb-10">
      {/* Hero Section with Right Sidebar */}
      <div className="px-6 lg:px-10 pt-6 pb-8">
        <div className="flex gap-6 lg:gap-8">
          {/* Hero Section - Takes up remaining space */}
          <div className="flex-1 min-w-0">
            {loadingHighlight ? (
              <div
                className="h-[500px] lg:h-[600px] rounded-3xl overflow-hidden"
                style={{
                  border: "1px solid var(--nav-border-color)",
                }}
              >
                <Skeleton className="h-full rounded-none" />
              </div>
            ) : (
              heroGames.length > 0 && (
                <div
                  className="rounded-3xl overflow-hidden h-[500px] lg:h-[600px]"
                  style={{
                    boxShadow:
                      "0 8px 32px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3)",
                  }}
                >
                  <FeaturedHero games={heroGames} />
                </div>
              )
            )}
          </div>

          {/* Right Sidebar - Desktop Only */}
          <aside className="hidden xl:block w-96">
            {loadingHighlight ? (
              <div
                className="rounded-3xl nav-glass p-8 h-full"
                style={{
                  border: "1px solid var(--nav-border-color)",
                  boxShadow: "var(--nav-shadow)",
                }}
              >
                <Skeleton className="h-8 w-32 mb-6" />
                <div className="rounded-2xl bg-secondary/30 p-1.5 mb-8">
                  <div className="flex gap-1">
                    <Skeleton className="flex-1 h-12 rounded-xl" />
                    <Skeleton className="flex-1 h-12 rounded-xl" />
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <Skeleton className="h-4 w-20 mb-4" />
                    <div className="space-y-4">
                      {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <Skeleton className="w-12 h-12 rounded-full" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-32" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Skeleton className="h-4 w-20 mb-4" />
                    <div className="space-y-4">
                      {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <Skeleton className="w-12 h-12 rounded-full" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-40" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Updates Section */
              <div
                className="rounded-3xl nav-glass p-8 h-full relative overflow-hidden"
                style={{
                  border: "1px solid var(--nav-border-color)",
                  boxShadow: "var(--nav-shadow)",
                }}
              >
                <h3 className="text-2xl font-bold text-foreground mb-6">
                  Updates
                </h3>

                {/* Tab Navigation */}
                <div className="rounded-2xl bg-secondary/30 p-1.5 mb-8 flex gap-1">
                  <button className="flex-1 px-5 py-3 rounded-xl hover:bg-(--nav-hover) bg-(--nav-active) text-sm font-semibold text-(--nav-icon-active) transition-all">
                    Friends
                  </button>
                  <button className="flex-1 px-5 py-3 rounded-xl text-sm font-semibold text-(--nav-icon) hover:text-(--nav-icon-hover) hover:bg-(--nav-hover) transition-all">
                    Activity
                  </button>
                </div>

                {/* Mock Content - Lightly Blurred */}
                <div className="space-y-6 blur-[2px] pointer-events-none select-none">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-4">
                      Online (2)
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-500 to-pink-500"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground">
                            aabyfidget
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Live Laugh Love
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-cyan-500"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground">
                            lofithoughts
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Live Laugh Love
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-4">
                      Offline (2)
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-linear-to-br from-yellow-500 to-orange-500"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground">
                            Sensei_Me
                          </p>
                          <p className="text-xs text-muted-foreground/70">
                            Last online 5 mins ago
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-linear-to-br from-gray-500 to-gray-700"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground">
                            Deathwisher
                          </p>
                          <p className="text-xs text-muted-foreground/70">
                            Last online 2 hrs ago
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coming Soon Overlay - Simplified */}
                <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[2px] bg-background/20">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center"
                  >
                    <h4 className="text-3xl font-bold text-foreground mb-2 drop-shadow-lg">
                      Coming Soon
                    </h4>
                    <p className="text-lg font-medium text-foreground/90 drop-shadow-md">
                      Friends & Activity
                    </p>
                  </motion.div>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Carousel Sections */}
      <div className="space-y-8 lg:space-y-12">
        <CarouselSection
          title="Popular"
          description="The most played games right now"
          games={popularGames?.results?.slice(5) || []}
          isLoading={loadingPopular}
        />

        <CarouselSection
          title="Trending"
          description="Games gaining attention from the community"
          games={trendingGames?.results || []}
          isLoading={loadingTrending}
        />

        <CarouselSection
          title="New Releases"
          description="Recently launched titles worth exploring"
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
  description,
  games,
  isLoading,
}: {
  title: string;
  description?: string;
  games: RAWGGame[];
  isLoading: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6 px-6 lg:px-10">
        <div>
          <h2 className="text-xl lg:text-2xl font-semibold text-foreground">
            {title}
          </h2>
          {description && (
            <p className="text-sm text-muted-foreground mt-1.5">
              {description}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="p-2.5 rounded-full bg-secondary/50 hover:bg-secondary transition-colors border border-border"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-2.5 rounded-full bg-secondary/50 hover:bg-secondary transition-colors border border-border"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto hide-scrollbar pb-10 pt-4 pl-6 lg:pl-10"
        style={{ overflowY: "visible" }}
      >
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="shrink-0 w-[180px] sm:w-[200px] lg:w-[260px] xl:w-[280px] 2xl:w-[300px] rounded-2xl overflow-hidden"
                style={{
                  border: "1px solid var(--nav-border-color)",
                  boxShadow:
                    "0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
                }}
              >
                <Skeleton className="aspect-2/3 rounded-none" />
              </div>
            ))
          : games.map((game, index) => <CarouselCard key={game.id} game={game} index={index} />)}
      </div>
    </section>
  );
}

function CarouselCard({
  game,
  index = 0,
}: {
  game: RAWGGame & {
    platforms?: { platform: { id: number; name: string; slug: string } }[];
  };
  index?: number;
}) {
  const shouldReduce = useReducedMotion();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
  };

  return (
    <Link
      href={`/games/${game.slug}`}
      className="shrink-0 w-[180px] sm:w-[200px] lg:w-[260px] xl:w-[280px] 2xl:w-[300px] group"
      onClick={handleClick}
    >
      <motion.div
        className="relative rounded-2xl overflow-hidden"
        style={{
          border: "1px solid var(--nav-border-color)",
          boxShadow:
            "0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
        initial={false}
        whileHover={
          shouldReduce
            ? undefined
            : {
                y: -4,
                boxShadow:
                  "0 6px 20px rgba(0,0,0,0.25), 0 3px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.12)",
                transition: { type: "spring", stiffness: 400, damping: 20 },
              }
        }
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

        <div className="relative aspect-2/3 overflow-hidden">
          {game.background_image ? (
            <Image
              src={game.background_image}
              alt={game.name}
              fill
              priority={index < 3}
              loading={index < 3 ? undefined : "lazy"}
              className="object-cover"
              sizes="(max-width: 640px) 180px, (max-width: 1024px) 200px, 280px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white/5">
              <span className="text-3xl opacity-20">🎮</span>
            </div>
          )}

          {/* Rating badge - always visible on mobile and desktop */}
          {game.metacritic && (
            <div className="absolute top-2.5 right-2.5 z-20">
              <div
                className="px-2 py-0.5 rounded-lg text-[11px] font-bold text-white shadow-lg"
                style={{
                  background:
                    game.metacritic >= 75
                      ? "rgba(34, 197, 94, 0.95)"
                      : game.metacritic >= 50
                        ? "rgba(234, 179, 8, 0.95)"
                        : "rgba(239, 68, 68, 0.95)",
                  backdropFilter: "blur(8px)",
                }}
              >
                {game.metacritic}
              </div>
            </div>
          )}

          {/* Desktop hover card with details */}
          <div className="hidden lg:block absolute bottom-2.5 left-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <div
              className="p-3 rounded-xl"
              style={{
                background: "rgba(0, 0, 0, 0.85)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
              }}
            >
              <h3 className="font-bold text-white text-sm leading-snug mb-2 line-clamp-2">
                {game.name}
              </h3>

              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {game.rating && game.rating > 0 && (
                  <div className="flex items-center gap-1 text-xs text-white/90">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">
                      {formatRating(game.rating)}
                    </span>
                  </div>
                )}
                {game.released && (
                  <span className="text-xs text-white/60">
                    {new Date(game.released).getFullYear()}
                  </span>
                )}
              </div>

              {game.genres && game.genres.length > 0 && (
                <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                  {game.genres.slice(0, 2).map((genre) => (
                    <span
                      key={genre.id}
                      className="px-2 py-0.5 text-[10px] font-medium text-white/70 rounded-full border border-white/20 bg-white/10"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {getUniquePlatforms(game.platforms).length > 0 && (
                <div className="flex items-center gap-1.5">
                  {getUniquePlatforms(game.platforms).map((platformSlug, i) => (
                    <div key={i} className="text-white/60">
                      <PlatformIcon platformSlug={platformSlug} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile title below card */}
      <div className="lg:hidden mt-2 px-1">
        <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-2">
          {game.name}
        </h3>
        {game.rating && game.rating > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
            <span>{formatRating(game.rating)}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
