import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';
import { filter } from 'rxjs';

import { TMDBMovieModel } from '../../shared/model/movie.model';
import { MovieService } from '../movie.service';
import { MovieSearchControlComponent } from '../movie-search-control/movie-search-control.component';

@Component({
    selector: 'my-movie-list',
    templateUrl: './my-movie-list.component.html',
    styleUrls: ['./my-movie-list.component.scss'],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MovieSearchControlComponent,
        NgIf,
        NgTemplateOutlet,
        NgFor,
        FastSvgComponent,
    ]
})
export class MyMovieListComponent implements OnInit {
  myMovieForm = new FormGroup({
    movie: new FormControl(null, [
      Validators.required,
      (ctrl) => {
        return this.movieService
          .getFavorites()
          .find((favorite) => favorite.id === ctrl.value?.id)
          ? {
              unique: true,
            }
          : null;
      },
    ]),
    comment: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
  });

  // for easier access to the array
  favorites = new FormArray(
    this.movieService
      .getFavorites()
      .map((favorite) => this.createMovieForm(favorite)),
  );

  favoritesForm = new UntypedFormGroup({ favorites: this.favorites });

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.favorites.valueChanges
      .pipe(filter(() => this.favorites.valid))
      .subscribe(() => {
        this.movieService.setFavorites(this.favorites.value);
      });
  }

  showError(controlName: string): boolean {
    const ctrl = this.myMovieForm.get(controlName);
    return !!(!ctrl?.valid && ctrl?.touched);
  }

  add(): void {
    if (this.myMovieForm.valid) {
      const favorite = {
        ...(this.myMovieForm.getRawValue().movie! as TMDBMovieModel),
        comment: this.myMovieForm.value.comment!,
      };
      this.favorites.push(this.createMovieForm(favorite));
      this.reset();
    } else {
      this.myMovieForm.markAllAsTouched();
    }
  }

  reset(): void {
    this.myMovieForm.reset({
      movie: null,
      comment: '',
    });
  }

  removeMovie(i: number): void {
    this.favorites.removeAt(i);
  }

  private createMovieForm(
    movie: TMDBMovieModel & { comment: string },
  ): FormGroup {
    return new FormGroup({
      id: new FormControl(movie.id),
      title: new FormControl(movie.title, Validators.required),
      comment: new FormControl(movie.comment, [
        Validators.required,
        Validators.minLength(5),
      ]),
    });
  }
}
