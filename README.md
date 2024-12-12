# Push-Based Angular Performance Workshop

## Installation Instructions

**System Requirements**

* `node > 20`
* `npm > 8`

**Clone and install**

```bash
git clone https://github.com/push-based/ws-ng-be-2024-perf.git

cd ws-ng-be-2024-perf
npm install

# (optional) if the step before didn't work, please try the following
npm install --force
```

**Run the application**

```bash
npm run start
```

## Workshop Information

* [ws info doc](https://docs.google.com/document/d/1v1FV9fvuFrvXzMviWfS2hR1vvTOtnPvWuZWM3TXCJPY/edit?usp=drive_link)
* [slides](https://drive.google.com/drive/folders/1NmWQJaJd4txpjWr1C8VBUf-pk6rRznAv?usp=sharing)

## Exercises

[0. Project Setup](./exercises/project%20setup.md)

* [Tooling: Performance Analysis & Flame Charts](./exercises/performance-tab-flame-charts.md)
* [Tooling: JS Event Loop](./exercises/event-loop.md)
* [INP: Scheduling - chunk work](./exercises/scheduling-chunk-work.md)
* [Network: Preload & Prefetch](./exercises/network-resource-hints-preload-prefetch.md)
* [Network: Lazy Loading Resources](./exercises/network-lazy-loading.md)
* [Network: Image Optimizations](./exercises/ng-optimized-images.md)
* [SSR: Setup & Gotchas](exercises/ssr%20-%20setup%20%26%20gotchas.md)
* [SSR: Caching & Server Timing](exercises/ssr-simple-caching-and-server-timing.md)
* [SSR: Server Routes Configuration](exercises/ssr-server-routes-config.md)
* [CSS: Forced Reflow ResizeObserver](./exercises/css%20-%20resizeobserver.md)
* [CSS: Compositor Animations](./exercises/css%20-%20compositor-only-animations.md)
* [CSS: contain](./exercises/css%20-%20containment.md)
* [CSS: content-visibility](./exercises/css%20-%20content-visibility.md)

### Optional

* [Change Detection: Dirty Check](./exercises/change-detection%20-%20Dirty%20Check.md)
* [Change Detection: OnPush](./exercises/change-detection%20-%20OnPush.md)
* [Change Detection: Manual Change Detection](./exercises/change-detection%20-%20manual%20cd.md)
* [Change Detection: signals](./exercises/change-detection%20-%20signals.md)
* [Change Detection: zoneless](./exercises/change-detection%20-%20zoneless.md)

