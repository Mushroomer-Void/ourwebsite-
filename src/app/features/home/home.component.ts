import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductMockService } from '@core/api/mock/product.mock.service';
import { AuthMockService } from '@core/api/mock/auth.mock.service';
import { SplashScreenComponent } from '@shared/components/splash-screen/splash-screen.component';
import { ProductCardComponent } from '@shared/components/product-card/product-card.component';
import { LoginPromptComponent } from '@shared/components/login-prompt/login-prompt.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SplashScreenComponent, ProductCardComponent, LoginPromptComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  public productService = inject(ProductMockService);
  public authService = inject(AuthMockService);
  private router = inject(Router);

  banners = this.productService.banners;
  categories = this.productService.categories;
  trendingProducts = this.productService.trendingProducts;
  newProducts = this.productService.newProducts;
  recommendedProducts = this.productService.recommendedProducts;
  popularShops = this.productService.popularShops;
  isLoggedIn = this.authService.isLoggedIn;

  currentBanner = signal(0);
  showLoginPrompt = signal(false);
  
  activeSeason = signal({
    isActive: true,
    bannerText: 'تسوق هدايا التخرج',
    bannerColor: '#522B5B'
  });

  ngOnInit() {
    setInterval(() => {
      this.currentBanner.update(i => (i + 1) % this.banners().length);
    }, 3000);
  }

  triggerLoginPrompt() {
    this.showLoginPrompt.set(true);
  }

  closeLoginPrompt() {
    this.showLoginPrompt.set(false);
  }

  toggleWishlist(productId: number) {
    if (!this.isLoggedIn()) {
      this.triggerLoginPrompt();
      return;
    }
    this.productService.toggleWishlist(productId);
  }

  goToProduct(id: number) {
    this.router.navigate(['/products', id]);
  }

  goToRegister() {
    this.router.navigate(['/auth/register']);
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }

  goToCategory(categoryId: number) {
    console.log('category', categoryId);
  }

  goToShop(shopId: number) {
    console.log('shop', shopId);
  }
}
