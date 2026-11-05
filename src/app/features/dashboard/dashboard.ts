import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { hlmP } from '@spartan-ng/helm/typography';
import { appToast, type AppToastLocation } from '../../core/components/app-toast';
import { DataTable } from '../../core/components/data-table/data-table';
import {
  DEFAULT_DATE_RANGE_PRESET,
  type DateRange,
  rangeFromPreset,
} from '../../core/constanta/date-range-preset';
import { DateUtil } from '../../core/utils/date.util';
import { ConfirmService } from '../../core/services/confirm';
import { AppPageHeader } from '../../layout/app-page-header/app-page-header';
import { filterInvoices, invoiceRows, type InvoiceStatus } from './invoices.sample';
import { ToastDemoAction } from './ui/toast-demo-action/toast-demo-action';
import { NumberFormat } from '../../core/components/formatter/number-format/number-format';
import { SettingComponent } from '../../core/components/setting/app-setting/app-setting';

const TOAST_LOCATIONS: AppToastLocation[] = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
];

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AppPageHeader,
    HlmCardImports,
    HlmButtonImports,
    HlmSpinner,
    NumberFormat,
    SettingComponent,
    DataTable,
    HlmBadgeImports,
  ],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  private readonly confirm = inject(ConfirmService);

  protected readonly toastLocations = TOAST_LOCATIONS;
  protected readonly DateUtil = DateUtil;

  private readonly invoices = invoiceRows();

  protected readonly invoiceStatus = signal('all');
  protected readonly invoiceRange = signal<DateRange | null>(
    rangeFromPreset(DEFAULT_DATE_RANGE_PRESET),
  );

  protected readonly invoicesInRange = computed(() =>
    filterInvoices(this.invoices, this.invoiceRange(), null),
  );

  protected readonly visibleInvoices = computed(() =>
    filterInvoices(this.invoices, this.invoiceRange(), this.invoiceStatus()),
  );

  protected readonly invoiceStatuses = computed(() => {
    const rows = this.invoicesInRange();
    const count = (status: InvoiceStatus) => rows.filter((row) => row.status === status).length;
    return [
      { value: 'all', label: 'All', count: rows.length },
      { value: 'unpaid', label: 'Unpaid', count: count('unpaid') },
      { value: 'draft', label: 'Draft', count: count('draft') },
      { value: 'past_due', label: 'Past due', count: count('past_due') },
      { value: 'paid', label: 'Paid', count: count('paid') },
    ];
  });

  protected statusLabel(status: InvoiceStatus): string {
    if (status === 'past_due') return 'Past due';
    if (status === 'unpaid') return 'Unpaid';
    if (status === 'draft') return 'Draft';
    return 'Paid';
  }

  protected statusVariant(
    status: InvoiceStatus,
  ): 'default' | 'secondary' | 'destructive' | 'outline' {
    if (status === 'paid') return 'default';
    if (status === 'past_due') return 'destructive';
    if (status === 'draft') return 'secondary';
    return 'outline';
  }

  protected showSuccess(): void {
    appToast({
      type: 'success',
      title: 'Item deleted successfully.',
    });
  }

  protected showInfo(): void {
    appToast({
      type: 'info',
      title: 'System is updating new features.',
    });
  }

  protected showWarning(): void {
    appToast({
      type: 'warning',
      title: 'This action cannot be undone.',
    });
  }

  protected showError(): void {
    appToast({
      type: 'error',
      title: 'Operation is irreversible.',
    });
  }

  protected showWithDescription(): void {
    appToast({
      type: 'success',
      title: 'Template is ready',
      description: 'Spartan components are wired and working.',
    });
  }

  protected showWithAction(): void {
    appToast({
      type: 'success',
      title: 'Task will be deleted',
      description: 'You can still undo this action.',
      action: ToastDemoAction,
    });
  }

  protected showAtLocation(location: AppToastLocation): void {
    appToast({
      type: 'info',
      title: `Toast at ${location}`,
      description: 'Position is controlled via the location option.',
      location,
    });
  }

  protected openDefaultConfirm(): void {
    this.confirm
      .open({
        title: 'Simpan perubahan?',
        description: 'Perubahan akan diterapkan ke data lokal.',
      })
      .subscribe((confirmed) => {
        appToast({
          type: confirmed ? 'success' : 'info',
          title: confirmed ? 'Perubahan disimpan.' : 'Dibatalkan.',
        });
      });
  }

  protected openDestructiveConfirm(): void {
    this.confirm
      .open({
        title: 'Hapus item?',
        description: 'Tindakan ini tidak dapat dibatalkan.',
        confirmLabel: 'Hapus',
        variant: 'destructive',
      })
      .subscribe((confirmed) => {
        if (confirmed) {
          appToast({ type: 'success', title: 'Item dihapus.' });
        }
      });
  }
}
