import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TrackingService {
  trackEvent(event: string) {
    for (let i = 0; i < 10_000_000; i++) {
      const test = `${event}${i % 2 === 0}`;
      // pretend to do work;
    }
  }
}
