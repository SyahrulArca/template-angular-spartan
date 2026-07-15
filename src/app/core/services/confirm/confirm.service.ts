import { inject, Injectable } from '@angular/core';
import { HlmDialogService } from '@spartan-ng/helm/dialog';
import { map, Observable, take } from 'rxjs';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import type { ConfirmDialogContext, ConfirmOptions } from '../../components/confirm-dialog/confirm-dialog.types';

@Injectable({
  providedIn: 'root',
})
export class ConfirmService {
  private readonly dialogService = inject(HlmDialogService);

  open(options: ConfirmOptions): Observable<boolean> {
    const context: Omit<ConfirmDialogContext, 'close'> = {
      title: options.title,
      description: options.description,
      confirmLabel: options.confirmLabel ?? 'Konfirmasi',
      cancelLabel: options.cancelLabel ?? 'Batal',
      variant: options.variant ?? 'default',
    };

    const dialogRef = this.dialogService.open<boolean, Omit<ConfirmDialogContext, 'close'>>(ConfirmDialogComponent, {
      context,
      showCloseButton: false,
      contentClass: 'gap-0 border-border/60 shadow-lg sm:max-w-md',
      closeOnOutsidePointerEvents: true,
    });

    return dialogRef.closed$.pipe(
      take(1),
      map((result) => result === true),
    );
  }
}
