import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div style="text-align:center;padding:48px;color:#fff">
      <h1>Page not found</h1>
      <a routerLink="/">Go Home</a>
    </div>
  `,
})
export class NotFoundComponent {}
