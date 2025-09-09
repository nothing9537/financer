/* eslint-disable @typescript-eslint/no-explicit-any */
import { TxShape } from '../model/types';
import {
  DATE_ALIASES, AMOUNT_ALIASES, DEBIT_ALIASES, CREDIT_ALIASES,
  DESC_ALIASES, TYPE_ALIASES, CATEGORY_ALIASES, findHeader
} from './headers';

export function parseDateAny(v: unknown): string | null {
  if (v == null) return null;
  const raw = String(v).trim();
  if (!raw) return null;

  const d0 = new Date(raw);
  if (!Number.isNaN(+d0)) return d0.toISOString().slice(0, 10);

  const m1 = raw.match(/^(\d{1,2})[.](\d{1,2})[.](\d{4})$/);
  if (m1) {
    const [, ddS, mmS, yyyyS] = m1;
    const dd = Number(ddS), mm = Number(mmS), yyyy = Number(yyyyS);
    const d = new Date(yyyy, mm - 1, dd);
    if (!Number.isNaN(+d)) return d.toISOString().slice(0, 10);
  }
  const m2 = raw.match(/^(\d{1,2})[\/](\d{1,2})[\/](\d{4})$/);
  if (m2) {
    const [, aS, bS, yS] = m2;
    const A = Number(aS), B = Number(bS), Y = Number(yS);
    let d = new Date(Y, A - 1, B); // MM/dd/yyyy
    if (!Number.isNaN(+d)) return d.toISOString().slice(0, 10);
    d = new Date(Y, B - 1, A);     // dd/MM/yyyy
    if (!Number.isNaN(+d)) return d.toISOString().slice(0, 10);
  }
  return null;
}

export function getDescription(row: Record<string, any>, headers: string[], descCol?: string | null): string {
  if (descCol && row[descCol]) return String(row[descCol]).trim();
  for (const alias of DESC_ALIASES) {
    const h = findHeader(headers, [alias]);
    if (h && row[h]) return String(row[h]).trim();
  }
  const texts: string[] = [];
  for (const h of headers) {
    const v = row[h];
    if (typeof v === 'string' && v.trim()) texts.push(v.trim());
    if (texts.length >= 2) break;
  }
  return texts.join(' · ') || '(no description)';
}

function hasExplicitSign(raw: string): boolean {
  return /-/.test(raw) || (raw.startsWith('(') && raw.endsWith(')'));
}

function crdrHint(raw: string): number | null {
  const t = raw.toLowerCase();
  if (/\bcr(ed(it)?)?\b/.test(t)) return +1;
  if (/\bdr(eb(it)?)?\b/.test(t)) return -1;
  return null;
}

function parseAmountToNumber(v: unknown): number | null {
  if (v == null) return null;
  let s = String(v).trim();
  if (!s) return null;

  let negative = false;
  if (s.startsWith('(') && s.endsWith(')')) {
    negative = true;
    s = s.slice(1, -1);
  }
  s = s.replace(/[^\d,.\-]/g, '');

  const hasComma = s.includes(',');
  const hasDot = s.includes('.');
  if (hasComma && hasDot) {
    const last = Math.max(s.lastIndexOf(','), s.lastIndexOf('.'));
    const head = s.slice(0, last).replace(/[.,]/g, '');
    const tail = s.slice(last + 1);
    s = `${head}.${tail}`;
  } else if (hasComma && !hasDot) {
    s = s.replace(',', '.');
  }

  const num = Number(s);
  if (!Number.isFinite(num)) return null;
  return negative ? -Math.abs(num) : num;
}

function deriveAmountNumber(row: Record<string, any>, debitCol?: string | null, creditCol?: string | null): number | null {
  const debit = debitCol ? parseAmountToNumber(row[debitCol]) : null;
  const credit = creditCol ? parseAmountToNumber(row[creditCol]) : null;

  if (credit != null && debit != null) return credit - debit;
  if (credit != null) return credit;
  if (debit != null) return -Math.abs(debit);
  return null;
}

