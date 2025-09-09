import { CATEGORY_TAXONOMY } from '@/shared/lib/consts/category-taxonomy';

export type TaxoRow = { primary: string; detailed: string; description: string };

const STOP = new Set([
  'the', 'a', 'an', 'and', 'or', 'for', 'to', 'of', 'on', 'in', 'at', 'by', 'with', 'from', 'into', 'via',
  'other', 'miscellaneous', 'general', 'services', 'service', 'payment', 'payments', 'fees', 'fee',
  'account', 'transfer', 'transfers', 'funds', 'income', 'loan', 'loans', 'tax', 'credit', 'card'
]);

const norm = (s?: string) =>
  (s || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[’'`]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

function tokenize(s: string): string[] {
  const out: string[] = [];
  for (const w of norm(s).split(' ')) {
    if (!w || w.length <= 1) continue;
    if (STOP.has(w)) continue;
    out.push(w);
  }
  return out;
}

function titleCase(s: string) {
  return s.replace(/\b([a-z])/g, (_, c) => c.toUpperCase())
    .replace(/\bTv\b/g, 'TV')
    .replace(/\bAtm\b/g, 'ATM')
    .replace(/\bBbq\b/g, 'BBQ');
}

export function humanizePrimary(primary: string) {
  return titleCase(primary.replace(/_/g, ' ').replace(/\bAnd\b/gi, '&').toLowerCase());
}

export function humanizeDetailed(primary: string, detailed: string) {
  const suffix = detailed.replace(new RegExp(`^${primary}_`), '').replace(/_/g, ' ');
  return `${humanizePrimary(primary)} — ${titleCase(suffix)}`;
}

function parseTaxonomy(csv: string): TaxoRow[] {
  const lines = csv.split(/\r?\n/).filter(Boolean);
  const rows: TaxoRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];

    const parts = [];
    let cur = '';
    let inQ = false;
    for (let j = 0; j < line.length; j++) {
      const ch = line[j];
      if (ch === '"') {
        if (inQ && line[j + 1] === '"') { cur += '"'; j++; }
        else inQ = !inQ;
      } else if (ch === ',' && !inQ) {
        parts.push(cur); cur = '';
      } else {
        cur += ch;
      }
    }
    parts.push(cur);
    const [primary, detailed, description] = parts.map(s => s.trim());
    if (primary && detailed) rows.push({ primary, detailed, description: description || '' });
  }
  return rows;
}

const TAXO_ROWS = parseTaxonomy(CATEGORY_TAXONOMY);
const N = TAXO_ROWS.length;

export const DETAILED_TO_PRIMARY = new Map<string, string>();
export const DETAILED_TO_NAME = new Map<string, string>();
export const PRIMARY_TO_DETAILED = new Map<string, string[]>();

for (const r of TAXO_ROWS) {
  DETAILED_TO_PRIMARY.set(r.detailed, r.primary);
  DETAILED_TO_NAME.set(r.detailed, humanizeDetailed(r.primary, r.detailed));
  const list = PRIMARY_TO_DETAILED.get(r.primary) || [];
  list.push(r.detailed);
  PRIMARY_TO_DETAILED.set(r.primary, list);
}

type Vec = Map<string, number>;
const DOCS: Record<string, { vec: Vec }> = {};
const DF = new Map<string, number>();

function addToDf(tokens: string[]) {
  const uniq = new Set(tokens);
  for (const t of uniq) DF.set(t, (DF.get(t) || 0) + 1);
}

for (const r of TAXO_ROWS) {
  const toks = [
    ...tokenize(r.description),
    ...tokenize(r.detailed.replace(/_/g, ' ')),
    ...tokenize(humanizeDetailed(r.primary, r.detailed)),
  ];
  addToDf(toks);
  const tf = new Map<string, number>();
  for (const t of toks) tf.set(t, (tf.get(t) || 0) + 1);
  DOCS[r.detailed] = { vec: tf };
}

const IDF = new Map<string, number>();
for (const [term, df] of DF) {
  IDF.set(term, Math.log((N + 1) / (df + 1)) + 1);
}

function toUnit(vec: Vec): Vec {
  let sumSq = 0;
  const out = new Map<string, number>();
  for (const [t, f] of vec) {
    const w = f * (IDF.get(t) || 1);
    out.set(t, w);
    sumSq += w * w;
  }
  const norm = Math.sqrt(sumSq) || 1;
  for (const [t, w] of out) out.set(t, w / norm);
  return out;
}
for (const d of Object.values(DOCS)) d.vec = toUnit(d.vec);

function buildQueryVec(text: string): Vec {
  const tf = new Map<string, number>();
  for (const t of tokenize(text)) tf.set(t, (tf.get(t) || 0) + 1);
  return toUnit(tf);
}

function cosine(a: Vec, b: Vec) {
  let s = 0;

  const [small, big] = a.size < b.size ? [a, b] : [b, a];
  for (const [t, wa] of small) {
    const wb = big.get(t);
    if (wb) s += wa * wb;
  }
  return s;
}

export function bestDetailedWithinPrimary(text: string, primary: string, minScore = 0.08): { id: string, score: number } | null {
  const cands = PRIMARY_TO_DETAILED.get(primary);
  if (!cands || !cands.length) return null;

  const q = buildQueryVec(text);
  let best: string | null = null;
  let bestScore = 0;
  for (const d of cands) {
    const sc = cosine(q, DOCS[d].vec);
    if (sc > bestScore) { best = d; bestScore = sc; }
  }
  if (best && bestScore >= minScore) return { id: best, score: bestScore };
  return null;
}

export function displayNameByDetailed(detailed: string) {
  return DETAILED_TO_NAME.get(detailed) || detailed;
}

export function fallbackOtherDetailed(primary: string): string | null {
  const map: Record<string, string> = {
    FOOD_AND_DRINK: 'FOOD_AND_DRINK_OTHER_FOOD_AND_DRINK',
    GENERAL_MERCHANDISE: 'GENERAL_MERCHANDISE_OTHER_GENERAL_MERCHANDISE',
    TRANSFER_IN: 'TRANSFER_IN_OTHER_TRANSFER_IN',
    TRANSFER_OUT: 'TRANSFER_OUT_OTHER_TRANSFER_OUT',
    BANK_FEES: 'BANK_FEES_OTHER_BANK_FEES',
    LOAN_PAYMENTS: 'LOAN_PAYMENTS_OTHER_PAYMENT',
    GENERAL_SERVICES: 'GENERAL_SERVICES_OTHER_GENERAL_SERVICES',
  };
  return map[primary] || null;
}
