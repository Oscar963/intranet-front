import { Popup } from './interface/Popup';
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./Web/Layouts/index/index.component').then(
        (m) => m.IndexWebComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./Web/Page/home/home.component').then((m) => m.HomeComponent),
      },
    ],
  },

  {
    path: 'admin',
    loadComponent: () =>
      import('./Admin/Layouts/index/index.component').then(
        (m) => m.IndexAdminComponent
      ),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./Admin/Modules/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'banners',
        loadComponent: () =>
          import(
            './Admin/Modules/Banner/index-banner/index-banner.component'
          ).then((m) => m.IndexBannerComponent),
      },
      {
        path: 'banners/page/:page',
        loadComponent: () =>
          import(
            './Admin/Modules/Banner/index-banner/index-banner.component'
          ).then((m) => m.IndexBannerComponent),
      },
      {
        path: 'banners/store',
        loadComponent: () =>
          import(
            './Admin/Modules/Banner/store-banner/store-banner.component'
          ).then((m) => m.StoreBannerComponent),
      },
      {
        path: 'banners/update/:id',
        loadComponent: () =>
          import(
            './Admin/Modules/Banner/update-banner/update-banner.component'
          ).then((m) => m.UpdateBannerComponent),
      },
      {
        path: 'popups',
        loadComponent: () =>
          import(
            './Admin/Modules/PopUp/index-popup/index-popup.component'
          ).then((m) => m.IndexPopupComponent),
      },
      {
        path: 'popups/page/:page',
        loadComponent: () =>
          import(
            './Admin/Modules/PopUp/index-popup/index-popup.component'
          ).then((m) => m.IndexPopupComponent),
      },
      {
        path: 'popups/store',
        loadComponent: () =>
          import(
            './Admin/Modules/PopUp/store-popup/store-popup.component'
          ).then((m) => m.StorePopupComponent),
      },
      {
        path: 'popups/update/:id',
        loadComponent: () =>
          import(
            './Admin/Modules/PopUp/update-popup/update-popup.component'
          ).then((m) => m.UpdatePopupComponent),
      },

      {
        path: 'pages',
        loadComponent: () =>
          import('./Admin/Modules/Page/index-page/index-page.component').then(
            (m) => m.IndexPageComponent
          ),
      },
      {
        path: 'pages/page/:page',
        loadComponent: () =>
          import('./Admin/Modules/Page/index-page/index-page.component').then(
            (m) => m.IndexPageComponent
          ),
      },
      {
        path: 'pages/store',
        loadComponent: () =>
          import('./Admin/Modules/Page/store-page/store-page.component').then(
            (m) => m.StorePageComponent
          ),
      },
      {
        path: 'pages/update/:id',
        loadComponent: () =>
          import('./Admin/Modules/Page/update-page/update-page.component').then(
            (m) => m.UpdatePageComponent
          ),
      },

      {
        path: 'users',
        loadComponent: () =>
          import('./Admin/Modules/User/index-user/index-user.component').then(
            (m) => m.IndexUserComponent
          ),
      },
      {
        path: 'users/page/:page',
        loadComponent: () =>
          import('./Admin/Modules/User/index-user/index-user.component').then(
            (m) => m.IndexUserComponent
          ),
      },
      {
        path: 'users/store',
        loadComponent: () =>
          import('./Admin/Modules/User/store-user/store-user.component').then(
            (m) => m.StoreUserComponent
          ),
      },
      {
        path: 'users/update/:id',
        loadComponent: () =>
          import('./Admin/Modules/User/update-user/update-user.component').then(
            (m) => m.UpdateUserComponent
          ),
      },
      {
        path: 'users/password-reset/:id',
        loadComponent: () =>
          import(
            './Admin/Modules/User/reset-password/reset-password.component'
          ).then((m) => m.ResetPasswordComponent),
      },
      {
        path: 'users/password-update',
        loadComponent: () =>
          import(
            './Admin/Modules/User/update-password/update-password.component'
          ).then((m) => m.UpdatePasswordComponent),
      },

      {
        path: 'files/:idpage',
        loadComponent: () =>
          import('./Admin/Modules/File/index-file/index-file.component').then(
            (m) => m.IndexFileComponent
          ),
      },
      {
        path: 'files/page/:page',
        loadComponent: () =>
          import('./Admin/Modules/File/index-file/index-file.component').then(
            (m) => m.IndexFileComponent
          ),
      },
      {
        path: 'files/store/:idpage',
        loadComponent: () =>
          import('./Admin/Modules/File/store-file/store-file.component').then(
            (m) => m.StoreFileComponent
          ),
      },
    ],
  },
  {
    path: 'login',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./Auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./Auth/forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent
      ),
  },
  {
    path: 'reset-password/:token',
    loadComponent: () =>
      import('./Auth/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent
      ),
  },
  { path: '**', redirectTo: 'login' },
];
