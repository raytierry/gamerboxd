import LeftNav from '@/components/LeftNav';
import BottomNav from '@/components/BottomNav';
import { SearchProvider } from '@/contexts/SearchContext';

function Footer() {
  return (
    <footer className="hidden lg:block py-6 px-6 text-center border-t border-border">
      <p className="text-xs text-muted-foreground">
        Game data provided by{' '}
        <a
          href="https://www.igdb.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          IGDB
        </a>
      </p>
    </footer>
  );
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SearchProvider>
      <div className="min-h-screen flex flex-col">
        <LeftNav />
        <div className="flex-1 lg:pl-24">
          <main className="pb-28 lg:pb-0">
            {children}
          </main>
        </div>
        <Footer />
        <BottomNav />
      </div>
    </SearchProvider>
  );
}
