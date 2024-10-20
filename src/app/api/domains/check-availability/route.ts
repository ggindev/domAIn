import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

const ERROR_FAILED_FETCH = 'Failed to fetch domain availability';
const ERROR_UNSUPPORTED_PROVIDER = 'Unsupported provider';
const ERROR_INVALID_INPUT = 'Invalid input';

async function checkDomainAvailability(domain: string, providerUrl: string): Promise<boolean> {
  const response = await fetch(`${providerUrl}${domain}`);
  if (!response.ok) {
    throw new Error(ERROR_FAILED_FETCH);
  }
  const data = await response.json();
  
  if (providerUrl.includes('godaddy')) {
    return data.available;
  } else if (providerUrl.includes('whoisxmlapi')) {
    return data.WhoisRecord.domainAvailability === 'AVAILABLE';
  } else {
    throw new Error(ERROR_UNSUPPORTED_PROVIDER);
  }
}

export async function POST(request: Request) {
  const { domains, provider } = await request.json();

  if (!Array.isArray(domains) || domains.length === 0 || typeof provider !== 'string') {
    return NextResponse.json({ error: ERROR_INVALID_INPUT }, { status: 400 });
  }

  const results: Record<string, boolean> = {};

  for (const domain of domains) {
    try {
      const isAvailable = await checkDomainAvailability(domain, provider);
      results[domain] = isAvailable;
    } catch {
      results[domain] = false;
    }
  }

  return NextResponse.json(results);
}
