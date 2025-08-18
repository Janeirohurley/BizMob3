export const formatCurrency = (amount: number, symbol: string = '$'): string => {
  return `${symbol}${amount.toFixed(2)}`;
};

export const parseCurrency = (value: string): number => {
  return parseFloat(value.replace(/[^0-9.-]+/g, '')) || 0;
};