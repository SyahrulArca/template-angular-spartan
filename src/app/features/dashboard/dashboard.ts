import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmPaginationImports } from '@spartan-ng/helm/pagination';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { HlmP } from '@spartan-ng/helm/typography';
import { appToast, type AppToastLocation } from '../../core/components/app-toast';
import { DatatableFilter } from '../../core/components/datatable-filter/datatable-filter';
import { EmptyData } from '../../core/components/empty-data/empty-data';
import { SearchInput } from '../../core/components/search-input/search-input';
import { ConfirmService } from '../../core/services/confirm';
import { AppPageHeader } from '../../layout/app-page-header/app-page-header';
import { INVOICE_PAGE_SIZES, InvoiceStore } from './data/invoice.store';
import { InvoiceFilterDialog } from './ui/invoice-filter-dialog/invoice-filter-dialog';
import { InvoiceLinesForm } from './ui/invoice-lines-form/invoice-lines-form';
import { InvoiceQuickForm } from './ui/invoice-quick-form/invoice-quick-form';
import { InvoiceTable } from './ui/invoice-table/invoice-table';
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
  providers: [InvoiceStore],
  imports: [
    AppPageHeader,
    HlmCardImports,
    HlmButtonImports,
    HlmSpinner,
    HlmP,
    NumberFormat,
    SettingComponent,
    DatatableFilter,
    HlmPaginationImports,
    InvoiceTable,
    InvoiceFilterDialog,
    EmptyData,
    SearchInput,
    InvoiceQuickForm,
    InvoiceLinesForm,
  ],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  private readonly confirm = inject(ConfirmService);
  protected readonly invoices = inject(InvoiceStore);

  protected readonly toastLocations = TOAST_LOCATIONS;
  protected readonly pageSizes = INVOICE_PAGE_SIZES;

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
