import { NextRequest, NextResponse } from 'next/server';
import { getGameBySlug, getGameScreenshots } from '@/lib/igdb';
import { adaptIGDBGameDetails } from '@/lib/igdb-adapter';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
  const includeScreenshots = request.nextUrl.searchParams.get('screenshots') === 'true';

  try {
    const game = await getGameBySlug(slug);
    const adaptedGame = adaptIGDBGameDetails(game);

    if (includeScreenshots) {
      const screenshots = await getGameScreenshots(slug);
      return NextResponse.json({ ...adaptedGame, screenshots: screenshots.results });
    }

    return NextResponse.json(adaptedGame);
  } catch (error) {
    console.error('Error fetching game:', error);
    return NextResponse.json(
      { error: 'Failed to fetch game' },
      { status: 500 }
    );
  }
}
