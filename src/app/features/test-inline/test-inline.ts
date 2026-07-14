import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-test-inline',
  imports: [],
  template: ` <p>test-inline works!</p> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestInline {}
