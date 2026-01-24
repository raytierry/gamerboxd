"use client";

import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "motion/react";
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

// Dynamic import for below-the-fold carousel component
const GameCarousel = dynamic(() => import("@/components/GameCarousel"), {
  loading: () => <CarouselSkeleton />,
  ssr: true,
});

function CarouselSkeleton() {
  return (
    <section>
      <div className="flex items-center justify-between mb-6 px-6 lg:px-10">
        <div>
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-48 mt-1.5" />
        </div>
      </div>
      <div className="flex gap-4 overflow-hidden pb-10 pt-4 pl-6 lg:pl-10">
        {Array.from({ length: 6 }).map((_, i) => (
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
        ))}
      </div>
    </section>
  );
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
        <GameCarousel
          title="Popular"
          description="The most played games right now"
          games={popularGames?.results?.slice(5) || []}
          isLoading={loadingPopular}
        />

        <GameCarousel
          title="Trending"
          description="Games gaining attention from the community"
          games={trendingGames?.results || []}
          isLoading={loadingTrending}
        />

        <GameCarousel
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

