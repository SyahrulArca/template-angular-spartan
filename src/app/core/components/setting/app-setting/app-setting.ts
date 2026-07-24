import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import {
  templateFormatNumber,
  negativeNumberBehavior
} from '../../../constanta/number-template';
import { NumberFormatContextService } from '../../../services/number.service';

@Component({
  selector: 'app-setting',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmFieldImports, HlmSelectImports],
  template: `
    <div class="flex items-center gap-4 p-2">
      <!-- Number Format Select -->
      <div hlmField class="w-64">
        <label hlmFieldLabel for="setting-number-format">Number Format</label>
        <hlm-select
          id="setting-number-format"
          [value]="selectedFormatKey()"
          (valueChange)="onFormatChange($event)"
        >
          <hlm-select-trigger class="w-full">
            <hlm-select-value />
          </hlm-select-trigger>
          <hlm-select-content *hlmSelectPortal class="w-full min-w-(--radix-select-trigger-width)">
            @for (item of formatOptions; track item.key) {
              <hlm-select-item [value]="item.key">{{ item.name }}</hlm-select-item>
            }
          </hlm-select-content>
        </hlm-select>
      </div>

      <!-- Negative Behavior Select -->
      <div hlmField class="w-64">
        <label hlmFieldLabel for="setting-negative-behavior">Negative Number Behavior</label>
        <hlm-select
          id="setting-negative-behavior"
          [value]="selectedNegativeKey()"
          (valueChange)="onNegativeChange($event)"
        >
          <hlm-select-trigger class="w-full">
            <hlm-select-value />
          </hlm-select-trigger>
          <hlm-select-content *hlmSelectPortal class="w-full min-w-(--radix-select-trigger-width)">
            @for (item of negativeOptions; track item.key) {
              <hlm-select-item [value]="item.key">{{ item.name }}</hlm-select-item>
            }
          </hlm-select-content>
        </hlm-select>
      </div>
    </div>
  `,
})
export class SettingComponent {
  protected readonly numberService = inject(NumberFormatContextService);
  protected readonly formatOptions = templateFormatNumber;
  protected readonly negativeOptions = negativeNumberBehavior;

  // 💡 Computed Signals agar reaktif & dibaca langsung dari state Service (termasuk localStorage)
  protected readonly selectedFormatKey = computed(() => this.numberService.format().key);
  protected readonly selectedNegativeKey = computed(() => this.numberService.negativeBehavior().key);

  onFormatChange(value: string | null | undefined): void {
    if (!value) return;
    this.numberService.setFormat(value);
  }

  onNegativeChange(value: string | null | undefined): void {
    if (!value) return;
    this.numberService.setNegativeBehavior(value);
  }
}
