import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

async function checkDomainAvailability(domain: string, providerUrl: string): Promise<boolean> {
  const response = await fetch(`${providerUrl}${domain}`);
  if (!response.ok) {
    throw new Error('Failed to fetch domain availability');
  }
  const data = await response.json();
  
  if (providerUrl.includes('godaddy')) {
    return data.available;
  } else if (providerUrl.includes('whoisxmlapi')) {
    return data.WhoisRecord.domainAvailability === 'AVAILABLE';
  } else {
    throw new Error('Unsupported provider');
  }
}

export async function POST(request: Request) {
  const { domains, provider } = await request.json();

  if (!Array.isArray(domains) || domains.length === 0 || typeof provider !== 'string') {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const results: Record<string, boolean> = {};

  for (const domain of domains) {
    try {
      const isAvailable = await checkDomainAvailability(domain, provider);
      results[domain] = isAvailable;
    } catch (error) {
      results[domain] = false;
    }
  }

  return NextResponse.json(results);
}
