import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';

@Component({
    selector: 'not-found-page',
    imports: [FastSvgComponent, RouterLink],
    template: `
    <div class="not-found-container">
      <fast-svg size="350px" name="error" />
      <h1 class="title">Sorry, page not found</h1>

      <a class="btn" routerLink="/list/popular">See popular</a>
    </div>
  `,
    styles: `
    :host {
      width: 100%;
      height: 100%;
      display: block;
    }

    .not-found-container {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }

    .title {
      text-align: center;
      font-size: 4rem;
      font-weight: 700;
      margin: 3rem 1rem;
    }
  `
})
export class NotFoundPageComponent {}
