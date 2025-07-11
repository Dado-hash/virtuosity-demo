// Test BigInt conversion
const co2SavedGrams = 160;
const co2SavedGramsBigInt = BigInt(Math.floor(co2SavedGrams));

console.log('Original:', co2SavedGrams, 'Type:', typeof co2SavedGrams);
console.log('BigInt:', co2SavedGramsBigInt, 'Type:', typeof co2SavedGramsBigInt);
console.log('ToString:', co2SavedGramsBigInt.toString(), 'Type:', typeof co2SavedGramsBigInt.toString());

// Test with viem
import { parseUnits } from 'viem';

// For uint256, we can also use parseUnits with 0 decimals
const viemBigInt = parseUnits(co2SavedGrams.toString(), 0);
console.log('Viem BigInt:', viemBigInt, 'Type:', typeof viemBigInt);
