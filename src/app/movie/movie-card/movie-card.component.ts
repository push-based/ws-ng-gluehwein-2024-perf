import { UpperCasePipe } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  inject,
  input,
  output,
} from '@angular/core';
import { fromEvent } from 'rxjs';

import { TMDBMovieModel } from '../../shared/model/movie.model';
import { TiltDirective } from '../../shared/tilt.directive';
import { StarRatingComponent } from '../../ui/pattern/star-rating/star-rating.component';
import { MovieImagePipe } from '../movie-image.pipe';

@Component({
    selector: 'movie-card',
    imports: [StarRatingComponent, TiltDirective, UpperCasePipe, MovieImagePipe],
    template: `
    <div class="movie-card">
      <img
        tilt
        [tiltDegree]="5"
        class="movie-image"
        [alt]="movie().title"
        [src]="movie().poster_path | movieImage: 780"
      />
      <div class="movie-card-content">
        <div class="movie-card-title">{{ movie().title | uppercase }}</div>
        <div class="movie-card-rating">
          <ui-star-rating [rating]="movie().vote_average" />
        </div>
      </div>
      <button
        class="favorite-indicator"
        [class.loading]="loading()"
        [class.is-favorite]="favorite()"
        (click)="
          $event.stopPropagation(); $event.preventDefault(); toggleFavorite()
        "
      >
        @if (favorite()) {
          I like it
        } @else {
          Please like me
        }
      </button>
      @for (item of workItems(); track $index) {
        <div></div>
      }
    </div>
  `,
    styles: `
    .movie-card {
      transition: box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1) 0s;
      transform-origin: bottom;
    }

    :host.movie-card--hover {
      .movie-card {
        .movie-image {
          transform: scale(1);
          font-size: 20px;
        }

        box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.6);
      }
    }

    .movie-image {
      display: block;
      width: 100%;
      height: auto;
      transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1) 0s;
      transform: scale(0.97);
    }

    .movie-card-content {
      text-align: center;
      padding: 1.5rem 3rem;
      font-size: 1.5rem;
    }

    .movie-card-title {
      font-size: 2rem;
    }
  `
})
export class MovieCardComponent {
  index = input.required<number>();
  work = input(250);
  workItems = computed(() => new Array(this.work()).fill(null));

  movie = input.required<TMDBMovieModel>();
  loading = input(false);

  favorite = input(false);
  favoriteChange = output<boolean>();

  elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    fromEvent(this.elementRef.nativeElement, 'mouseenter').subscribe(() => {
      this.elementRef.nativeElement.classList.add('movie-card--hover');
    });

    fromEvent(this.elementRef.nativeElement, 'mouseleave').subscribe(() => {
      this.elementRef.nativeElement.classList.remove('movie-card--hover');
    });
  }

  toggleFavorite() {
    this.favoriteChange.emit(!this.favorite());
  }
}
