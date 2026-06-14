import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-white dark:bg-darkest text-darkest dark:text-light transition-colors duration-300">
      <app-navbar></app-navbar>
      <main class="flex-grow">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: ``
})
export class MainLayoutComponent {
}
