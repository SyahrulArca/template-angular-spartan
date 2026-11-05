import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import {
  DEFAULT_DATE_RANGE_PRESET,
  type DateRange,
  rangeFromPreset,
} from '../../constanta/date-range-preset';
import { DateRangeFilter } from './date-range-filter/date-range-filter';
import { StatusFilter, type DataTableStatusOption } from './status-filter/status-filter';

@Component({
  selector: 'app-data-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DateRangeFilter, StatusFilter],
  templateUrl: './data-table.html',
})
export class DataTable {
  readonly range = model<DateRange | null>(rangeFromPreset(DEFAULT_DATE_RANGE_PRESET));
  readonly statuses = input<DataTableStatusOption[]>([]);
  readonly status = model<string | null>(null);
}
