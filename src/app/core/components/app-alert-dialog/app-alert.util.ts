import { AppAlertService } from '../../services/app-alert/app-alert.service';
import type { AppAlertOptions } from './app-alert-dialog.types';

let alertService: AppAlertService | null = null;

/** Called once from app bootstrap so appAlert() works outside an injection context (e.g. click handlers). */
export function bindAppAlertService(service: AppAlertService): void {
  alertService = service;
}

export function appAlert(options: AppAlertOptions): void {
  if (!alertService) {
    throw new Error('appAlert: AppAlertService not initialized (missing app bootstrap binding).');
  }
  alertService.open(options).subscribe();
}
