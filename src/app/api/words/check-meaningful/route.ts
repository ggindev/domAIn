import { NextRequest, NextResponse } from 'next/server';
import { wordChecker } from '../../../../utils/wordChecker';

const ERROR_INVALID_INPUT = 'Invalid input';
const ERROR_INTERNAL_SERVER = 'Internal server error';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { words } = body;

    if (!Array.isArray(words)) {
      return NextResponse.json({ error: ERROR_INVALID_INPUT }, { status: 400 });
    }

    const results = words.reduce((acc, word) => {
      acc[word] = wordChecker.isMeaningfulWord(word);
      return acc;
    }, {} as Record<string, boolean>);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error checking meaningful words:', error);
    return NextResponse.json({ error: ERROR_INTERNAL_SERVER }, { status: 500 });
  }
}
