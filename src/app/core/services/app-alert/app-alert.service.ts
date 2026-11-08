import { inject, Injectable } from '@angular/core';
import { HlmDialogService } from '@spartan-ng/helm/dialog';
import { map, Observable, take } from 'rxjs';
import { AppAlertDialogComponent } from '../../components/app-alert-dialog/app-alert-dialog.component';
import type {
  AppAlertDialogContext,
  AppAlertOptions,
} from '../../components/app-alert-dialog/app-alert-dialog.types';

@Injectable({
  providedIn: 'root',
})
export class AppAlertService {
  private readonly dialogService = inject(HlmDialogService);

  open(options: AppAlertOptions): Observable<void> {
    const context: Omit<AppAlertDialogContext, 'close'> = {
      type: options.type,
      title: options.title,
      description: options.description,
      confirmLabel: options.confirmLabel ?? 'OK',
    };

    const dialogRef = this.dialogService.open<void, Omit<AppAlertDialogContext, 'close'>>(
      AppAlertDialogComponent,
      {
        context,
        showCloseButton: false,
        contentClass: 'gap-4 border-border/60 shadow-lg sm:max-w-sm',
        closeOnOutsidePointerEvents: true,
      },
    );

    return dialogRef.closed$.pipe(
      take(1),
      map(() => undefined),
    );
  }
}
