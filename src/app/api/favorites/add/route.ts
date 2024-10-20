import { NextRequest, NextResponse } from 'next/server';
import { getSession } from 'next-auth/react';
import { addFavorite } from '../../../../services/favoritesService';

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

    await addFavorite(session.user.email, domain);

    return NextResponse.json({ message: 'Domain added to favorites' });
  } catch (error) {
    console.error('Error adding domain to favorites:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
