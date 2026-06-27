import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductMockService } from '@core/api/mock/product.mock.service';
import { AuthMockService } from '@core/api/mock/auth.mock.service';
import { ProductCardComponent } from '@shared/components/product-card/product-card.component';
import { LoginPromptComponent } from '@shared/components/login-prompt/login-prompt.component';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent, LoginPromptComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {
  productService = inject(ProductMockService);
  authService = inject(AuthMockService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  productId = signal<number>(0);
  
  product = computed(() => 
    this.productService.products().find(p => p.id === this.productId())
  );

  similarProducts = computed(() => 
    this.productService.products()
      .filter(p => p.categoryId === this.product()?.categoryId && p.id !== this.productId())
      .slice(0, 4)
  );

  shop = computed(() => 
    this.productService.shops().find(s => s.id === this.product()?.shopId)
  );

  showLoginPrompt = signal(false);

  reviews = signal([
    { id: 1, buyerName: 'أحمد محمد', rating: 5, comment: 'منتج ممتاز جداً، سأطلب مرة أخرى', date: 'منذ أسبوع', verified: true },
    { id: 2, buyerName: 'فاطمة علي', rating: 4, comment: 'جيد لكن التغليف يحتاج تحسين', date: 'منذ أسبوعين', verified: true },
    { id: 3, buyerName: 'خالد سالم', rating: 5, comment: 'أنصح به بشدة', date: 'منذ شهر', verified: true }
  ]);

  averageRating = computed(() => {
    const r = this.reviews();
    if (r.length === 0) return 0;
    return r.reduce((sum, review) => sum + review.rating, 0) / r.length;
  });

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productId.set(+params['id']);
    });
  }

  getStars(): number[] {
    return Array(5).fill(0).map((_, i) => i + 1);
  }

  toggleWishlist(): void {
    if (!this.authService.isLoggedIn()) {
      this.showLoginPrompt.set(true);
      return;
    }
    this.productService.toggleWishlist(this.productId());
  }

  order(): void {
    if (!this.authService.isLoggedIn()) {
      this.showLoginPrompt.set(true);
      return;
    }
    console.log('order', this.productId());
  }

  goToProduct(id: number): void {
    this.router.navigate(['/products', id]);
  }

  getCategoryName(id: number): string {
    const map: Record<number, string> = {
      1: 'جمال وعناية',
      2: 'الأطعمة والمأكولات',
      3: 'الأشغال اليدوية',
      4: 'الأزياء والموضة'
    };
    return map[id] || '';
  }
}
