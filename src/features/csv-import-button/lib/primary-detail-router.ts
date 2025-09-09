export type Primary =
  | 'INCOME'
  | 'TRANSFER_IN'
  | 'TRANSFER_OUT'
  | 'LOAN_PAYMENTS'
  | 'BANK_FEES'
  | 'ENTERTAINMENT'
  | 'FOOD_AND_DRINK'
  | 'GENERAL_MERCHANDISE'
  | 'HOME_IMPROVEMENT'
  | 'MEDICAL'
  | 'PERSONAL_CARE'
  | 'GENERAL_SERVICES'
  | 'GOVERNMENT_AND_NON_PROFIT'
  | 'TRANSPORTATION'
  | 'TRAVEL'
  | 'RENT_AND_UTILITIES';

export const ALL_PRIMARIES: Primary[] = [
  'INCOME',
  'TRANSFER_IN',
  'TRANSFER_OUT',
  'LOAN_PAYMENTS',
  'BANK_FEES',
  'ENTERTAINMENT',
  'FOOD_AND_DRINK',
  'GENERAL_MERCHANDISE',
  'HOME_IMPROVEMENT',
  'MEDICAL',
  'PERSONAL_CARE',
  'GENERAL_SERVICES',
  'GOVERNMENT_AND_NON_PROFIT',
  'TRANSPORTATION',
  'TRAVEL',
  'RENT_AND_UTILITIES',
];

