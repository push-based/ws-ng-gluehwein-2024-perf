import { inject, Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { rxState } from '@rx-angular/state';
import { rxActions } from '@rx-angular/state/actions';
import { exhaustMap, Observable, scan, startWith } from 'rxjs';

import { TMDBMovieModel } from '../shared/model/movie.model';
import { MovieService } from './movie.service';

@Injectable({ providedIn: 'root' })
export class MovieStore {
  // services

  private movieService = inject(MovieService);

  // actions

  actions = rxActions<{
    loadMovies: Params;
    paginate: void;
    toggleFavorite: TMDBMovieModel;
  }>();

  // state
  state = rxState<{
    favoriteIds: Set<string>;
    favoritesLoading: Set<string>;
    movies: any /*Suspensify<TMDBMovieModel[]>*/;
  }>(({ connect, get, set }) => {
    set({
      favoriteIds: new Set<string>(),
      favoritesLoading: new Set<string>(),
    });
    // connect('movies')
    // connect('favoriteIds')
    // connect(toggleFavorite$)
  });

  // selections & derived state

  // movies$ = this.state.select('movies');

  private paginate(
    requestFn: (page: number) => Observable<TMDBMovieModel[]>,
  ): Observable<TMDBMovieModel[]> {
    return this.actions.paginate$.pipe(
      startWith(void 0),
      exhaustMap((v, i) => requestFn(i + 1)),
      scan(
        (allMovies, movies) => [...allMovies, ...movies],
        [] as TMDBMovieModel[],
      ),
    );
  }
}
