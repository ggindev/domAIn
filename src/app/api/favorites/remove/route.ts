import { NextRequest, NextResponse } from 'next/server';

const ERROR_INVALID_INPUT = 'Invalid input';
const ERROR_INTERNAL_SERVER = 'Internal server error';

export async function POST(req: NextRequest) {
  try {
    const { domain } = await req.json();

    if (!domain || typeof domain !== 'string') {
      return NextResponse.json({ error: ERROR_INVALID_INPUT }, { status: 400 });
    }

    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const updatedFavorites = favorites.filter((fav: string) => fav !== domain);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));

    return NextResponse.json({ message: 'Domain removed from favorites' });
  } catch (error) {
    console.error('Error removing domain from favorites:', error);
    return NextResponse.json({ error: ERROR_INTERNAL_SERVER }, { status: 500 });
  }
}
