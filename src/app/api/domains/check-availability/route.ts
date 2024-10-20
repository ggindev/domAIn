import { NextResponse } from 'next/server';
import NodeCache from 'node-cache';
import { setTimeout } from 'timers/promises';

// Initialize cache with 10 minute TTL
const cache = new NodeCache({ stdTTL: 600 });

// Mock function to check domain availability
async function checkDomainAvailability(domain: string): Promise<boolean> {
  // Simulate API call delay
  await setTimeout(100);
  // Return a random availability status
  return Math.random() < 0.5;
}

export async function POST(request: Request) {
  const { domains } = await request.json();

  if (!Array.isArray(domains) || domains.length === 0) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const results: Record<string, boolean> = {};
  const uncachedDomains: string[] = [];

  // Check cache first
  for (const domain of domains) {
    const cachedResult = cache.get<boolean>(domain);
    if (cachedResult !== undefined) {
      results[domain] = cachedResult;
    } else {
      uncachedDomains.push(domain);
    }
  }

  // Check availability for uncached domains
  const maxRetries = 3;
  const baseDelay = 1000; // 1 second

  for (let retry = 0; retry < maxRetries; retry++) {
    try {
      for (const domain of uncachedDomains) {
        const isAvailable = await checkDomainAvailability(domain);
        results[domain] = isAvailable;
        cache.set(domain, isAvailable);
      }
      break; // Success, exit retry loop
    } catch (error) {
      if (retry === maxRetries - 1) {
        console.error('Max retries reached for domain availability check');
        return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
      }
      // Exponential backoff
      await setTimeout(baseDelay * Math.pow(2, retry));
    }
  }

  return NextResponse.json(results);
}
