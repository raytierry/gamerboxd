import Link from 'next/link';
import { Gamepad2, Github, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/5">
      <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 py-12 relative">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/10">
                <Gamepad2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                gamer<span className="text-indigo-400">boxd</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
              Your personal gaming diary. Track what you play, 
              remember what you loved, share your favorites.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-medium mb-4">Navigate</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/games" className="text-gray-500 hover:text-white text-sm transition-colors">
                  Explore Games
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-gray-500 hover:text-white text-sm transition-colors">
                  Get Started
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-500 hover:text-white text-sm transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Credits */}
          <div>
            <h4 className="text-white font-medium mb-4">Credits</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://rawg.io/apidocs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-white text-sm transition-colors"
                >
                  RAWG API
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-white text-sm transition-colors flex items-center gap-1.5"
                >
                  <Github className="w-3.5 h-3.5" />
                  Source Code
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">
            © {currentYear} gamerboxd. All rights reserved.
          </p>
          <p className="text-gray-600 text-sm flex items-center gap-1.5">
            Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> by{' '}
            <span className="text-gray-400 font-medium">Tierry Ray</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
