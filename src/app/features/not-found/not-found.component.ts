import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  template: `
    <div class="flex flex-col items-center justify-center min-h-screen">
      <h1 class="text-4xl font-bold text-primary mb-4">404</h1>
      <p class="text-xl">الصفحة غير موجودة</p>
    </div>
  `,
  styles: ``
})
export class NotFoundComponent {
}
