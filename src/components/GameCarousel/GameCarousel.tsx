"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
import { Skeleton } from "@/components/ui/skeleton";
import { GAME_COVER_PLACEHOLDER } from "@/lib/image-placeholder";
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

interface GameCarouselProps {
  title: string;
  description?: string;
  games: RAWGGame[];
  isLoading: boolean;
}

export default function GameCarousel({
  title,
  description,
  games,
  isLoading,
}: GameCarouselProps) {
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
              loading="lazy"
              placeholder="blur"
              blurDataURL={GAME_COVER_PLACEHOLDER}
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
