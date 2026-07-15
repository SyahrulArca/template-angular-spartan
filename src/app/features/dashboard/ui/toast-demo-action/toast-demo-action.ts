import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-toast-demo-action',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmButtonImports],
  template: `
    <div class="flex gap-2">
      <button hlmBtn variant="outline" size="sm" type="button" (click)="dismiss()">Undo</button>
      <button hlmBtn variant="default" size="sm" type="button" (click)="dismiss()">Process</button>
    </div>
  `,
})
export class ToastDemoAction {
  protected dismiss(): void {
    toast.dismiss();
  }
}
