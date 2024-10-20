import { NextRequest, NextResponse } from 'next/server';
import { generateDomains } from '../../../../services/domainGenerator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prefixLength, suffixLength, includeNumbers, includeHyphens, page = 1, pageSize = 10, filterMeaningful } = body;

    // Validate input
    if (typeof prefixLength !== 'number' || prefixLength < 1 || prefixLength > 10 ||
        typeof suffixLength !== 'number' || suffixLength < 1 || suffixLength > 10 ||
        typeof includeNumbers !== 'boolean' || 
        typeof includeHyphens !== 'boolean' ||
        typeof page !== 'number' || page < 1 ||
        typeof pageSize !== 'number' || pageSize < 1 || pageSize > 100 ||
        typeof filterMeaningful !== 'boolean') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    let domains = await generateDomains(prefixLength, suffixLength, includeNumbers, includeHyphens, page, pageSize);

    if (filterMeaningful) {
      domains = domains.filter(domain => domain.isMeaningful);
    }

    return NextResponse.json({ 
      domains,
      page,
      pageSize,
      totalCombinations: Math.pow((26 + (includeNumbers ? 10 : 0) + (includeHyphens ? 1 : 0)), (prefixLength + suffixLength))
    });
  } catch (error) {
    console.error('Error generating domains:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
