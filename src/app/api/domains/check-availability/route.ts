import { NextResponse } from 'next/server';
import { setTimeout } from 'timers/promises';

// Mock function to check domain availability
async function checkDomainAvailability(domain: string): Promise<boolean> {
  // Simulate API call delay
  await setTimeout(100);
  // Return a fixed availability status for testing purposes
  return true;
}

export async function POST(request: Request) {
  const { domains } = await request.json();

  if (!Array.isArray(domains) || domains.length === 0) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const results: Record<string, boolean> = {};

  // Check availability for domains
  for (const domain of domains) {
    const isAvailable = await checkDomainAvailability(domain);
    results[domain] = isAvailable;
  }

  return NextResponse.json(results);
}
