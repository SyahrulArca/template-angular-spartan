import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { SearchInput } from '../../../../core/components/search-input/search-input';
import { InvoiceStore } from '../../data/invoice.store';

@Component({
  selector: 'app-invoice-filter-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmDialogImports, HlmButtonImports, HlmFieldImports, SearchInput],
  templateUrl: './invoice-filter-dialog.html',
})
export class InvoiceFilterDialog {
  protected readonly store = inject(InvoiceStore);
}
