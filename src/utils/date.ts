const ARABIC_MONTHS: Record<string, number> = {
  يناير: 0,
  فبراير: 1,
  مارس: 2,
  أبريل: 3,
  ابريل: 3,
  مايو: 4,
  يونيو: 5,
  يوليو: 6,
  أغسطس: 7,
  اغسطس: 7,
  سبتمبر: 8,
  أكتوبر: 9,
  اكتوبر: 9,
  نوفمبر: 10,
  ديسمبر: 11,
};

function parseDate(value: string): number | null {
  const trimmed = value.trim();
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (isoMatch) return Date.UTC(Number(isoMatch[1]), Number(isoMatch[2]) - 1, Number(isoMatch[3]));

  const numericMatch = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(trimmed);
  if (numericMatch) return Date.UTC(Number(numericMatch[3]), Number(numericMatch[2]) - 1, Number(numericMatch[1]));

  const arabicMatch = /^(\d{1,2})\s*([^\d\s]+)\s+(\d{4})$/.exec(trimmed);
  if (arabicMatch) {
    const month = ARABIC_MONTHS[arabicMatch[2] ?? ""];
    if (month !== undefined) return Date.UTC(Number(arabicMatch[3]), month, Number(arabicMatch[1]));
  }

  return null;
}

export function isDateWithinRange(value: string, from: string, to: string): boolean {
  if (!from && !to) return true;
  const timestamp = parseDate(value);
  if (timestamp === null) return false;
  const fromTimestamp = from ? parseDate(from) : null;
  const toTimestamp = to ? parseDate(to) : null;
  return (fromTimestamp === null || timestamp >= fromTimestamp) && (toTimestamp === null || timestamp <= toTimestamp);
}
