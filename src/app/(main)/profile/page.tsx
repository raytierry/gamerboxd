"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import {
  LogOut,
  Gamepad2,
  Heart,
  BarChart3,
  Trophy,
  Settings,
  Bell,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useUserBacklog } from "@/hooks/use-backlog";
import { useUserFavorites } from "@/hooks/use-favorites";
import PageWrapper from "@/components/PageWrapper";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const shouldReduce = useReducedMotion();
  const { data: backlog = [], isLoading: backlogLoading } = useUserBacklog();
  const { data: favorites = [], isLoading: favoritesLoading } =
    useUserFavorites();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <PageWrapper className="px-6 lg:px-10 pt-6 lg:pt-28 pb-28 lg:pb-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center mb-12">
            <Skeleton className="w-32 h-32 rounded-full" />
            <Skeleton className="h-8 w-40 mt-6" />
            <Skeleton className="h-5 w-56 mt-3" />
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (!session?.user) {
    return null;
  }

  const stats = {
    backlog: backlog.length,
    favorites: favorites.length,
  };

  return (
    <PageWrapper className="px-6 lg:px-10 pt-6 lg:pt-28 pb-28 lg:pb-10">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header with Glass Effect */}
        <motion.div
          initial={shouldReduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-8 lg:mb-12"
        >
          {/* Glass Background Card */}
          <div
            className="rounded-3xl nav-glass p-8 lg:p-12"
            style={{
              border: "1px solid var(--nav-border-color)",
              boxShadow: "var(--nav-shadow)",
            }}
          >
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8">
              {/* Avatar with Glow */}
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-full bg-linear-to-br from-purple-500/30 to-pink-500/30 blur-2xl"
                  style={{ transform: "scale(1.2)" }}
                />
                <div
                  className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-2"
                  style={{
                    borderColor: "var(--nav-border-color)",
                    boxShadow:
                      "0 8px 32px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.1)",
                  }}
                >
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "Avatar"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl lg:text-6xl font-bold text-foreground bg-linear-to-br from-secondary to-secondary/50">
                      {session.user.name?.[0]?.toUpperCase() || "?"}
                    </div>
                  )}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                  {session.user.name || "Gamer"}
                </h1>
                <p className="text-muted-foreground text-base lg:text-lg mb-6">
                  {session.user.email}
                </p>

                {/* Quick Stats */}
                <div className="flex items-center justify-center lg:justify-start gap-6">
                  <div>
                    <p className="text-2xl lg:text-3xl font-bold text-foreground">
                      {backlogLoading ? "-" : stats.backlog}
                    </p>
                    <p className="text-sm text-muted-foreground">Games</p>
                  </div>
                  <div className="w-px h-12 bg-border" />
                  <div>
                    <p className="text-2xl lg:text-3xl font-bold text-foreground">
                      {favoritesLoading ? "-" : stats.favorites}
                    </p>
                    <p className="text-sm text-muted-foreground">Favorites</p>
                  </div>
                  <div className="w-px h-12 bg-border" />
                  <div>
                    <p className="text-2xl lg:text-3xl font-bold text-foreground">
                      0
                    </p>
                    <p className="text-sm text-muted-foreground">Reviews</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions - Desktop */}
              <div className="hidden lg:flex items-start gap-2">
                <QuickActionButton icon={Bell} label="Notifications" disabled />
                <QuickActionButton icon={Settings} label="Settings" disabled />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
          {/* My Collection Section */}
          <motion.section
            initial={shouldReduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-xl font-bold text-foreground mb-4 px-1">
              My Collection
            </h2>
            <div className="space-y-3">
              <LinkCard
                href="/profile/backlog"
                icon={Gamepad2}
                label="Backlog"
                subtitle={
                  backlogLoading ? "Loading..." : `${stats.backlog} games`
                }
                gradient="from-blue-500/20 to-cyan-500/20"
              />
              <LinkCard
                href="/profile/favorites"
                icon={Heart}
                label="Favorites"
                subtitle={
                  favoritesLoading ? "Loading..." : `${stats.favorites} games`
                }
                gradient="from-pink-500/20 to-rose-500/20"
              />
            </div>
          </motion.section>

          {/* Stats & Progress Section */}
          <motion.section
            initial={shouldReduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-xl font-bold text-foreground mb-4 px-1">
              Activity
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                icon={Gamepad2}
                label="Backlog"
                value={backlogLoading ? "-" : stats.backlog}
                loading={backlogLoading}
              />
              <StatCard
                icon={Trophy}
                label="Achievements"
                value="0"
                loading={false}
              />
            </div>
          </motion.section>
        </div>

        {/* Coming Soon Features */}
        <motion.section
          initial={shouldReduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-foreground mb-4 px-1">
            Coming Soon
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ComingSoonCard icon={BarChart3} label="Detailed Statistics" />
            <ComingSoonCard icon={Trophy} label="Achievement System" />
            <ComingSoonCard icon={Sparkles} label="Social Features" />
          </div>
        </motion.section>

        {/* Sign Out Button */}
        <motion.div
          initial={shouldReduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-4"
        >
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="group relative overflow-hidden rounded-2xl px-8 py-4 font-medium text-muted-foreground transition-all hover:text-foreground"
            style={{
              border: "1px solid var(--nav-border-color)",
              background:
                "linear-gradient(180deg, var(--glass-button-from) 0%, var(--glass-button-to) 100%)",
              backdropFilter: "blur(12px)",
              cursor: "pointer",
            }}
          >
            <div className="flex items-center gap-2">
              <LogOut className="w-5 h-5" />
              <span>Sign out</span>
            </div>
          </button>

          <p className="text-center text-muted-foreground/50 text-xs">
            Gamerboxd v0.1.0
          </p>
        </motion.div>

        {/* Quick Actions - Mobile */}
        <div className="lg:hidden fixed bottom-20 right-6 flex flex-col gap-2">
          <QuickActionButton icon={Bell} label="Notifications" disabled />
          <QuickActionButton icon={Settings} label="Settings" disabled />
        </div>
      </div>
    </PageWrapper>
  );
}

function QuickActionButton({
  icon: Icon,
  label,
  disabled,
}: {
  icon: typeof Bell;
  label: string;
  disabled?: boolean;
}) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.button
      disabled={disabled}
      whileHover={shouldReduce ? undefined : { scale: 1.05 }}
      whileTap={shouldReduce ? undefined : { scale: 0.95 }}
      className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        border: "1px solid var(--nav-border-color)",
        background:
          "linear-gradient(180deg, var(--glass-button-from) 0%, var(--glass-button-to) 100%)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      }}
      title={disabled ? "Coming soon" : label}
    >
      <Icon className="w-5 h-5 text-muted-foreground" />
    </motion.button>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  loading,
}: {
  icon: typeof Gamepad2;
  label: string;
  value: string | number;
  loading: boolean;
}) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      whileHover={shouldReduce ? undefined : { y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="rounded-2xl p-8 text-center"
      style={{
        border: "1px solid var(--nav-border-color)",
        background:
          "linear-gradient(180deg, var(--glass-card-from) 0%, var(--glass-card-to) 100%)",
        backdropFilter: "blur(16px)",
        boxShadow:
          "0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
      }}
    >
      <div className="mb-4 flex justify-center">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid var(--nav-border-color)",
          }}
        >
          <Icon className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
      {loading ? (
        <Skeleton className="h-8 w-16 mx-auto mb-2" />
      ) : (
        <p className="text-3xl font-bold text-foreground mb-2">{value}</p>
      )}
      <p className="text-sm text-muted-foreground">{label}</p>
    </motion.div>
  );
}

