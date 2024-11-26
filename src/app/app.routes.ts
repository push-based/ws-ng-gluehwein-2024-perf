import { Routes } from '@angular/router';

import { MovieDetailPageComponent } from './movie/movie-detail-page/movie-detail-page.component';
import { MovieListPageComponent } from './movie/movie-list-page/movie-list-page.component';
import { MovieSearchPageComponent } from './movie/movie-search-page/movie-search-page.component';
import { MyMovieListComponent } from './movie/my-movie-list/my-movie-list.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';

export const routes: Routes = [
  {
    path: 'list/:category',
    component: MovieListPageComponent,
  },
  {
    path: 'list/genre/:id',
    component: MovieListPageComponent,
  },
  {
    path: 'movie/:id',
    component: MovieDetailPageComponent,
  },
  {
    path: 'search/:query',
    component: MovieSearchPageComponent,
  },
  {
    path: 'my-movies',
    component: MyMovieListComponent,
  },
  {
    path: '',
    redirectTo: 'list/popular',
    pathMatch: 'full',
  },
  {
    path: '**',
    component: NotFoundPageComponent,
  },
];
