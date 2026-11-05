import { ChangeDetectionStrategy, Component, effect, input, model } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch, lucideX } from '@ng-icons/lucide';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { debounce, distinctUntilChanged, timer } from 'rxjs';

@Component({
  selector: 'app-search-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, NgIcon, HlmInputGroupImports],
  providers: [provideIcons({ lucideSearch, lucideX })],
  template: `
    <div hlmInputGroup>
      <div hlmInputGroupAddon>
        <ng-icon name="lucideSearch" />
      </div>
      <input
        hlmInputGroupInput
        type="text"
        [attr.id]="inputId()"
        [placeholder]="placeholder()"
        [attr.aria-label]="label()"
        [formControl]="control"
      />
      @if (control.value) {
        <div hlmInputGroupAddon align="inline-end">
          <button hlmInputGroupButton size="icon-xs" aria-label="Hapus pencarian" (click)="clear()">
            <ng-icon name="lucideX" />
          </button>
        </div>
      }
    </div>
  `,
})
export class SearchInput {
  /** Debounced: only updates after the user stops typing for `debounceMs`. */
  readonly value = model('');
  readonly placeholder = input('Cari...');
  readonly label = input('Cari');
  readonly inputId = input<string | null>(null);
  readonly debounceMs = input(300);

  protected readonly control = new FormControl('', { nonNullable: true });

  constructor() {
    this.control.valueChanges
      .pipe(
        debounce(() => timer(this.debounceMs())),
        distinctUntilChanged(),
        takeUntilDestroyed(),
      )
      .subscribe((value) => this.value.set(value));

    effect(() => {
      const value = this.value();
      if (value !== this.control.value) this.control.setValue(value, { emitEvent: false });
    });
  }

  protected clear(): void {
    this.control.setValue('');
    this.value.set('');
  }
}
