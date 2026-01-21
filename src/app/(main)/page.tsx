import Link from 'next/link';
import { ArrowRight, Gamepad2, Trophy, BarChart3 } from 'lucide-react';

export default function HomePage() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 py-24 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 mb-8">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-400">Now tracking 500,000+ games</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
              Your gaming journey,{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                beautifully tracked
              </span>
            </h1>
            
            <p className="mt-6 text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
              Track what you play. Remember what you loved. Share your favorites with the world.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="group px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all duration-200 flex items-center gap-2"
              >
                Start tracking
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/games"
                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl border border-white/10 transition-colors"
              >
                Explore games
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="group p-8 bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Gamepad2 className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Track Your Backlog</h3>
              <p className="text-gray-500 leading-relaxed">
                Keep track of what you're playing, what you've completed, and what's waiting in your backlog.
              </p>
            </div>

            <div className="group p-8 bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Trophy className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Rank Your Favorites</h3>
              <p className="text-gray-500 leading-relaxed">
                Create your personal top 10 list and show the world your all-time favorite games.
              </p>
            </div>

            <div className="group p-8 bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Gaming Stats</h3>
              <p className="text-gray-500 leading-relaxed">
                See statistics about your gaming habits and discover patterns in your playstyle.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