function applyTypeHintNumber(amount: number | null, row: Record<string, any>, headers: string[]): number | null {
  if (amount == null) return null;
  const tCol = findHeader(headers, TYPE_ALIASES);
  if (!tCol) return amount;

  const t = String(row[tCol] ?? '').toLowerCase();
  const isCredit = /(credit|deposit|refund)/.test(t);
  const isDebit = /(debit|withdraw|withdrawal|payment|purchase|pos)/.test(t);

  if (isCredit) return Math.abs(amount);
  if (isDebit) return -Math.abs(amount);
  return amount;
}

function getCategory(row: Record<string, any>, headers: string[], descFallback: string): string | undefined {
  const catCol = findHeader(headers, CATEGORY_ALIASES);
  if (catCol) {
    const v = String(row[catCol] ?? '').trim();
    if (v) return v; // PRIORITY
  }

  const typeCol = findHeader(headers, TYPE_ALIASES);
  if (typeCol) {
    const t = String(row[typeCol] ?? '').toLowerCase();
    if (/(payment|bill|pmt)/.test(t)) return 'Payment';
    if (/(purchase|pos|card)/.test(t)) return 'Purchase';
    if (/(refund|return|reversal)/.test(t)) return 'Refund';
    if (/(transfer|xfer|ach|wire)/.test(t)) return 'Transfer';
    if (/(interest)/.test(t)) return 'Interest';
    if (/(fee|charge|commission)/.test(t)) return 'Fee';
    if (/(atm|cash)/.test(t)) return 'ATM/Cash';
    if (/(deposit|credit)/.test(t)) return 'Deposit';
    if (/(check)/.test(t)) return 'Check';
  }

  const s = descFallback.toLowerCase();
  if (/(zelle|ach|transfer|xfer|wire|online transfer)/.test(s)) return 'Transfer';
  if (/(payment|bill|pmt|thank you)/.test(s)) return 'Payment';
  if (/(refund|return|reversal|reimburse)/.test(s)) return 'Refund';
  if (/(interest)/.test(s)) return 'Interest';
  if (/(fee|commission|charge|adjustment|fee assessed)/.test(s)) return 'Fee';
  if (/(atm|cash advance|cash withdrawal)/.test(s)) return 'ATM/Cash';
  if (/(check\s*\d+|check#)/.test(s)) return 'Check';
  if (/(deposit|direct dep|payroll)/.test(s)) return 'Deposit';
  if (/(purchase|pos|card|merchant)/.test(s)) return 'Purchase';

  return undefined;
}

export function normalizeRowsToTxShape(rows: Record<string, any>[]): TxShape[] {
  if (!rows.length) return [];

  const headers = Object.keys(rows[0]);
  const dateCol = findHeader(headers, DATE_ALIASES);
  const amountCol = findHeader(headers, AMOUNT_ALIASES);
  const debitCol = findHeader(headers, DEBIT_ALIASES);
  const creditCol = findHeader(headers, CREDIT_ALIASES);
  const descCol = findHeader(headers, DESC_ALIASES);

  const out: TxShape[] = [];

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];


    let date: string | null = null;
    if (dateCol) date = parseDateAny(r[dateCol]);
    if (!date) {
      for (const a of DATE_ALIASES) {
        const h = findHeader(headers, [a]);
        if (h) { date = parseDateAny(r[h]); if (date) break; }
      }
    }

    let amount: number | null = null;

    if (amountCol) {
      const raw = String(r[amountCol] ?? '').trim();
      const n = parseAmountToNumber(raw);
      if (n != null) {
        amount = n;

        if (!hasExplicitSign(raw)) {
          const hint = crdrHint(raw);
          if (hint === +1) amount = Math.abs(amount);
          if (hint === -1) amount = -Math.abs(amount);
        }
      }
    } else if (debitCol || creditCol) {
      amount = deriveAmountNumber(r, debitCol, creditCol);
      amount = applyTypeHintNumber(amount, r, headers);
    }

    const payee = getDescription(r, headers, descCol);
    const category = getCategory(r, headers, payee);

    if (date && amount != null) {
      const base = { id: (i + 1).toString(), amount, payee, date, account: "", accountId: "" } as const;
      out.push(category && category.trim() ? { ...base, category: category.trim() } : base);
    }
  }

  return out;
}
