import { NextRequest, NextResponse } from 'next/server';
import { getGameBySlug, getGameScreenshots } from '@/lib/rawg';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
  const includeScreenshots = request.nextUrl.searchParams.get('screenshots') === 'true';

  try {
    const game = await getGameBySlug(slug);

    if (includeScreenshots) {
      const screenshots = await getGameScreenshots(slug);
      return NextResponse.json({ ...game, screenshots: screenshots.results });
    }

    return NextResponse.json(game);
  } catch (error) {
    console.error('Error fetching game:', error);
    return NextResponse.json(
      { error: 'Failed to fetch game' },
      { status: 500 }
    );
  }
}
