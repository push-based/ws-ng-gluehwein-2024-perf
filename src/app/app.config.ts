import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFastSVG } from '@push-based/ngx-fast-svg';

import { routes } from './app.routes';
import { readAccessInterceptor } from './read-access.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch(), withInterceptors([readAccessInterceptor])),
    provideRouter(routes),
    provideFastSVG({
      url: (name: string) => `assets/svg-icons/${name}.svg`,
      defaultSize: '12',
    }),
    // provideClientHydration(withEventReplay()),
  ],
};
