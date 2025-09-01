// Aliases (English only) + header utils

export const DATE_ALIASES = [
  'date', 'transaction date', 'posting date', 'post date',
  'book date', 'booking date', 'operation date', 'timestamp'
] as const;

export const AMOUNT_ALIASES = [
  'amount', 'transaction amount', 'amt', 'sum', 'value'
] as const;

export const DEBIT_ALIASES = ['debit', 'withdrawal', 'dr'] as const;
export const CREDIT_ALIASES = ['credit', 'deposit', 'cr'] as const;

export const DESC_ALIASES = [
  'description', 'statement memo', 'memo', 'details', 'payee',
  'merchant', 'name', 'narrative', 'purpose', 'comment', 'note'
] as const;

export const TYPE_ALIASES = ['type', 'transfer type', 'transaction type', 'drcr'] as const;

export const CATEGORY_ALIASES = [
  'category', 'transaction category', 'primary category', 'subcategory', 'sub-category',
  'category1', 'category 1', 'category2', 'category 2', 'merchant category',
  'expense category', 'income category', 'plaid_category', 'mcc'
] as const;

export const norm = (s: string) =>
  s.toLowerCase().normalize('NFKD').replace(/[^\p{Letter}\p{Number}\s]/gu, '').trim();

export function findHeader(headers: string[], aliases: readonly string[]): string | null {
  const H = headers.map(h => ({ raw: h, n: norm(h) }));
  // exact
  for (const a of aliases) {
    const n = norm(a);
    const hit = H.find(h => h.n === n);
    if (hit) return hit.raw;
  }
  // partial
  for (const a of aliases) {
    const n = norm(a);
    const hit = H.find(h => h.n.includes(n));
    if (hit) return hit.raw;
  }
  return null;
}
