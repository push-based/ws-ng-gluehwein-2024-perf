import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';

import { TMDBMovieModel } from '../../shared/model/movie.model';
import { MovieCardComponent } from '../movie-card/movie-card.component';

@Component({
    selector: 'movie-list',
    imports: [MovieCardComponent, FastSvgComponent, RouterLink],
    template: `
    @for (movie of movies(); track movie.id) {
      <movie-card
        [index]="$index"
        [routerLink]="['/movie', movie.id]"
        [loading]="favoritesLoading().has(movie.id)"
        [favorite]="favoriteMovieIds().has(movie.id)"
        (favoriteChange)="favoriteToggled.emit(movie)"
        [movie]="movie"
      />
    } @empty {
      <div class="no-movies">
        <fast-svg name="sad" size="50" />
        There are no movies to show
      </div>
    }
  `,
    styles: `
    :host {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(10rem, 35rem));
      gap: 4rem 2rem;
      place-content: space-between space-evenly;
      align-items: start;
      position: relative;
    }
  `
})
export class MovieListComponent {
  movies = input.required<TMDBMovieModel[]>();
  favoriteMovieIds = input<Set<string>>(new Set<string>([]));
  favoritesLoading = input(new Set<string>());

  favoriteToggled = output<TMDBMovieModel>();
}
