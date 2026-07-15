import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';
import { TaskStore } from '../../data/task.store';
import { TASK_STATUS_OPTIONS, type TaskFormValue, type TaskStatus } from '../../models/task.model';

@Component({
  selector: 'app-task-form-sheet',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    HlmSheetImports,
    HlmFieldImports,
    HlmInputImports,
    HlmTextareaImports,
    HlmSelectImports,
    HlmButtonImports,
  ],
  templateUrl: './task-form-sheet.html',
})
export class TaskFormSheet {
  private readonly store = inject(TaskStore);

  readonly open = input(false);
  readonly taskId = input<string | null>(null);

  readonly saved = output<void>();
  readonly dismissed = output<void>();

  protected readonly statusOptions = TASK_STATUS_OPTIONS;
  protected readonly sheetState = computed(() => (this.open() ? 'open' : 'closed') as 'open' | 'closed');
  protected readonly isEditMode = computed(() => this.taskId() !== null);
  protected readonly heading = computed(() => (this.isEditMode() ? 'Edit task' : 'Create task'));

  protected readonly form = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(120)],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(500)],
    }),
    status: new FormControl<TaskStatus>('todo', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor() {
    effect(() => {
      if (!this.open()) {
        return;
      }

      const id = this.taskId();
      if (id) {
        const task = this.store.getById(id);
        if (task) {
          this.form.reset({
            title: task.title,
            description: task.description,
            status: task.status,
          });
        }
        return;
      }

      this.form.reset({
        title: '',
        description: '',
        status: 'todo',
      });
    });
  }

  protected onSheetStateChanged(state: 'open' | 'closed'): void {
    if (state === 'closed') {
      this.dismissed.emit();
    }
  }

  protected onStatusChange(status: TaskStatus | null | undefined): void {
    if (status) {
      this.form.controls.status.setValue(status);
    }
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue() satisfies TaskFormValue;
    const id = this.taskId();

    if (id) {
      this.store.update(id, value);
    } else {
      this.store.create(value);
    }

    this.saved.emit();
  }
}
