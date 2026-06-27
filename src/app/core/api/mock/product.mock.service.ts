import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProductMockService {

  // ── التصنيفات ──
  categories = signal([
    { id: 1, name: 'beauty', nameAr: 'جمال وعناية',
      icon: 'fas fa-spa', productsCount: 34 },
    { id: 2, name: 'food', nameAr: 'الأطعمة والمأكولات',
      icon: 'fas fa-utensils', productsCount: 28 },
    { id: 3, name: 'handmade', nameAr: 'الأشغال اليدوية',
      icon: 'fas fa-hands', productsCount: 15 },
    { id: 4, name: 'fashion', nameAr: 'الأزياء والموضة',
      icon: 'fas fa-tshirt', productsCount: 12 }
  ]);

  // ── الإعلانات ──
  banners = signal([
    { id: 1, title: 'تسوق هدايا التخرج',
      subtitle: 'أجمل الهدايا للمتخرجين في ليبيا',
      bgColor: '#522B5B', icon: 'fas fa-graduation-cap' },
    { id: 2, title: 'منتجات طبيعية 100%',
      subtitle: 'من أيدي الحرفيين الليبيين مباشرة',
      bgColor: '#2B124C', icon: 'fas fa-leaf' },
    { id: 3, title: 'أزياء ليبية عصرية',
      subtitle: 'اكتشف أحدث صيحات الموضة المحلية',
      bgColor: '#854F6C', icon: 'fas fa-tshirt' },
    { id: 4, title: 'مأكولات بيتية شهية',
      subtitle: 'طعم البيت يوصل لبيتك',
      bgColor: '#190019', icon: 'fas fa-utensils' }
  ]);

  // ── المنتجات ──
  products = signal<HomeProduct[]>([
    { id: 1, shopId: 1, shopName: 'متجر الطبيعة',
      name: 'عسل جبلي طبيعي', description: 'عسل جبلي ليبي 100% طبيعي',
      price: 85, discountPrice: 70, categoryId: 2,
      rating: 4.8, ordersCount: 124, inWishlist: false,
      image: '', isNew: false, isTrending: true },
    { id: 2, shopId: 1, shopName: 'متجر الطبيعة',
      name: 'زيت أرغان مغربي', description: 'زيت أرغان أصلي للعناية بالشعر',
      price: 120, discountPrice: undefined, categoryId: 1,
      rating: 4.6, ordersCount: 89, inWishlist: false,
      image: '', isNew: true, isTrending: true },
    { id: 3, shopId: 2, shopName: 'أزياء ليبيا',
      name: 'عباءة فاخرة', description: 'عباءة بتصميم عصري وأقمشة فاخرة',
      price: 250, discountPrice: 200, categoryId: 4,
      rating: 4.9, ordersCount: 56, inWishlist: false,
      image: '', isNew: true, isTrending: false },
    { id: 4, shopId: 3, shopName: 'الأشغال اليدوية',
      name: 'لوحة خزفية يدوية', description: 'لوحة خزفية مصنوعة يدوياً بزخارف ليبية',
      price: 180, discountPrice: undefined, categoryId: 3,
      rating: 4.7, ordersCount: 34, inWishlist: false,
      image: '', isNew: false, isTrending: true },
    { id: 5, shopId: 1, shopName: 'متجر الطبيعة',
      name: 'صابون طبيعي بالزيوت', description: 'صابون مصنوع يدوياً بزيوت طبيعية',
      price: 35, discountPrice: 28, categoryId: 1,
      rating: 4.5, ordersCount: 201, inWishlist: false,
      image: '', isNew: false, isTrending: true },
    { id: 6, shopId: 2, shopName: 'أزياء ليبيا',
      name: 'جلباب رجالي تقليدي', description: 'جلباب ليبي تقليدي بخامات ممتازة',
      price: 150, discountPrice: undefined, categoryId: 4,
      rating: 4.3, ordersCount: 78, inWishlist: false,
      image: '', isNew: true, isTrending: false },
    { id: 7, shopId: 3, shopName: 'الأشغال اليدوية',
      name: 'حقيبة جلدية يدوية', description: 'حقيبة من الجلد الطبيعي مصنوعة يدوياً',
      price: 320, discountPrice: 280, categoryId: 3,
      rating: 4.8, ordersCount: 45, inWishlist: false,
      image: '', isNew: false, isTrending: true },
    { id: 8, shopId: 4, shopName: 'مطبخ أم محمد',
      name: 'كسكس ليبي منزلي', description: 'كسكس ليبي أصلي مصنوع في البيت',
      price: 45, discountPrice: undefined, categoryId: 2,
      rating: 4.9, ordersCount: 312, inWishlist: false,
      image: '', isNew: false, isTrending: true }
  ]);

  // ── المتاجر ──
  shops = signal<HomeShop[]>([
    { id: 1, name: 'متجر الطبيعة', description: 'منتجات طبيعية وعضوية',
      categoryId: 1, rating: 4.7, followersCount: 234,
      productsCount: 15, logo: '',
      socialLinks: { whatsapp: '0911234567', instagram: 'nature_store' } },
    { id: 2, name: 'أزياء ليبيا', description: 'أحدث صيحات الموضة المحلية',
      categoryId: 4, rating: 4.8, followersCount: 456,
      productsCount: 23, logo: '',
      socialLinks: { instagram: 'libya_fashion', facebook: 'libyafashion' } },
    { id: 3, name: 'الأشغال اليدوية', description: 'منتجات تراثية ليبية',
      categoryId: 3, rating: 4.6, followersCount: 189,
      productsCount: 12, logo: '',
      socialLinks: { instagram: 'handmade_ly', tiktok: 'handmade_ly' } },
    { id: 4, name: 'مطبخ أم محمد', description: 'أكلات ليبية تقليدية',
      categoryId: 2, rating: 4.9, followersCount: 678,
      productsCount: 8, logo: '',
      socialLinks: { whatsapp: '0944444444', instagram: 'om_mohamed' } }
  ]);

  // ── Computed ──
  trendingProducts = computed(() =>
    this.products().filter(p => p.isTrending)
      .sort((a, b) => b.ordersCount - a.ordersCount));

  newProducts = computed(() =>
    this.products().filter(p => p.isNew));

  recommendedProducts = computed(() =>
    this.products().sort((a, b) => b.rating - a.rating).slice(0, 4));

  popularShops = computed(() =>
    this.shops().sort((a, b) => b.followersCount - a.followersCount));

  // ── Wishlist ──
  wishlist = signal<number[]>([]);

  toggleWishlist(productId: number): void {
    this.wishlist.update(list =>
      list.includes(productId)
        ? list.filter(id => id !== productId)
        : [...list, productId]
    );
    this.products.update(products =>
      products.map(p => p.id === productId
        ? { ...p, inWishlist: !p.inWishlist }
        : p
      )
    );
  }

  isInWishlist(productId: number): boolean {
    return this.wishlist().includes(productId);
  }

  getProductsByCategory(categoryId: number) {
    return this.products().filter(p => p.categoryId === categoryId);
  }
}

// Interfaces في نفس الملف:
export interface HomeProduct {
  id: number;
  shopId: number;
  shopName: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  categoryId: number;
  rating: number;
  ordersCount: number;
  inWishlist: boolean;
  image: string;
  isNew: boolean;
  isTrending: boolean;
}

export interface HomeShop {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  rating: number;
  followersCount: number;
  productsCount: number;
  logo: string;
  socialLinks: {
    whatsapp?: string;
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    snapchat?: string;
  };
}
