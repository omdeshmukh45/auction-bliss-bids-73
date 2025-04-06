
export const USD_TO_INR_RATE = 85;

export const convertUSDtoINR = (amountUSD: number): number => {
  return amountUSD * USD_TO_INR_RATE;
};

export const formatCurrency = (amount: number, currency: 'USD' | 'INR' = 'USD'): string => {
  if (currency === 'USD') {
    return `$${amount.toLocaleString()}`;
  } else {
    return `₹${amount.toLocaleString()}`;
  }
};

export const formatPriceDisplay = (amountUSD: number): string => {
  const amountINR = convertUSDtoINR(amountUSD);
  return `${formatCurrency(amountUSD)} (${formatCurrency(amountINR, 'INR')})`;
};
