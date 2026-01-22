import TopNav from '@/components/TopNav';
import BottomNav from '@/components/BottomNav';
import { SearchProvider } from '@/contexts/SearchContext';

function Footer() {
  return (
    <footer className="hidden lg:block py-6 px-6 text-center border-t border-white/5">
      <p className="text-xs text-white/30">
        Game data provided by{' '}
        <a
          href="https://rawg.io"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/50 hover:text-white/70 transition-colors"
        >
          RAWG.io
        </a>
      </p>
    </footer>
  );
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SearchProvider>
      <div className="min-h-screen flex flex-col">
        <TopNav />
        <main className="flex-1 pb-28 pt-4 lg:pb-0 lg:pt-28">
          {children}
        </main>
        <Footer />
        <BottomNav />
      </div>
    </SearchProvider>
  );
}
