import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-number-format-toggle',
  imports: [],
  template: ` <p>number-format-toggle works!</p> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NumberFormatToggle {}
