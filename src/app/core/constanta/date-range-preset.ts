export type DateRangePresetId = '7d' | '14d' | '1m' | '3m';

export interface DateRangePreset {
  id: DateRangePresetId;
  label: string;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export const DATE_RANGE_PRESETS: readonly DateRangePreset[] = [
  { id: '7d', label: '7 hari lalu' },
  { id: '14d', label: '14 hari lalu' },
  { id: '1m', label: '1 bulan lalu' },
  { id: '3m', label: '3 bulan lalu' },
];

export const DEFAULT_DATE_RANGE_PRESET: DateRangePresetId = '7d';

export function isDateRangePresetId(value: unknown): value is DateRangePresetId {
  return DATE_RANGE_PRESETS.some((preset) => preset.id === value);
}

export function rangeFromPreset(id: DateRangePresetId, today = new Date()): DateRange {
  const end = startOfDay(today);
  const start =
    id === '7d'
      ? shiftDays(end, -7)
      : id === '14d'
        ? shiftDays(end, -14)
        : id === '1m'
          ? shiftMonths(end, -1)
          : shiftMonths(end, -3);

  return { start, end };
}

export function presetForRange(range: DateRange, today = new Date()): DateRangePresetId | null {
  const match = DATE_RANGE_PRESETS.find((preset) => {
    const expected = rangeFromPreset(preset.id, today);
    return sameDay(range.start, expected.start) && sameDay(range.end, expected.end);
  });

  return match?.id ?? null;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function shiftDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

function shiftMonths(date: Date, months: number): Date {
  const shifted = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const lastDay = new Date(shifted.getFullYear(), shifted.getMonth() + 1, 0).getDate();
  shifted.setDate(Math.min(date.getDate(), lastDay));
  return shifted;
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
