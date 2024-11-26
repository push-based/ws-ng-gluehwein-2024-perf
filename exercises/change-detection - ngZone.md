# ChangeDetectionStrategy NgZone exercises

In this exercise we will focus on advanced runtime optimizations in angular applications by using our knowledge about
the `ChangeDetection` system and `NgZone` in angular.

## Goal

The goal of this exercise is to give you a deeper understanding of the `ChangeDetection` system in angular and how it
is connected to `NgZone`. We will learn how to optimize our applications runtime performance by using advanced techniques
to minimize the `ChangeDetection` cycles of our application.

## TiltDirective

If not already the case, insert the `dirty-checks` component into the `MovieCardComponent`s template.

<details>
  <summary>MovieCardComponent</summary>

```html
<!--movie-card.component.html-->

<div class="movie-card"
     [tilt]="40">
  <dirty-check />
  <!--  the template-->
</div>

```

</details>

Taking a look at the dirty-check counter in the `MovieCardComponent` when interacting with the `tilt` directive reveals
potential for optimization here.

For the sake of better visual feedback (and dx for this exercise), please turn off `ChangeDetectionStrategy.OnPush` in the `AppComponent`

<details>
  <summary>AppComponent Cd Default</summary>

```ts
// app.component.ts

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
```
</details>

Interact with the `tilt` directive. Note how the complete chain of components until `app-root` is getting dirty-checked
just in order to set a style on a div.

This has two reasons:
* `@HostListener`s are natively wrapped with `wrapListenerIn_markDirtyAndPreventDefault`, causing all components up the tree getting dirty marked
* `NgZone` has patched the event listener and causes the `ApplicationRef` to `tick`

In the next two exercises we will improve both of those issues. Let's start with refactoring the of the `TiltDirective`.

### No Dirty Marking

Let's try to get rid of the parent dirty marking when interacting with the `TiltDirective`.
We want to use our `rxjs` knowledge in order to streamline the event handling.

Taking a look at the current implementation, reveals we need to `merge` two streams and combine them to a single side effect
managing the state change of our `nativeElement`.

**Component setup**

Start with injecting the `ElementRef` into the directives' constructor.
Also setup lifecycle hooks for `ngOnDestroy` and `ngOnInit`.
Finally, create a `destroy$: Subject<void>` in order to maintain the subscription we will open.

<details>
  <summary>solution: Component setup</summary>


```ts
// tilt.directive.ts

private destroy$ = new Subject<void>;

constructor(
        private readonly elementRef: ElementRef<HTMLElement>
) {}

ngOnInit() {
    // this is where we are going to work now
}

ngOnDestroy() {
  this.destroy$.next();
}

```
</details>


Now let's re-implement the current logic bit by bit into single streams.
We want to create a stream for each `HostListener`. Instead of setting a global `this.rotation` variable, the stream
should return a string resembling the wanted style for the `transform` property. (e.g. `rotate(0deg)` for `mouseleave`).

**Streams**

* `rotate$` => `fromEvent(..., 'mouseenter')`
  * apply mapping from `HostListener` to an rxjs
  * `map` => `rotate(${this.rotationDegree}deg)`
* `reset$` => `fromEvent(..., 'mouseenter')`
  * `map` => `rotate(0deg)`

**Side Effect**

The side effect is the actual manipulation of the `style.transform` property of our `nativeElement`. We need to mimic
the `@HostBinding` to `style.transform` and implement it on our own: `(rotation: string) => nativeElement.style.transform = rotation`.

useful links:
* [fromEvent](https://rxjs.dev/api/index/function/fromEvent)
* [merge](https://rxjs.dev/api/index/function/merge)
* [map](https://rxjs.dev/api/index/function/map)


<details>
  <summary>Streams</summary>

Get rotation value from `mouseenter` event:

```ts
// tilt.directive.ts

ngOnInit() {
    // rotation value on mouse enter
  const rotate$ = fromEvent<MouseEvent>(this.elementRef.nativeElement, 'mouseenter')
        .pipe(
                map(({ pageX, target }) => {
                  const pos = determineDirection(pageX, target as HTMLElement);

                  return pos === 0
                         ? `rotate(${this.rotationDegree}deg)`
                         : `rotate(-${this.rotationDegree}deg)`;
                })
        );
}

```

reset rotation value on mouseleave event:

```ts
// tilt.directive.ts

import { fromEvent, map, takeUntil } from 'rxjs';


ngOnInit() {
  // reset rotatipon on mouseleave
  const reset$ =  fromEvent(this.elementRef.nativeElement, 'mouseleave').pipe(
          map(() => `rotate(0deg)`)
  );
}

```

</details>

<details>
  <summary>side effect</summary>

```ts
// tilt.directive.ts

import { fromEvent, map, takeUntil } from 'rxjs';


ngOnInit() {
    // create a sideEffect function for setting the rotation value to the element
  const effect = (rotation: string) => this.elementRef.nativeElement.style.transform = rotation;
}

```

</details>

<details>
  <summary>merge & subscribe</summary>

```ts
// tilt.directive.ts

import { fromEvent, map, takeUntil } from 'rxjs';


ngOnInit() {
  // merge the transformation values to a single stream and perform the effect on the result
  // subscribe until destruction of the directive
  merge(
          rotate$,
          reset$
  )
          .pipe(takeUntil(this.destroy$))
          .subscribe(effect);
}

```

</details>

Great, now don't forget to delete (or comment out) the `@HostListener` & `@HostBinding` callbacks and serve the application.
You should note that the `dirty-check` counter of the `AppComponent` still increases, the `MovieCardComponent` doesn't.

Excellent, the first part of our performance improvement was successful. Let's try to not involve our `AppComponent` anymore
and head to the next exercise.

### No NgZone, No ChangeDetection :-)

In this task we want to avoid interacting with `NgZone` in order to not trigger any `ChangeDetection` cycle whatsoever.
Keep in mind, we only want to set a style to a div. We don't need angular to re-render the whole application.

If you want to have a really simple task, it can be done with a one liner: change the `fromEvent` import to `rxjs-zone-less`.

In case it is not installed, please do it with the following command:

```bash
npm install rxjs-zone-less --save
```

<details>
  <summary>unpatched fromEvent</summary>

```ts
// tilt.directive.ts

import { fromEvent } from 'rxjs-zone-less';

```

</details>

Serve the application, and interact with the `TiltDirective`. You should note that the `AppComponent` isn't dirty checked anymore,
although it is configured with `ChangeDetectionStrategy.Default`.

Congratulations :-)

### Bonus: try `NgZone#runOutsideAngular`

There are other approaches on how to get rid of `NgZone`. The strategy of `rx-angular` is to use the original (unpatched)
versions of the browsers' API.
But `NgZone` is also a `Service` which you can `inject` into your component, offering methods to interact with `zone.js`.

useful links:
* [API: NgZone](https://angular.io/api/core/NgZone)
* [Guide: NgZone](https://angular.io/guide/zone)
* [Blog Post](https://blog.thoughtram.io/angular/2017/02/21/using-zones-in-angular-for-better-performance.html)

Your task is to inject `NgZone` into the `TiltDirective` and try with the help of the `NgZone` service to avoid
ticking the `AppRef`.
To make sure you are doing right, use the original version of `fromEvent` again and observe the `AppComponent`s counter.
