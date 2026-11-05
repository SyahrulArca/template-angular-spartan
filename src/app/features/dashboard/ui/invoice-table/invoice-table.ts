import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { NumberFormat } from '../../../../core/components/formatter/number-format/number-format';
import { DateUtil } from '../../../../core/utils/date.util';
import {
  INVOICE_STATUS_LABELS,
  INVOICE_STATUS_VARIANTS,
  type Invoice,
} from '../../models/invoice.model';

@Component({
  selector: 'app-invoice-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmBadgeImports, NumberFormat],
  templateUrl: './invoice-table.html',
})
export class InvoiceTable {
  readonly invoices = input<Invoice[]>([]);

  protected readonly statusLabels = INVOICE_STATUS_LABELS;
  protected readonly statusVariants = INVOICE_STATUS_VARIANTS;

  protected formatDate(date: Date | null): string {
    return date
      ? DateUtil.formatDate(date, 'id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
      : '—';
  }
}
