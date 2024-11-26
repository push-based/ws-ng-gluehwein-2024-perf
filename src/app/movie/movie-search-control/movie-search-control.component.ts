import { AsyncPipe, NgFor } from '@angular/common';
import { AfterViewInit, Component, ElementRef, viewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { of, Subject, switchMap } from 'rxjs';

import { MovieService } from '../movie.service';
import { MovieImagePipe } from '../movie-image.pipe';
import { MovieModel } from '../movie-model';

@Component({
    selector: 'app-movie-search-control',
    template: `
    <input
      #searchInput
      (blur)="onTouched()"
      (input)="searchTerm$.next(searchInput.value)"
    />
    @if (movies$ | async; as movies) {
      <div class="results">
        <button
          class="movie-result"
          (click)="selectMovie(movie)"
          *ngFor="let movie of movies"
        >
          <img
            [src]="movie.poster_path | movieImage"
            width="35"
            [alt]="movie.title"
          />
          <span>{{ movie.title }}</span>
        </button>
      </div>
    }
  `,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: MovieSearchControlComponent,
            multi: true,
        },
    ],
    styles: `
    :host {
      display: block;
    }

    .results {
      width: 100%;
      display: flex;
      flex-direction: column;
      max-height: 350px;
      overflow: auto;
    }

    .movie-result {
      display: flex;
      align-items: center;
      padding: 0.5rem 1rem;
    }
  `,
    imports: [NgFor, AsyncPipe, MovieImagePipe]
})
export class MovieSearchControlComponent
  implements ControlValueAccessor, AfterViewInit
{
  searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  readonly searchTerm$ = new Subject<string>();

  movies$ = this.searchTerm$.pipe(
    switchMap((term) =>
      term ? this.movieService.searchMovies(term) : of(null),
    ),
  );

  onChange = (movie: MovieModel) => {};
  onTouched = () => {};

  private movieCache!: MovieModel;

  constructor(private movieService: MovieService) {}

  ngAfterViewInit(): void {
    if (this.movieCache) {
      this.searchInput()!.nativeElement.value = this.movieCache.title;
    }
  }

  selectMovie(movie: MovieModel) {
    this.onChange(movie);
    this.searchTerm$.next('');
    this.searchInput()!.nativeElement.value = movie.title;
  }

  writeValue(movie: MovieModel): void {
    if (!this.searchInput()) {
      this.movieCache = movie;
    } else {
      this.searchInput()!.nativeElement.value = movie ? movie.title : '';
    }
    this.searchTerm$.next('');
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {}
}
