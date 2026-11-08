import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { SearchInput } from '../../../../core/components/search-input/search-input';
import { TaskStore } from '../../data/task.store';

@Component({
  selector: 'app-task-filter-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmDialogImports, HlmButtonImports, HlmFieldImports, SearchInput],
  templateUrl: './task-filter-dialog.html',
})
export class TaskFilterDialog {
  protected readonly store = inject(TaskStore);
}
