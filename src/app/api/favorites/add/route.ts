import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { domain } = await req.json();

    if (!domain || typeof domain !== 'string') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (!favorites.includes(domain)) {
      favorites.push(domain);
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    return NextResponse.json({ message: 'Domain added to favorites' });
  } catch (error) {
    console.error('Error adding domain to favorites:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
