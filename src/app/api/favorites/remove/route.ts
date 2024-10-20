import { NextRequest, NextResponse } from 'next/server';
import { getSession } from 'next-auth/react';
import { removeFavorite } from '../../../../services/favoritesService';

export async function POST(req: NextRequest) {
  const session = await getSession({ req });

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { domain } = await req.json();

    if (!domain || typeof domain !== 'string') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    await removeFavorite(session.user.email, domain);

    return NextResponse.json({ message: 'Domain removed from favorites' });
  } catch (error) {
    console.error('Error removing domain from favorites:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
