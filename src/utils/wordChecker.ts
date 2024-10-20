import fs from 'fs';
import path from 'path';

class WordChecker {
  private wordSet: Set<string>;

  constructor() {
    this.wordSet = new Set();
    this.loadWordList();
  }

  private loadWordList() {
    const wordListPath = path.join(process.cwd(), 'src', 'utils', 'wordlist.txt');
    const words = fs.readFileSync(wordListPath, 'utf-8').split('\n');
    words.forEach(word => this.wordSet.add(word.trim().toLowerCase()));
  }

  public isMeaningfulWord(word: string): boolean {
    return this.wordSet.has(word.toLowerCase());
  }
}

export const wordChecker = new WordChecker();
