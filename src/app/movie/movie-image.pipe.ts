import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'movieImage',
  standalone: true,
})
export class MovieImagePipe implements PipeTransform {
  transform(value?: string, width = 780): string {
    if (value) {
      return `https://image.tmdb.org/t/p/w${width}${value}`;
    }
    return '/assets/images/no_poster_available.jpg';
  }
}
