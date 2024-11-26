import { Directive, ElementRef, inject, NgZone, output } from '@angular/core';
import { filter, fromEvent, map } from 'rxjs';

@Directive({
  selector: '[elementVisible]',
  standalone: true,
})
export class ElementVisibilityDirective {
  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  // TODO(template): remove the zone.runOutsideAngular for 2 day workshop :)
  private zone = inject(NgZone);

  elementVisible = output();

  constructor() {
    // TODO(template): remove the zone.runOutsideAngular for 2 day workshop :)
    this.zone.runOutsideAngular(() => {
      fromEvent(document, 'scroll')
        .pipe(
          filter(() => !!document.scrollingElement),
          map(() => {
            const { scrollTop, clientHeight } = document.scrollingElement!;
            return (
              scrollTop + clientHeight + 100 >=
              this.elementRef.nativeElement.offsetTop
            );
          }),
          filter(Boolean),
        )
        .subscribe(() => {
          // TODO(template): remove the zone.run for 2 day workshop :)
          this.zone.run(() => {
            this.elementVisible.emit();
          });
        });
    });
  }
}
