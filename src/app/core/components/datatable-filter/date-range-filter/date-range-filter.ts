import { ChangeDetectionStrategy, Component, computed, model } from '@angular/core';
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { DateUtil } from '../../../utils/date.util';
import {
  DATE_RANGE_PRESETS,
  DEFAULT_DATE_RANGE_PRESET,
  type DateRange,
  type DateRangePresetId,
  isDateRangePresetId,
  presetForRange,
  rangeFromPreset,
} from '../../../constanta/date-range-preset';

@Component({
  selector: 'app-date-range-filter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmSelectImports, HlmDatePickerImports],
  templateUrl: './date-range-filter.html',
})
export class DateRangeFilter {
  protected readonly presets = DATE_RANGE_PRESETS;

  protected readonly presetLabel = (id: DateRangePresetId): string =>
    DATE_RANGE_PRESETS.find((preset) => preset.id === id)?.label ?? '';

  readonly range = model<DateRange | null>(rangeFromPreset(DEFAULT_DATE_RANGE_PRESET));

  protected readonly preset = computed(() => {
    const range = this.range();
    return range ? presetForRange(range) : null;
  });

  protected readonly pickerDate = computed<[Date, Date] | undefined>(() => {
    const range = this.range();
    return range ? [range.start, range.end] : undefined;
  });

  protected readonly formatRange = (dates: [Date | null, Date | null]): string => {
    const [start, end] = dates;
    if (start && end) return `${this.formatDay(start)} - ${this.formatDay(end)}`;
    if (start) return this.formatDay(start);
    if (end) return this.formatDay(end);
    return '';
  };

  protected onPreset(value: string | null | undefined): void {
    if (!isDateRangePresetId(value)) return;
    this.range.set(rangeFromPreset(value));
  }

  protected onRangeChange(value: [Date, Date] | null): void {
    this.range.set(value ? { start: value[0], end: value[1] } : null);
  }

  private formatDay(date: Date): string {
    return DateUtil.formatDate(date, 'id-ID', { day: 'numeric', month: 'short' });
  }
}
