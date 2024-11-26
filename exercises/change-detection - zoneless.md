# ChangeDetection - Going zoneless Exercise

In this exercise you'll get to know how to finally be able to officially remove zone.js from your application.

## Provide no-op zone & ChangeDetection

As a first step, let's use the ready2use defaults, by adding `provideExperimentalZonelessChangeDetection` to the providers
array in your `appConfig`.

For this, open the `app.config.ts` file located in the apps root folder.

```ts
// app.config.ts
import { ApplicationConfig, provideExperimentalZonelessChangeDetection /* 👈️ add this */ } from '@angular/core';


export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([readAccessInterceptor])
    ),
    provideRouter(routes),
    provideFastSVG({
      url: (name: string) => `assets/svg-icons/${name}.svg`,
      defaultSize: '12',
    }),
    provideExperimentalZonelessChangeDetection() // 👈️ add this
  ]
};
```

As a next step we need to remove the `zone.js` polyfills, otherwise all browser APIs are still being 
monkeypatched.

Remove the polyfills section in the angular.json file:

```diff
// angular.json

-"polyfills": [
-  "zone.js"
-],
```

[OPTIONAL] Delete the dependency to zone.js from package.json

```bash
npm uninstall zone.js
```

GREAT!!! Enjoy your application without zone.js. Make sure everything is still running as it should.


<details>
  <summary>Flamecharts before and after zoneless</summary>

### Before zoneless

zone.js will have all those: 

globalZoneAwareCallback, onInvokeTask, onHasTask, runTask, scheduleTask,
run, invoke, onInvoke, invoke and then `tick` method.

![before-zoneless.png](images/change-detection/before-zoneless.png)

### After zoneless

Without zone.js, Angular will schedule change detection using either `setTimeout` or `requestAnimationFrame`.

This makes it easier to test and debug your application using flamecharts.

![after-zoneless-flamechart.png](images/change-detection/after-zoneless-flamechart.png)

</details>



## [OPTIONAL] Provide custom change detection scheduler

Under the hood, we've replaced `NgZone` with a custom ChangeDetectionScheduler which is triggered
by the framework itself. It is responsible to kick off the global change detection by
calling the `appRef.tick()` method.

**1. Create a custom change detection scheduler**

Create a new file with a class that extends from `ChangeDetectionScheduler`.

For convenience, alias the import, as it contains the `ɵ` symbol.

```ts
import { ɵChangeDetectionScheduler as ChangeDetectionScheduler } from '@angular/core';
```

The above interface only forces you to implement a `notify` function. This function determines as a trigger
to start the scheduling process which leads to change detection.

In best case this process uses an `exhaust`-like behavior, as we don't want to overrun change detection.

In order to dispatch change detection, you need to call the `tick()` method on the `ApplicationRef`.
Please inject the `ApplicationRef` into your class, e.g.


```ts
#appRef = inject(ApplicationRef);
```

You'll find a ready to go implementation below, but you may also want to implement your own custom version.
Do as you like!

<details>
  <summary>An rxjs based setTimeout implementation</summary>

```ts
import {
  ApplicationRef,
  ɵChangeDetectionScheduler as ChangeDetectionScheduler,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { exhaustMap, Subject, tap, timer } from 'rxjs';

export class CustomChangeDetectionScheduler
  implements ChangeDetectionScheduler
{
  private notify$ = new Subject<void>();
  #appRef = inject(ApplicationRef);

  constructor() {
    this.notify$.pipe(
      exhaustMap(() => timer(0).pipe(
        tap(() => this.#appRef.tick()))
      ),
      takeUntilDestroyed()
    ).subscribe();
  }

  notify(): void {
    this.notify$.next();
  }
}

```

</details>


**2. Provide your custom scheduler**

Open the `app.config.ts` and add your `CustomChangeDetectionScheduler` to the providers array.

```ts
// app.config.ts

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([readAccessInterceptor])
    ),
    provideRouter(routes),
    provideFastSVG({
      url: (name: string) => `assets/svg-icons/${name}.svg`,
      defaultSize: '12',
    }),
    provideExperimentalZonelessChangeDetection(),
    { provide: ɵChangeDetectionScheduler, useClass: CustomChangeDetectionScheduler } // 👈️ add this
  ]
};
```

Now play around with your custom implementation :)
