import { presetForRange, rangeFromPreset } from './date-range-preset';

describe('date range presets', () => {
  const today = new Date(2026, 10, 5);

  it('sets the end date to today and the start date from the preset', () => {
    expect(rangeFromPreset('7d', today)).toEqual({
      start: new Date(2026, 9, 29),
      end: new Date(2026, 10, 5),
    });
    expect(rangeFromPreset('14d', today)).toEqual({
      start: new Date(2026, 9, 22),
      end: new Date(2026, 10, 5),
    });
    expect(rangeFromPreset('1m', today).start).toEqual(new Date(2026, 9, 5));
    expect(rangeFromPreset('3m', today).start).toEqual(new Date(2026, 7, 5));
  });

  it('clamps a month shift to the last day of a short month', () => {
    expect(rangeFromPreset('1m', new Date(2026, 2, 31)).start).toEqual(new Date(2026, 1, 28));
    expect(rangeFromPreset('1m', new Date(2024, 2, 31)).start).toEqual(new Date(2024, 1, 29));
  });

  it('matches a preset range and ignores a custom range', () => {
    expect(presetForRange(rangeFromPreset('14d', today), today)).toBe('14d');
    expect(
      presetForRange({ start: new Date(2026, 0, 1), end: new Date(2026, 0, 2) }, today),
    ).toBeNull();
  });
});
