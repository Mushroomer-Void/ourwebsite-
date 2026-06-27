import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { merchantGuard } from './core/guards/merchant.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/main-layout/main-layout.component').then(c => c.MainLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home.component').then(c => c.HomeComponent)
      },
      {
        path: 'products/:id',
        loadComponent: () => import('./features/products/product-details/product-details.component')
          .then(c => c.ProductDetailsComponent)
      },
      {
        path: 'profile',
        canActivate: [authGuard],
        loadComponent: () => import('./features/profile/profile.component')
          .then(c => c.ProfileComponent)
      },
      {
        path: 'cart',
        canActivate: [authGuard],
        loadComponent: () => import('./features/cart/cart.component')
          .then(c => c.CartComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./features/products/products-list/products-list.component')
          .then(c => c.ProductsListComponent)
      },
      {
        path: 'stores/:id',
        loadComponent: () => import('./features/stores/store-profile/store-profile.component')
          .then(c => c.StoreProfileComponent)
      }
    ]
  },
  {
    path: 'auth',
    loadComponent: () => import('./layouts/auth-layout/auth-layout.component').then(c => c.AuthLayoutComponent),
    children: [
      {
        path: 'login',
        canActivate: [guestGuard],
        loadComponent: () => import('./auth/login/login.component').then(c => c.LoginComponent)
      },
      {
        path: 'register',
        canActivate: [guestGuard],
        loadComponent: () => import('./auth/register/register.component').then(c => c.RegisterComponent)
      },
      {
        path: 'merchant-apply',
        canActivate: [guestGuard],
        loadComponent: () => import('./auth/merchant-apply/merchant-apply.component').then(c => c.MerchantApplyComponent)
      }
    ]
  },
  {
    path: 'merchant',
    canActivate: [merchantGuard],
    loadComponent: () => import('./layouts/dashboard-layout/dashboard-layout.component').then(c => c.DashboardLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./merchant/dashboard/dashboard.component').then(c => c.DashboardComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./merchant/products/products.component').then(c => c.ProductsComponent)
      },
      {
        path: 'orders', 
        loadComponent: () => import('./merchant/orders/orders.component').then(c => c.OrdersComponent)
      },
      {
        path: 'store-settings',
        loadComponent: () => import('./merchant/store-settings/store-settings.component').then(c => c.StoreSettingsComponent)
      }
    ]
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./layouts/dashboard-layout/dashboard-layout.component').then(c => c.DashboardLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./admin/dashboard/admin-dashboard.component').then(c => c.AdminDashboardComponent)
      },
      {
        path: 'applications',
        loadComponent: () => import('./admin/applications/applications.component').then(c => c.ApplicationsComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./admin/users/users.component').then(c => c.UsersComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./admin/reports/reports.component').then(c => c.ReportsComponent)
      },
      {
        path: 'categories',
        loadComponent: () => import('./admin/categories/categories.component').then(c => c.CategoriesComponent)
      },
      {
        path: 'seasons',
        loadComponent: () => import('./admin/seasons/seasons.component').then(c => c.SeasonsComponent)
      },
      {
        path: 'admins',
        loadComponent: () => import('./admin/admins/admins.component').then(c => c.AdminsComponent)
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.component').then(c => c.NotFoundComponent)
  }
];
