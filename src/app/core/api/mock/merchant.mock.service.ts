import { Injectable, signal, computed } from '@angular/core';

export interface Product {
  id: number;
  shopId: number;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: string[];
  categoryId: number;
  rating: number;
  ordersCount: number;
  inWishlist: boolean;
  createdAt: string;
}

export interface MerchantOrder {
  id: number;
  buyerName: string;
  productName: string;
  price: number;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface ActivityItem {
  id: number;
  type: 'order' | 'review' | 'view';
  message: string;
  time: string;
}

@Injectable({ providedIn: 'root' })
export class MerchantMockService {

  // ── الإحصائيات ──
  stats = signal({
    productsCount: 12,
    pendingOrders: 5,
    completedOrders: 38,
    cancelledOrders: 3,
    followersCount: 124
  });

  // ── المنتجات ──
  products = signal<Product[]>([
    { id: 1, shopId: 1, name: 'عسل طبيعي',
      description: 'عسل جبلي طبيعي 100%',
      price: 50, discountPrice: 45,
      images: [], categoryId: 1,
      rating: 4.5, ordersCount: 25,
      inWishlist: false, createdAt: '2024-01-01' },
    { id: 2, shopId: 1, name: 'زيت أرغان',
      description: 'زيت أرغان مغربي أصلي',
      price: 80, discountPrice: undefined,
      images: [], categoryId: 1,
      rating: 4.2, ordersCount: 18,
      inWishlist: false, createdAt: '2024-01-05' },
    { id: 3, shopId: 1, name: 'صابون طبيعي',
      description: 'صابون مصنوع يدوياً بالزيوت الطبيعية',
      price: 25, discountPrice: 20,
      images: [], categoryId: 2,
      rating: 4.8, ordersCount: 42,
      inWishlist: false, createdAt: '2024-01-10' },
    { id: 4, shopId: 1, name: 'كريم ترطيب',
      description: 'كريم ترطيب طبيعي للبشرة الجافة',
      price: 35, discountPrice: undefined,
      images: [], categoryId: 1,
      rating: 3.9, ordersCount: 11,
      inWishlist: false, createdAt: '2024-01-15' }
  ]);

  // ── الطلبات ──
  orders = signal<MerchantOrder[]>([
    { id: 1, buyerName: 'أحمد محمد',
      productName: 'عسل طبيعي',
      price: 45, date: '2024-01-15', status: 'pending' },
    { id: 2, buyerName: 'فاطمة علي',
      productName: 'زيت أرغان',
      price: 80, date: '2024-01-10', status: 'completed' },
    { id: 3, buyerName: 'خالد سالم',
      productName: 'صابون طبيعي',
      price: 20, date: '2024-01-05', status: 'cancelled' },
    { id: 4, buyerName: 'مريم حسن',
      productName: 'كريم ترطيب',
      price: 35, date: '2024-01-20', status: 'pending' },
    { id: 5, buyerName: 'يوسف عمر',
      productName: 'عسل طبيعي',
      price: 45, date: '2024-01-22', status: 'completed' }
  ]);

  // ── بيانات المتجر ──
  shopInfo = signal({
    businessName: 'متجر الطبيعة',
    description: 'متجر متخصص في المنتجات الطبيعية والعضوية',
    phone: '0911234567',
    email: 'merchant@test.com',
    isOpen: true,
    closedUntil: '',
    closeReason: '',
    logo: '',
    socialLinks: {
      whatsapp: '0911234567',
      instagram: '',
      facebook: '',
      tiktok: '',
      snapchat: '',
      email: ''
    }
  });

  // ── Recent Activity ──
  recentActivity = signal<ActivityItem[]>([
    { id: 1, type: 'order', message: 'طلب جديد من أحمد محمد', time: 'منذ 5 دقائق' },
    { id: 2, type: 'review', message: 'تقييم جديد ⭐⭐⭐⭐⭐ على عسل طبيعي', time: 'منذ ساعة' },
    { id: 3, type: 'view', message: 'منتجك "زيت أرغان" شوفوه 23 مرة اليوم', time: 'منذ 3 ساعات' }
  ]);

  // ── Computed ──
  pendingOrders = computed(() =>
    this.orders().filter(o => o.status === 'pending'));
  completedOrders = computed(() =>
    this.orders().filter(o => o.status === 'completed'));
  cancelledOrders = computed(() =>
    this.orders().filter(o => o.status === 'cancelled'));

  // ── Methods ──
  addProduct(product: Omit<Product, 'id' | 'createdAt'>): void {
    const newProduct: Product = {
      ...product,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    this.products.update(p => [...p, newProduct]);
    this.stats.update(s => ({
      ...s, productsCount: s.productsCount + 1
    }));
  }

  updateProduct(id: number, data: Partial<Product>): void {
    this.products.update(products =>
      products.map(p => p.id === id ? { ...p, ...data } : p)
    );
  }

  deleteProduct(id: number): void {
    this.products.update(p => p.filter(p => p.id !== id));
    this.stats.update(s => ({
      ...s, productsCount: s.productsCount - 1
    }));
  }

  updateOrderStatus(id: number,
    status: 'pending' | 'completed' | 'cancelled'): void {
    this.orders.update(orders =>
      orders.map(o => o.id === id ? { ...o, status } : o)
    );
  }

  updateShopInfo(data: Partial<ReturnType<typeof this.shopInfo>>): void {
    this.shopInfo.update(info => ({ ...info, ...data }));
  }

  toggleShopStatus(isOpen: boolean, reason?: string, until?: string): void {
    this.shopInfo.update(info => ({
      ...info,
      isOpen,
      closeReason: reason ?? '',
      closedUntil: until ?? ''
    }));
  }
}
