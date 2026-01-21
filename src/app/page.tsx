import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Welcome to{' '}
            <span className="text-indigo-600">Gamerboxd</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Your personal gaming diary. Track games you&apos;ve played, manage your backlog, 
            and share your top favorites with the world.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Button size="lg">
              Get Started
            </Button>
            <Button variant="outline" size="lg">
              Explore Games
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mt-20 grid gap-6 md:grid-cols-3">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🎮</span>
                Track Your Games
              </CardTitle>
              <CardDescription>
                Keep track of what you&apos;re playing, what you&apos;ve completed, and what&apos;s next in your backlog.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                Top Favorites
              </CardTitle>
              <CardDescription>
                Create your personal top 10 list and show the world your all-time favorite games.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">📊</span>
                Gaming Stats
              </CardTitle>
              <CardDescription>
                See statistics about your gaming habits and discover patterns in your playstyle.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </main>
  );
}
