type HoursRow = { day: string; time: string };

const SHORT_DAY: Record<string, string> = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
};

function formatDayLabel(days: string[]): string {
  const short = days.map((d) => SHORT_DAY[d] ?? d);
  if (short.length === 1) return short[0];
  if (short.length === 2) return `${short[0]} & ${short[1]}`;
  return `${short[0]}–${short[short.length - 1]}`;
}

/**
 * Collapses consecutive days that share the same time into one line, so a
 * seven-row table reads as "Mon–Fri · 6:00 AM – 4:00 PM". Relies on the
 * rows already being in week order, which businessConfig keeps them in.
 */
export function groupHours(rows: HoursRow[]): { label: string; time: string }[] {
  const groups: { days: string[]; time: string }[] = [];

  for (const row of rows) {
    const last = groups[groups.length - 1];
    if (last && last.time === row.time) {
      last.days.push(row.day);
    } else {
      groups.push({ days: [row.day], time: row.time });
    }
  }

  return groups.map((g) => ({ label: formatDayLabel(g.days), time: g.time }));
}
