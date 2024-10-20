import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

async function checkDomainAvailability(domain: string): Promise<boolean> {
  const response = await fetch(`https://api.example.com/check?domain=${domain}`);
  if (!response.ok) {
    throw new Error('Failed to fetch domain availability');
  }
  const data = await response.json();
  return data.available;
}

export async function POST(request: Request) {
  const { domains } = await request.json();

  if (!Array.isArray(domains) || domains.length === 0) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const results: Record<string, boolean> = {};

  for (const domain of domains) {
    try {
      const isAvailable = await checkDomainAvailability(domain);
      results[domain] = isAvailable;
    } catch (error) {
      results[domain] = false;
    }
  }

  return NextResponse.json(results);
}
