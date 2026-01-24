import { NextRequest, NextResponse } from 'next/server';
import { searchGames } from '@/lib/igdb';
import { adaptIGDBGame } from '@/lib/igdb-adapter';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query') || undefined;
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 20;
  const ordering = searchParams.get('ordering') || undefined;
  const dates = searchParams.get('dates') || undefined;
  const minRating = searchParams.get('minRating') ? Number(searchParams.get('minRating')) : undefined;

  try {
    const data = await searchGames({
      query,
      page,
      pageSize,
      ordering,
      dates,
      minRating,
    });

    // Adapta os resultados para o formato legado
    const adaptedData = {
      ...data,
      results: data.results.map(game => adaptIGDBGame(game)),
    };

    return NextResponse.json(adaptedData);
  } catch (error) {
    console.error('Error fetching games:', error);
    console.error('Request params:', { query, page, pageSize, ordering, dates, minRating });

    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch games';

    return NextResponse.json(
      {
        error: 'Failed to fetch games',
        details: errorMessage,
        params: { query, page, pageSize }
      },
      { status: 500 }
    );
  }
}
