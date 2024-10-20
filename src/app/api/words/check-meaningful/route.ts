import { NextRequest, NextResponse } from 'next/server';
import { wordChecker } from '../../../../utils/wordChecker';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { words } = body;

    if (!Array.isArray(words)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const results = words.reduce((acc, word) => {
      acc[word] = wordChecker.isMeaningfulWord(word);
      return acc;
    }, {} as Record<string, boolean>);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error checking meaningful words:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
