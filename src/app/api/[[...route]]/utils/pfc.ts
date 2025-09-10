import type { PersonalFinanceCategory } from 'plaid';

const ACRONYMS = new Set([
  'ATM', 'ACH', 'IRS', 'ID', 'TV', 'USA', 'PPD',
]);

function toTitleCasePreserve(input: string): string {
  return input
    .split(' ')
    .map((w) => {
      if (!w) return w;
      if (w === '&') return w;
      if (ACRONYMS.has(w.toUpperCase())) return w.toUpperCase();
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
    .join(' ');
}

function humanizeCodeSegment(code: string): string {
  const raw = code
    .replace(/_AND_/g, ' & ')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return toTitleCasePreserve(raw);
}

export function prettifyPrimary(primary: string): string {
  return humanizeCodeSegment(primary);
}

export function prettifyDetailed(primary: string, detailed: string): string {
  let tail = detailed.startsWith(primary) ? detailed.slice(primary.length) : detailed;
  if (tail.startsWith('_')) tail = tail.slice(1);
  return humanizeCodeSegment(tail || primary);
}

export function prettifyPfc(pfc?: PersonalFinanceCategory | null): string {
  if (!pfc) return 'Uncategorized';
  const primary = (pfc.primary ?? '').trim();
  const detailed = (pfc.detailed ?? '').trim();

  if (!primary && !detailed) return 'Uncategorized';
  if (primary && !detailed) return prettifyPrimary(primary);
  if (!primary && detailed) return humanizeCodeSegment(detailed);

  const primaryLabel = prettifyPrimary(primary);
  const detailedLabel = prettifyDetailed(primary, detailed);
  return detailedLabel && detailedLabel !== primaryLabel
    ? `${primaryLabel} — ${detailedLabel}`
    : primaryLabel;
}

export const buildPfcCategoryId = (userId: string, detailed: string) =>
  `pfc:${userId}:${detailed}`;
