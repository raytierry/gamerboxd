import Link from 'next/link';
import { Gamepad2, Github, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0a0a0c]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Gamepad2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                gamer<span className="text-indigo-400">boxd</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Your personal gaming diary. Track games, manage your backlog, and share your favorites.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/games" className="text-gray-500 hover:text-white text-sm transition-colors">
                  Explore Games
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-500 hover:text-white text-sm transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-gray-500 hover:text-white text-sm transition-colors">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Credits</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://rawg.io/apidocs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-white text-sm transition-colors inline-flex items-center gap-1"
                >
                  RAWG API
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/tierry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-white text-sm transition-colors inline-flex items-center gap-1"
                >
                  <Github className="w-3 h-3" />
                  Built by Tierry
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} Gamerboxd. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs">
            Game data provided by{' '}
            <a
              href="https://rawg.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300"
            >
              RAWG
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
