import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import {
  DEFAULT_DATE_RANGE_PRESET,
  type DateRange,
  rangeFromPreset,
} from '../../constanta/date-range-preset';
import { DateRangeFilter } from './date-range-filter/date-range-filter';
import { StatusFilter, type DatatableStatusOption } from './status-filter/status-filter';

@Component({
  selector: 'app-datatable-filter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DateRangeFilter, StatusFilter],
  templateUrl: './datatable-filter.html',
})
export class DatatableFilter {
  readonly range = model<DateRange | null>(rangeFromPreset(DEFAULT_DATE_RANGE_PRESET));
  readonly statuses = input<DatatableStatusOption[]>([]);
  readonly status = model<string | null>(null);
}
