# Manual Change Detection Exercise

In this exercise we will learn how to use the `ChangeDetectorRef` to manually 
inform angular about changes when needed.

> [!NOTICE]
> **REMEMBER** the bug where you have to just _click or hover something_ in the app until your changes are displayed
> on the screen? We are here to solve it now :).

## 1. Fix `MovieListPageComponent`

This time, we are not missing out an NgZone tick, but we need to inform the framework
about a change that needs to get detected.

Go to the `movie-list-page.component.ts`:
* inject `ChangeDetectorRef`
* use `markForCheck` after setting the `movies` value.


<details>
  <summary>cdRef#markForCheck: MovieListPageComponent</summary>

```ts

// movie-list-page.component.ts

import { ChangeDetectorRef } from '@angular/core';

private cdRef = inject(ChangeDetectorRef); // 👈️👈️👈️👈️

constructor() {
  this.activatedRoute.params.subscribe((params) => {
    if (params.category) {
      this.paginate((page) =>
        this.movieService.getMovieList(params.category, page),
      ).subscribe((movies) => {
        this.movies = movies;
        this.cdRef.markForCheck(); // 👈️👈️👈️👈️
      });
    } else {
      this.paginate((page) =>
        this.movieService.getMoviesByGenre(params.id, page),
      ).subscribe((movies) => {
        this.movies = movies;
        this.cdRef.markForCheck(); // 👈️👈️👈️👈️
      });
    }
  });
}


```

</details>

## 2. Fix `TiltDirective`

Also the tilt effect doesn't work again.

Go to the `tilt.directive.component.ts`:
* inject `ChangeDetectorRef`
* use `markForCheck` after setting the `rotate`

<details>
  <summary>markForCheck: TiltDirective</summary>

```ts

// tilt.directive.ts

export class TiltDirective {

  private cdRef = inject(ChangeDetectorRef); // 👈️👈️👈️👈️

  constructor(private elementRef: ElementRef<HTMLElement>) {
    const rotate$ = fromEvent<MouseEvent>(
      this.elementRef.nativeElement,
      'mouseenter',
    ).pipe(map((event) => this.getRotationDegree(event)));

    const reset$ = fromEvent(this.elementRef.nativeElement, 'mouseleave').pipe(
      map(() => this.getDefaultRotation()),
    );

    merge(rotate$, reset$).subscribe((rotate) => {
      this.rotate = rotate;
      this.cdRef.markForCheck(); // 👈️👈️👈️👈️
    });
  }
}

```

</details>
