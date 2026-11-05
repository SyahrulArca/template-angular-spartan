import { ChangeDetectionStrategy, Component, model, input } from '@angular/core';
import { HlmToggleGroupImports } from '@spartan-ng/helm/toggle-group';

export interface DataTableStatusOption {
  value: string;
  label: string;
  count?: number;
}

@Component({
  selector: 'app-status-filter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmToggleGroupImports],
  templateUrl: './status-filter.html',
})
export class StatusFilter {
  readonly options = input.required<DataTableStatusOption[]>();
  readonly value = model<string | null>(null);

  protected onValueChange(next: string | string[] | null | undefined): void {
    this.value.set(typeof next === 'string' ? next : null);
  }
}
