import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-task-toolbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmButtonImports, NgIcon],
  providers: [provideIcons({ lucidePlus })],
  templateUrl: './task-toolbar.html',
})
export class TaskToolbar {
  readonly total = input(0);
  readonly completedCount = input(0);

  readonly createTask = output<void>();
}
