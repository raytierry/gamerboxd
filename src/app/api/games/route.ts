import { NextRequest, NextResponse } from 'next/server';
import { searchGames } from '@/lib/rawg';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query') || undefined;
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 20;
  const ordering = searchParams.get('ordering') || undefined;
  const dates = searchParams.get('dates') || undefined;
  const metacritic = searchParams.get('metacritic') || undefined;

  try {
    const data = await searchGames({
      query,
      page,
      pageSize,
      ordering,
      dates,
      metacritic,
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    );
  }
}
