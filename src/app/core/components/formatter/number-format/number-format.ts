import { ChangeDetectionStrategy, Component, Input, computed, inject } from '@angular/core';
import { TemplateFormatNumber } from '../../../constanta/number-template';
import { NumberFormatContextService } from '../../../services/number.service';

@Component({
  selector: 'app-number-format',
  standalone: true,
  imports: [],
  template: `<span [class]="computedClass()">{{ formattedValue() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NumberFormat {
  private readonly formatContext = inject(NumberFormatContextService);

  @Input() value: number = 0;
  @Input() format?: string | TemplateFormatNumber;
  @Input() negativeBehavior?: string; // Boleh override per komponen kalau mau
  @Input() class: string = '';
  @Input() withDecimal: boolean = false;
  @Input() prefix: string = '';
  @Input() suffix: string = '';
  @Input() isFontMono: boolean = true;

  private readonly formattedResult = computed(() => {
    return this.formatContext.formatNumber(
      this.value,
      this.format,
      this.withDecimal,
      this.negativeBehavior
    );
  });

  protected readonly formattedValue = computed(() => {
    const { formattedText } = this.formattedResult();
    return `${this.prefix}${formattedText}${this.suffix}`;
  });

  protected readonly computedClass = computed(() => {
    const monoClass = this.isFontMono ? 'font-mono' : '';
    const dynamicColorClass = this.formattedResult().colorClass;

    return `${monoClass} ${this.class} ${dynamicColorClass}`.trim().replace(/\s+/g, ' ');
  });
}
