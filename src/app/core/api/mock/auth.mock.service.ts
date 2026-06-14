import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthMockService {
  private readonly platformId = inject(PLATFORM_ID);

  private readonly mockUsers = [
    { email: 'admin@test.com', password: '12345678', role: 'admin', name: 'مدير النظام' },
    { email: 'merchant@test.com', password: '12345678', role: 'merchant', name: 'تاجر تجريبي' },
    { email: 'buyer@test.com', password: '12345678', role: 'buyer', name: 'مستخدم تجريبي' }
  ];

  readonly currentUser = signal<User | null>(null);
  
  readonly isLoggedIn = computed(() => !!this.currentUser());
  readonly role = computed(() => this.currentUser()?.role ?? 'guest');

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('user');
      if (stored) {
        try {
          this.currentUser.set(JSON.parse(stored) as User);
        } catch {
          this.currentUser.set(null);
        }
      }
    }
  }

  login(email: string, password: string): boolean {
    const user = this.mockUsers.find(u => u.email === email && u.password === password);
    if (user) {
      const userData: User = {
        id: Math.floor(Math.random() * 1000),
        name: user.name,
        email: user.email,
        role: user.role as 'admin' | 'merchant' | 'buyer',
        createdAt: new Date().toISOString()
      };
      
      this.currentUser.set(userData);
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('user', JSON.stringify(userData));
      }
      return true;
    }
    return false;
  }

  register(data: any): User {
    const newUser: User = {
      id: Math.floor(Math.random() * 1000),
      name: data.name || 'مستخدم جديد',
      email: data.email,
      role: 'buyer',
      createdAt: new Date().toISOString()
    };
    
    this.currentUser.set(newUser);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('user', JSON.stringify(newUser));
    }
    
    return newUser;
  }

  logout(): void {
    this.currentUser.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('user');
    }
  }
}