export const norm = (s?: string | null) =>
  (s || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[’'`]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9.+\- ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const contains = (hay: string, needle: string | RegExp) =>
  typeof needle === 'string' ? hay.includes(needle) : !!hay.match(needle);

function scoreByKeywords(hay: string, kws: (string | RegExp)[], weight = 1): number {
  let sc = 0;
  for (const k of kws) if (contains(hay, k)) sc += weight;
  return sc;
}

const KW: Record<Primary, (string | RegExp)[]> = {
  INCOME: [
    'income', 'payroll', 'salary', 'salaries', 'wage', 'wages',
    'tips', 'direct dep', 'direct deposit', 'deposit payroll',
    'dividend', 'dividends',
    /\binterest\b/, 'pension', 'retirement', 'unemployment', 'tax refund', 'irs refund',
    'social security', 'ssi'
  ],
  TRANSFER_IN: [
    'transfer in', 'zelle from', 'from zelle', 'incoming wire', 'ach credit',
    'deposit from', 'atm deposit', 'mobile check', 'check deposit',
    /\bdeposit\b(?! fee)/, 'from kraken', 'from coinbase', 'from binance',
  ],
  TRANSFER_OUT: [
    'transfer out', 'zelle to', 'payment to', 'to chk', 'to sav',
    'outgoing wire', 'ach debit', 'online transfer', 'internal transfer',
    'send to', 'orig co name', 'zelle payment to'
  ],
  LOAN_PAYMENTS: [
    'loan payment', 'mortgage payment', 'student loan', 'car loan',
    'lease payment', 'credit card payment', 'cc payment',
    'payment thank you', 'thank you mobile', 'thankyou mobile',
    /payment .* card/, /card .* payment/,
    'autopay', 'auto pay', 'bill pay',
    'payment to chase card ending', 'payment for credit card'
  ],
  BANK_FEES: [
    'fee', 'fees', 'service fee', 'monthly service', 'maintenance fee',
    'atm fee', 'non chase atm', 'overdraft', 'nsf', 'insufficient funds',
    'foreign transaction fee', 'interest charge', 'chargeback fee',
  ],
  ENTERTAINMENT: [
    'movie', 'movies', 'theater', 'cinema', 'tv', 'streaming',
    'netflix', 'hulu', 'disney', 'max ', 'spotify', 'apple music',
    'amusement', 'park', 'museum', 'event', 'ticketmaster', 'fandango',
    'casino', 'gambling', 'draftkings', 'fanduel', 'video game', 'steam',
    'xbox', 'playstation', 'nintendo',
  ],
  FOOD_AND_DRINK: [
    'food', 'restaurant', 'bar', 'cafe', 'coffee', 'fast food', 'grocer',
    'market', 'liquor', 'beer', 'wine', 'vending',
    'buffet', 'grill', 'bbq', 'diner', 'bistro',
    'starbucks', 'mcdonalds', 'burger king', 'kfc', 'taco bell',
    'wendys', 'chipotle', 'subway', 'dominos', 'pizza hut', 'panda express',
    'doordash', 'grubhub', 'uber eats', 'ubereats', 'postmates',
    'dunkin', 'panera', 'chick fil a', 'five guys', 'raising canes', 'in n out',
    'kroger', 'whole foods', 'trader joes', 'aldi', 'heb', 'publix', 'safeway',
    'costco', 'food mart', 'fresh market'
  ],
  GENERAL_MERCHANDISE: [
    'amazon', 'walmart', 'target', 'best buy', 'department store',
    'convenience store', 'rite aid', 'walgreens', 'cvs',
    'gift', 'novelty', 'petco', 'petsmart', 'sporting goods',
    'office depot', 'staples', 'online marketplace', 'etsy', 'ebay',
    'smoke shop', 'tobacco'
  ],
  HOME_IMPROVEMENT: [
    'home depot', 'lowes', 'ikea', 'wayfair', 'furniture', 'mattress',
    'hardware', 'paint', 'wallpaper', 'repair', 'maintenance',
    'plumbing', 'lighting', 'garden', 'roof', 'security', 'pest control',
  ],
  MEDICAL: [
    'pharmacy', 'pharmacies', 'supplement',
    'walgreens pharmacy', 'cvs pharmacy',
    'clinic', 'doctor', 'primary care', 'dentist', 'dental',
    'optical', 'vision', 'eye care', 'veterinary', 'vet',
    'hospital', 'urgent care', 'labcorp', 'quest diagnostics',
  ],
  PERSONAL_CARE: [
    'gym', 'fitness', 'workout', 'hair', 'barber', 'salon', 'spa', 'massage',
    'laundry', 'dry clean', 'beauty', 'manicure', 'pedicure',
  ],
  GENERAL_SERVICES: [
    'insurance', 'postage', 'shipping', 'usps', 'ups', 'fedex',
    'consulting', 'legal', 'law', 'attorney',
    'education', 'tuition', 'school', 'course', 'udemy', 'coursera',
    'storage', 'childcare', 'accounting', 'tax service', 'h&r block',
  ],
  GOVERNMENT_AND_NON_PROFIT: [
    'donation', 'charity', 'church', 'non-profit', 'nonprofit',
    'irs', 'tax payment', 'dmv', 'government', 'passport',
  ],
  TRANSPORTATION: [
    'uber', 'lyft', 'taxi', 'ride share', 'rideshare',
    'gas', 'gasoline', 'shell', 'bp', 'chevron', 'exxon', 'mobil',
    'parking', 'toll', 'metro', 'subway', 'bus', 'train', 'amtrak',
    'scooter', 'bike', 'lime', 'bird',
  ],
  TRAVEL: [
    'airline', 'flight', 'delta', 'american airlines', 'united',
    'southwest', 'jetblue', 'spirit',
    'hotel', 'motel', 'marriott', 'hilton', 'hyatt', 'airbnb', 'booking',
    'expedia', 'rental car', 'avis', 'hertz', 'budget', 'alamo', 'enterprise',
  ],
  RENT_AND_UTILITIES: [
    'rent', 'landlord', 'property management',
    'electric', 'electricity', 'gas bill', 'water', 'sewage', 'waste',
    'internet', 'cable', 'phone', 'utility',
    'comcast', 'xfinity', 'spectrum', 'verizon', 't-mobile', 'tmobile', 'att',
  ],
};

const BOOSTERS: { test: (s: string) => boolean; primary: Primary; bonus: number }[] = [
  { test: s => /(credit card payment|cc payment|payment .* card|payment to .* card ending|thank ?you-?mobile|autopay|auto pay|bill pay)/.test(s), primary: 'LOAN_PAYMENTS', bonus: 6 },
  { test: s => /(zelle).*(to|payment to)/.test(s), primary: 'TRANSFER_OUT', bonus: 4 },
  { test: s => /(zelle|deposit|ach credit|incoming|from)\b/.test(s) && /(from|kraken|coinbase|binance)/.test(s), primary: 'TRANSFER_IN', bonus: 4 },
  { test: s => /(atm fee|non[- ]chase atm|service fee|maintenance fee|overdraft|insufficient funds|nsf|interest charge|foreign transaction fee)/.test(s), primary: 'BANK_FEES', bonus: 5 },
  { test: s => /(uber|lyft)\b/.test(s), primary: 'TRANSPORTATION', bonus: 3 },
  { test: s => /(uber ?eats|doordash|grubhub|postmates)/.test(s), primary: 'FOOD_AND_DRINK', bonus: 4 },
  { test: s => /(airline|flight|marriott|hilton|hyatt|airbnb)/.test(s), primary: 'TRAVEL', bonus: 3 },
];

const CATEGORY_HINTS: Record<string, Primary> = {
  'payment': 'LOAN_PAYMENTS',
  'deposit': 'TRANSFER_IN',
  'transfer': 'TRANSFER_OUT',
  'transfer in': 'TRANSFER_IN',
  'transfer out': 'TRANSFER_OUT',
  'fee': 'BANK_FEES',
  'atm/cash': 'BANK_FEES',
  'interest': 'INCOME',
  'refund': 'INCOME',
  'purchase': 'GENERAL_MERCHANDISE',
  'restaurant': 'FOOD_AND_DRINK',
  'groceries': 'FOOD_AND_DRINK',
  'travel': 'TRAVEL',
  'gas': 'TRANSPORTATION',
};

export function routePrimary(
  baseCategory?: string | null,
  payee?: string | null,
  type?: string | null
): Primary | null {
  const base = norm(baseCategory);
  const who = norm(payee);
  const t = norm(type);
  const ctx = [base, t, who].filter(Boolean).join(' ');

  if (!ctx) return null;

  if (base) {
    if (CATEGORY_HINTS[base]) return CATEGORY_HINTS[base];
    for (const [k, p] of Object.entries(CATEGORY_HINTS)) {
      if (base.includes(k)) return p;
    }
  }

  const boosterMap = new Map<Primary, number>();
  for (const b of BOOSTERS) {
    if (b.test(ctx)) boosterMap.set(b.primary, (boosterMap.get(b.primary) || 0) + b.bonus);
  }

  const scores = new Map<Primary, number>();
  for (const p of ALL_PRIMARIES) {
    const kwScore =
      scoreByKeywords(ctx, KW[p], 1) +
      scoreByKeywords(base, KW[p], 0.5) +
      (boosterMap.get(p) || 0);

    if (kwScore > 0) scores.set(p, kwScore);
  }

  if (!scores.size) return null;

  let best: Primary | null = null;
  let bestScore = -Infinity;
  for (const [p, sc] of scores.entries()) {
    if (sc > bestScore) {
      best = p;
      bestScore = sc;
    }
  }
  return best;
}
