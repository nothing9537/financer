/* eslint-disable @typescript-eslint/no-explicit-any */

import { CATEGORY_TAXONOMY } from '@/shared/lib/consts/category-taxonomy';
import { applyHardRules } from './merchant-rules';
import { Primary, routePrimary, norm, ALL_PRIMARIES } from './primary-detail-router';

type Row = { primary: Primary; detailed: string; description: string };
const rows: Row[] = CATEGORY_TAXONOMY
  .trim()
  .split('\n')
  .slice(1)
  .map((line) => {
    const [p, d, desc] = line.split(',').map(s => s.trim().replace(/^"|"$/g, ''));
    return { primary: p as Primary, detailed: d, description: (desc || '').replace(/^"|"$/g, '') };
  });

const byPrimary = rows.reduce<Record<Primary, Row[]>>((acc, r) => {
  (acc[r.primary] ||= []).push(r);
  return acc;
}, {} as any);

function splitPrimaryDetailed(detailed: string): { primary: string; tail: string } {
  const p = [...ALL_PRIMARIES].sort((a, b) => b.length - a.length)
    .find(pr => detailed === pr || detailed.startsWith(pr + '_'));
  if (p) {
    const tail = detailed.length > p.length ? detailed.slice(p.length + 1) : '';
    return { primary: p, tail };
  }
  const i = detailed.indexOf('_');
  return i > 0 ? { primary: detailed.slice(0, i), tail: detailed.slice(i + 1) } : { primary: detailed, tail: '' };
}
function humanize(seg: string): string {
  return seg
    .toLowerCase()
    .split('_')
    .map(s => (s ? s[0].toUpperCase() + s.slice(1) : s))
    .join(' ')
    .replace(/\bAnd\b/gi, '&');
}
function prettyNameFromDetailed(detailed: string): string {
  const { primary, tail } = splitPrimaryDetailed(detailed);
  const p = humanize(primary);
  const t = tail ? humanize(tail) : '';
  return t ? `${p} — ${t}` : p;
}

const tokenize = (s: string) => norm(s).split(' ').filter(Boolean);

const docFreq = new Map<string, number>();
let totalDocs = 0;
for (const r of rows) {
  const toks = new Set(tokenize(r.detailed + ' ' + r.description));
  for (const t of toks) docFreq.set(t, (docFreq.get(t) || 0) + 1);
  totalDocs += 1;
}
const idf = (t: string) => Math.log((1 + totalDocs) / (1 + (docFreq.get(t) || 0))) + 1;

function cosine(a: Map<string, number>, b: Map<string, number>): number {
  let dot = 0, na = 0, nb = 0;
  for (const [t, w] of a) { dot += w * (b.get(t) || 0); na += w * w; }
  for (const [, w] of b) nb += w * w;
  return na && nb ? dot / (Math.sqrt(na) * Math.sqrt(nb)) : 0;
}

function tfidfVector(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  for (const t of tokens) tf.set(t, (tf.get(t) || 0) + 1);
  const vec = new Map<string, number>();
  for (const [t, f] of tf) vec.set(t, f * idf(t));
  return vec;
}
function vectorForRow(r: Row): Map<string, number> {
  const key = `${r.detailed} ${r.description}`;
  return tfidfVector(tokenize(key));
}
const rowVecCache = new Map<string, Map<string, number>>();
function getRowVec(r: Row) {
  const k = r.detailed;
  let v = rowVecCache.get(k);
  if (!v) { v = vectorForRow(r); rowVecCache.set(k, v); }
  return v;
}

export function mapCategoryWithTfIdf(args: {
  baseCategory?: string | null;
  payee?: string | null;
  type?: string | null;
  amount?: number | null;
}): { id: string; name: string } | null {
  const { baseCategory, payee, type, amount } = args;

  const hard = applyHardRules({ baseCategory, payee, type, amount });
  if (hard) return { id: hard.detailed, name: hard.name };

  const primary = routePrimary(baseCategory, payee, type);
  const candidates = primary ? byPrimary[primary] : rows;

  const tokens: string[] = [];
  if (baseCategory) tokens.push(...tokenize(baseCategory).flatMap(t => [t, t, t]));
  if (payee) tokens.push(...tokenize(payee).flatMap(t => [t, t, t, t]));
  if (type) tokens.push(...tokenize(type));

  const q = tfidfVector(tokens);

  let best: Row | null = null;
  let bestScore = -1;
  for (const r of candidates) {
    const sc = cosine(q, getRowVec(r));
    if (sc > bestScore) { best = r; bestScore = sc; }
  }
  if (!best) return null;

  return { id: best.detailed, name: prettyNameFromDetailed(best.detailed) };
}
