// Temporary fix for token decimals issue
// This will be removed after contract redeployment

import { parseEther, formatEther } from 'viem';

export const fixTokenAmount = (tokenAmount: number): bigint => {
  // Convert token amount to wei (18 decimals)
  return parseEther(tokenAmount.toString());
};

// For reading balances, convert back from wei to tokens
export const formatTokenBalance = (weiAmount: bigint): string => {
  // This handles the case where balance might be in wei
  return formatEther(weiAmount);
};

// Check if amount seems to be in wei (very small number)
export const isAmountInWei = (amount: string | number): boolean => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return numAmount < 0.01 && numAmount > 0;
};
