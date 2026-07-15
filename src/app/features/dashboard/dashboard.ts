import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { hlmP } from '@spartan-ng/helm/typography';
import { appToast, type AppToastLocation } from '../../core/components/app-toast';
import { ToastDemoAction } from './ui/toast-demo-action/toast-demo-action';

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
  imports: [HlmCardImports, HlmButtonImports, HlmSpinner],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  protected readonly toastLocations = TOAST_LOCATIONS;

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
      type: 'warning',
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
}
