import { norm, ALL_PRIMARIES } from './primary-detail-router';

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


type Rule = (ctx: {
  baseCategory?: string | null;
  payee?: string | null;
  type?: string | null;
  amount?: number | null;
}) => { detailed: string; name: string } | null;

const isCreditCardPayment = (s: string) =>
  /(credit card payment|cc payment|payment .* card|payment to .* card ending|thank ?you-?mobile|autopay|auto pay|bill pay)/.test(s);

const isZelleOut = (s: string) => /(zelle).*(to|payment to)/.test(s);
const isZelleIn = (s: string) => /(zelle).*(from)/.test(s);

const isKrakenDeposit = (s: string) => /(kraken).*(deposit|ppd|ach credit|incoming)/.test(s);

const isMonthlyServiceFee = (s: string) => /(monthly service fee|service fee|maintenance fee)/.test(s);
const isNsfOrOverdraft = (s: string) => /(insufficient funds|nsf|overdraft)/.test(s);
const isAtmFee = (s: string) => /(atm fee|non[- ]chase atm fee|atm surcharge)/.test(s);
const isInterestCharge = (s: string) => /(interest charge|interest on purchases)/.test(s);

const fastFoodMerchants = [
  'mcdonalds', 'burger king', 'kfc', 'taco bell', 'wendys', 'chipotle',
  'subway', 'panda express', 'dominos', 'pizza hut', 'five guys', 'in n out',
  'shake shack', 'panera', 'raising canes',
];
const deliveryMerchants = ['uber eats', 'ubereats', 'doordash', 'grubhub', 'postmates'];
const coffeeMerchants = ['starbucks', 'dunkin', 'peets'];

const isGrocery = (s: string) =>
  /(grocery|grocer|mrkt|market|food mart|kroger|aldi|heb|publix|safeway|trader joes|whole foods|wm supercenter|walmart supercenter)/.test(s);

const isLiquor = (s: string) => /(liquor|beer|wine|bottle shop)/.test(s);

const isRestaurant = (s: string) =>
  /(restaurant|bistro|grill|bbq|diner|buffet|eatery|gastropub)/.test(s) ||
  deliveryMerchants.some(m => s.includes(m)) ||
  fastFoodMerchants.some(m => s.includes(m));

const isFastFood = (s: string) => fastFoodMerchants.some(m => s.includes(m));

export const HARD_RULES: Rule[] = [
  ({ baseCategory, payee, type }) => {
    const ctx = norm([baseCategory, type, payee].filter(Boolean).join(' '));
    if (isCreditCardPayment(ctx) || /payment to .* card ending/.test(ctx)) {
      const detailed = 'LOAN_PAYMENTS_CREDIT_CARD_PAYMENT';
      return { detailed, name: prettyNameFromDetailed(detailed) };
    }
    return null;
  },

  ({ baseCategory, payee, type, amount }) => {
    const ctx = norm([baseCategory, type, payee].filter(Boolean).join(' '));
    if (isZelleOut(ctx)) {
      const detailed = 'TRANSFER_OUT_ACCOUNT_TRANSFER';
      return { detailed, name: prettyNameFromDetailed(detailed) };
    }
    if (isZelleIn(ctx)) {
      const detailed = 'TRANSFER_IN_ACCOUNT_TRANSFER';
      return { detailed, name: prettyNameFromDetailed(detailed) };
    }
    if (isKrakenDeposit(ctx)) {
      const detailed = 'TRANSFER_IN_DEPOSIT';
      return { detailed, name: prettyNameFromDetailed(detailed) };
    }
    if (typeof amount === 'number') {
      if (amount > 0 && /deposit|ach credit|incoming|from/.test(ctx)) {
        const detailed = 'TRANSFER_IN_DEPOSIT';
        return { detailed, name: prettyNameFromDetailed(detailed) };
      }
      if (amount < 0 && /transfer|ach debit|to|outgoing/.test(ctx)) {
        const detailed = 'TRANSFER_OUT_ACCOUNT_TRANSFER';
        return { detailed, name: prettyNameFromDetailed(detailed) };
      }
    }
    return null;
  },

  ({ baseCategory, payee, type }) => {
    const ctx = norm([baseCategory, type, payee].filter(Boolean).join(' '));
    if (isMonthlyServiceFee(ctx)) {
      const detailed = 'BANK_FEES_OTHER_BANK_FEES';
      return { detailed, name: prettyNameFromDetailed(detailed) };
    }
    if (isNsfOrOverdraft(ctx)) {
      const detailed = 'BANK_FEES_INSUFFICIENT_FUNDS';
      return { detailed, name: prettyNameFromDetailed(detailed) };
    }
    if (isAtmFee(ctx)) {
      const detailed = 'BANK_FEES_ATM_FEES';
      return { detailed, name: prettyNameFromDetailed(detailed) };
    }
    if (isInterestCharge(ctx)) {
      const detailed = 'BANK_FEES_INTEREST_CHARGE';
      return { detailed, name: prettyNameFromDetailed(detailed) };
    }
    return null;
  },

  ({ baseCategory, payee, type }) => {
    const ctx = norm([baseCategory, type, payee].filter(Boolean).join(' '));
    if (/\binterest\b/.test(ctx)) {
      const detailed = 'INCOME_INTEREST_EARNED';
      return { detailed, name: prettyNameFromDetailed(detailed) };
    }
    if (/dividend|dividends/.test(ctx)) {
      const detailed = 'INCOME_DIVIDENDS';
      return { detailed, name: prettyNameFromDetailed(detailed) };
    }
    if (/(payroll|salary|wage|wages)/.test(ctx)) {
      const detailed = 'INCOME_WAGES';
      return { detailed, name: prettyNameFromDetailed(detailed) };
    }
    return null;
  },

  ({ baseCategory, payee }) => {
    const ctx = norm([baseCategory, payee].filter(Boolean).join(' '));

    if (isGrocery(ctx)) {
      const detailed = 'FOOD_AND_DRINK_GROCERIES';
      return { detailed, name: prettyNameFromDetailed(detailed) };
    }
    if (coffeeMerchants.some(m => ctx.includes(m))) {
      const detailed = 'FOOD_AND_DRINK_COFFEE';
      return { detailed, name: prettyNameFromDetailed(detailed) };
    }
    if (isFastFood(ctx)) {
      const detailed = 'FOOD_AND_DRINK_FAST_FOOD';
      return { detailed, name: prettyNameFromDetailed(detailed) };
    }
    if (isRestaurant(ctx)) {
      const detailed = 'FOOD_AND_DRINK_RESTAURANT';
      return { detailed, name: prettyNameFromDetailed(detailed) };
    }
    if (isLiquor(ctx)) {
      const detailed = 'FOOD_AND_DRINK_BEER_WINE_AND_LIQUOR';
      return { detailed, name: prettyNameFromDetailed(detailed) };
    }
    return null;
  },

  ({ payee }) => {
    const s = norm(payee);
    if (/smoke shop|tobacco|vape/.test(s)) {
      const detailed = 'GENERAL_MERCHANDISE_TOBACCO_AND_VAPE';
      return { detailed, name: prettyNameFromDetailed(detailed) };
    }
    return null;
  },
];

export function applyHardRules(args: {
  baseCategory?: string | null;
  payee?: string | null;
  type?: string | null;
  amount?: number | null;
}): { detailed: string; name: string } | null {
  for (const r of HARD_RULES) {
    const hit = r(args);
    if (hit) return hit;
  }
  return null;
}
