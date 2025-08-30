export const convertAmountToMilliunits = (amount: string | number) => Math.round(Number(amount) * 1000);

export const convertAmountFromMilliunits = (amount: number) => amount / 1000; 