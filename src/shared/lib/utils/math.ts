export const convertAmountToMilliunits = (amount: string | number) => Math.round(Number(amount) * 1000);

export const convertAmountFromMilliunits = (amount: number) => amount / 1000;

export const calculatePercentageChange = (current: number, previous: number) => previous === 0
  ? (previous === current ? 0 : 100)
  : ((current - previous) / previous) * 100; 