import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AppShellComponent } from './app-shell/app-shell.component';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, AppShellComponent],
    template: `
    <app-shell>
      <router-outlet />
    </app-shell>
  `
})
export class AppComponent {}
