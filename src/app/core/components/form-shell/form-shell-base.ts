import { booleanAttribute, Directive, input, output } from '@angular/core';

let nextId = 0;

/** Shared API for form shells. The feature owns `<form [formGroup]>`; the shell only lays it out. */
@Directive({
  host: {
    '[attr.aria-labelledby]': 'titleId',
    '[attr.aria-busy]': 'submitting()',
  },
})
export abstract class FormShellBase {
  readonly title = input.required<string>();
  readonly description = input('');
  readonly submitLabel = input('Simpan');
  readonly cancelLabel = input('Batal');
  /** Disables submit and shows a spinner while saving. */
  readonly submitting = input(false, { transform: booleanAttribute });

  readonly cancelled = output<void>();

  protected readonly titleId = `form-shell-title-${nextId++}`;
}

export const FORM_SHELL_HEADER = `
  <div hlmCardHeader class="border-b">
    <h2 hlmCardTitle class="text-base" [id]="titleId">{{ title() }}</h2>
    @if (description()) {
      <p hlmCardDescription>{{ description() }}</p>
    }
  </div>
`;

export const FORM_SHELL_FOOTER = `
  <div hlmCardFooter class="flex-wrap justify-end gap-2">
    <ng-content select="[formShellFooter]" />
    <button hlmBtn variant="outline" type="button" [disabled]="submitting()" (click)="cancelled.emit()">
      {{ cancelLabel() }}
    </button>
    <button hlmBtn type="submit" [disabled]="submitting()">
      @if (submitting()) {
        <hlm-spinner />
      }
      {{ submitLabel() }}
    </button>
  </div>
`;