function LinkCard({
  href,
  icon: Icon,
  label,
  subtitle,
  gradient,
}: {
  href: string;
  icon: typeof Gamepad2;
  label: string;
  subtitle: string;
  gradient: string;
}) {
  const shouldReduce = useReducedMotion();

  return (
    <Link href={href} className="block group">
      <motion.div
        whileHover={shouldReduce ? undefined : { y: -2 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="relative rounded-2xl p-5 overflow-hidden"
        style={{
          border: "1px solid var(--nav-border-color)",
          background:
            "linear-gradient(180deg, var(--glass-card-from) 0%, var(--glass-card-to) 100%)",
          backdropFilter: "blur(16px)",
          boxShadow:
            "0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        {/* Gradient Accent */}
        <div
          className={`absolute inset-0 bg-linear-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        />

        <div className="relative flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid var(--nav-border-color)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <Icon className="w-6 h-6 text-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground text-lg mb-0.5">
              {label}
            </p>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all shrink-0" />
        </div>
      </motion.div>
    </Link>
  );
}

function ComingSoonCard({
  icon: Icon,
  label,
}: {
  icon: typeof BarChart3;
  label: string;
}) {
  return (
    <div
      className="rounded-2xl p-6 text-center relative overflow-hidden"
      style={{
        border: "1px dashed var(--nav-border-color)",
        background: "rgba(255, 255, 255, 0.02)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="relative z-10 opacity-50">
        <div className="mb-3 flex justify-center">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid var(--nav-border-color)",
            }}
          >
            <Icon className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
        <p className="text-sm font-medium text-foreground mb-1">{label}</p>
        <p className="text-xs text-muted-foreground/60">Coming soon</p>
      </div>
    </div>
  );
}
