# Network: Cancel In-Flight Requests

## Improve fetch movies with switchMap

Currently, data fetching is being made with nested subscriptions. Nested subscriptions are hard to read and always are solvable with one of the higher order observable operators.
In our case, as we are handling data fetching on navigation, `switchMap` is the tool of choice.

First, validate the initial state. Navigate back-and-forth between different categories of movies and observe the network tab by filtering for `xhr` requests.
You should see 1 newly added request per route switch. If you also add network throttling to it & disable cache, you will notice that all requests are processed, regardless
if the results are used or not.

![requests-not-cancelled.png](../images/requests-not-cancelled.png)

As a first step, refactor the currently nested subscriptions in the `MovieListPageComponent` to a single stream by using the `switchMap` operator.

<details>
  <summary>MovieListPageComponent refactor nested subscriptions</summary>

```ts

// movie-list-page.component.ts

 this.activatedRoute.params.pipe(
     switchMap(params => {
       if (params['category']) {
         return this.paginate(page => this.movieService.getMovieList(params['category'], page));
       } else {
         return this.paginate(page => this.movieService.getMoviesByGenre(params['id'], page));
       }
    })
 ).subscribe(movies => this.movies = movies);

```

</details>

Cool, run your application and repeat the process from before. You should see that requests that are inflight and not needed, get properly aborted.

![cancelled-requests.png](../images/cancelled-requests.png)
