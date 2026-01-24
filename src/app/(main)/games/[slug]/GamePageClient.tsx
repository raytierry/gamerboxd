"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  Star,
  Clock,
  Calendar,
  Monitor,
  Gamepad,
} from "lucide-react";
import { FaPlaystation, FaXbox } from "react-icons/fa";
import { SiNintendoswitch } from "react-icons/si";
import BacklogButton from "@/components/BacklogButton";
import { FavoriteButton } from "@/components/FavoriteButton";
import PageWrapper from "@/components/PageWrapper";
import { formatRating } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { AdaptedGameDetails } from "@/types/game.types";

interface Screenshot {
  id: string | number;
  image: string;
}

interface GameMedia {
  artworks?: Screenshot[];
  results?: Screenshot[];
}

interface GamePageClientProps {
  game: AdaptedGameDetails;
  media: GameMedia | null;
  isAuthenticated: boolean;
}

function getRatingClass(rating: number): string {
  if (rating >= 75) return "rating-green";
  if (rating >= 50) return "rating-yellow";
  return "rating-red";
}

const PlatformIcon = ({ platformSlug }: { platformSlug: string }) => {
  if (platformSlug.includes("pc")) {
    return <Monitor className="w-4 h-4" />;
  }
  if (platformSlug.includes("playstation")) {
    return <FaPlaystation className="w-4 h-4" />;
  }
  if (platformSlug.includes("xbox")) {
    return <FaXbox className="w-4 h-4" />;
  }
  if (platformSlug.includes("nintendo")) {
    return <SiNintendoswitch className="w-4 h-4" />;
  }
  return <Gamepad className="w-4 h-4" />;
};

export default function GamePageClient({ game, media, isAuthenticated }: GamePageClientProps) {
  const shouldReduce = useReducedMotion();

  const releaseYear = game.released
    ? new Date(game.released).getFullYear()
    : null;

  const heroImage =
    media?.artworks?.[0]?.image ||
    media?.results?.[0]?.image ||
    game.background_image;

  return (
    <PageWrapper className="min-h-screen pb-28 lg:pb-10">
      <div className="px-6 lg:px-10 pt-6 pb-4">
        <motion.div
          initial={shouldReduce ? false : { opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium nav-glass nav-border nav-shadow transition-all group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back</span>
          </Link>
        </motion.div>
      </div>

      <div className="px-6 lg:px-10 pt-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={shouldReduce ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="relative rounded-3xl overflow-hidden aspect-video nav-border hero-shadow"
              >
                {heroImage ? (
                  <Image
                    src={heroImage}
                    alt={game.name}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-secondary/30">
                    <span className="text-6xl opacity-20">🎮</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                {game.metacritic && (
                  <div className="absolute top-4 right-4 z-10">
                    <div
                      className={cn(
                        "px-3 py-1.5 rounded-xl text-sm font-bold text-white shadow-xl backdrop-blur-sm",
                        getRatingClass(game.metacritic)
                      )}
                    >
                      {game.metacritic}
                    </div>
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={shouldReduce ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="space-y-4"
              >
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                  {game.name}
                </h1>

                <div className="pt-2">
                  <div className="flex flex-wrap gap-3">
                    <div className="flex-1 md:flex-none md:min-w-[180px]">
                      <BacklogButton
                        game={{
                          id: game.id,
                          slug: game.slug,
                          name: game.name,
                          background_image: game.background_image,
                        }}
                        isAuthenticated={isAuthenticated}
                      />
                    </div>
                    {isAuthenticated && (
                      <div className="flex-1 md:flex-none md:min-w-[160px]">
                        <FavoriteButton
                          gameId={game.id}
                          gameSlug={game.slug}
                          gameName={game.name}
                          gameImage={game.background_image}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {game.description_raw && (
                <motion.div
                  initial={shouldReduce ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="rounded-3xl nav-glass nav-border nav-shadow p-6 lg:p-8"
                >
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    About
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {game.description_raw}
                  </p>
                </motion.div>
              )}

              {media?.results && media.results.length > 0 && (
                <motion.div
                  initial={shouldReduce ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="space-y-4"
                >
                  <h2 className="text-xl font-bold text-foreground">
                    Screenshots
                  </h2>
                  <div className="grid grid-cols-2 gap-3 lg:gap-4">
                    {media.results.slice(0, 4).map((screenshot, index) => (
                      <motion.div
                        key={screenshot.id}
                        initial={
                          shouldReduce ? false : { opacity: 0, scale: 0.95 }
                        }
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                        className="relative aspect-video rounded-2xl overflow-hidden group cursor-pointer nav-border card-shadow"
                      >
                        <Image
                          src={screenshot.image}
                          alt={`Screenshot ${index + 1}`}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 1024px) 50vw, 33vw"
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            <motion.div
              initial={shouldReduce ? false : { opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="lg:sticky lg:top-6 lg:self-start"
            >
              <div className="rounded-3xl nav-glass nav-border nav-shadow p-6 lg:p-8 space-y-6">
                <h3 className="text-lg font-bold text-foreground">
                  Game Details
                </h3>

                <div className="space-y-5">
                  {game.genres?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2.5">
                        Genres
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {game.genres.slice(0, 4).map((genre) => (
                          <span
                            key={genre.id}
                            className="px-3 py-1 rounded-full text-xs font-medium bg-secondary/50 border border-border"
                          >
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2.5">
                      Quick Info
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      {game.rating && game.rating > 0 && (
                        <div className="flex items-center gap-1.5 text-foreground">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-medium">
                            {formatRating(game.rating)}
                          </span>
                        </div>
                      )}
                      {releaseYear && (
                        <div className="flex items-center gap-1.5 text-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{releaseYear}</span>
                        </div>
                      )}
                      {game.playtime && game.playtime > 0 && (
                        <div className="flex items-center gap-1.5 text-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{game.playtime}h</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {game.platforms?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2.5">
                        Platforms
                      </h4>
                      <div className="flex flex-wrap items-center gap-2">
                        {game.platforms.slice(0, 6).map((p) => (
                          <div
                            key={p.platform.id}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border"
                          >
                            <PlatformIcon platformSlug={p.platform.slug} />
                            <span className="text-xs font-medium text-foreground">
                              {p.platform.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {game.released && (
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2.5">
                        Release Date
                      </h4>
                      <p className="text-sm font-medium text-foreground">
                        {new Date(game.released).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  )}

                  {game.developers?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2.5">
                        Developer
                      </h4>
                      <p className="text-sm font-medium text-foreground">
                        {game.developers.map((d) => d.name).join(", ")}
                      </p>
                    </div>
                  )}

                  {game.publishers?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2.5">
                        Publisher
                      </h4>
                      <p className="text-sm font-medium text-foreground">
                        {game.publishers.map((p) => p.name).join(", ")}
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground/60">
                    Game data provided by{" "}
                    <a
                      href="https://www.igdb.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors underline"
                    >
                      IGDB
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
