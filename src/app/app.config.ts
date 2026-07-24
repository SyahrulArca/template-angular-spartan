import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideSpartanHlm } from '@spartan-ng/helm/utils';
import { firstValueFrom } from 'rxjs';

import { routes } from './app.routes';
import { AuthService, authInterceptor } from './core/auth';
import { apiInterceptor } from './core/services/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideSpartanHlm(),
    provideHttpClient(withInterceptors([apiInterceptor, authInterceptor])),
    provideAppInitializer(() => {
      const auth = inject(AuthService);
      return firstValueFrom(auth.bootstrapSession());
    }),
  ],
};
