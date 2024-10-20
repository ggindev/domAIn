const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';

interface DomainInfo {
  domain: string;
  isMeaningful: boolean;
}

async function checkMeaningfulWords(words: string[]): Promise<Record<string, boolean>> {
  const response = await fetch('/api/words/check-meaningful', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ words }),
  });

  if (!response.ok) {
    throw new Error('Failed to check meaningful words');
  }

  return response.json();
}

export async function generateDomains(
  prefixLength: number,
  suffixLength: number,
  includeNumbers: boolean,
  includeHyphens: boolean,
  page: number = 1,
  pageSize: number = 100
): Promise<DomainInfo[]> {
  const characters = ALPHABET + (includeNumbers ? NUMBERS : '') + (includeHyphens ? '-' : '');
  const totalLength = prefixLength + suffixLength;
  const totalCombinations = Math.pow(characters.length, totalLength);
  
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalCombinations);
  
  const domains: DomainInfo[] = [];
  const wordsToCheck: string[] = [];

  for (let i = startIndex; i < endIndex; i++) {
    let domain = '';
    let tempI = i;
    
    for (let j = 0; j < totalLength; j++) {
      domain = characters[tempI % characters.length] + domain;
      tempI = Math.floor(tempI / characters.length);
    }
    
    const prefix = domain.slice(0, prefixLength);
    const suffix = domain.slice(-suffixLength);
    const fullDomain = `${prefix}.${suffix}`;
    const concatenatedDomain = prefix + suffix;
    
    domains.push({
      domain: fullDomain,
      isMeaningful: false, // We'll update this later
    });
    wordsToCheck.push(concatenatedDomain);
  }

  const meaningfulResults = await checkMeaningfulWords(wordsToCheck);

  domains.forEach((domainInfo, index) => {
    const concatenatedDomain = wordsToCheck[index];
    domainInfo.isMeaningful = meaningfulResults[concatenatedDomain] || false;
  });

  return domains;
}
