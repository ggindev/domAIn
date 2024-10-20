import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { domain } = await req.json();

    if (!domain || typeof domain !== 'string') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const updatedFavorites = favorites.filter((fav: string) => fav !== domain);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));

    return NextResponse.json({ message: 'Domain removed from favorites' });
  } catch (error) {
    console.error('Error removing domain from favorites:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
