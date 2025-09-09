export function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQ = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
      else inQ = !inQ;
    } else if (ch === ',' && !inQ) {
      out.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out.map(s => s.trim());
}

export function prettify(code: string) {
  return code
    .replace(/_/g, ' ')
    .replace(/\bAND\b/g, '&')
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase());
}

export function primaryAndDetailedLabel(primaryCode: string, detailedCode: string) {
  const primaryLabel = prettify(primaryCode);
  const prefix = `${primaryCode}_`;
  const suffix = detailedCode.startsWith(prefix)
    ? detailedCode.slice(prefix.length)
    : detailedCode;
  const detailedLabel = prettify(suffix);
  return `${primaryLabel}${detailedLabel ? ' — ' + detailedLabel : ''}`;
}