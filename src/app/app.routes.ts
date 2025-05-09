import { Routes } from '@angular/router';
import { authGuard } from '@guards/auth.guard';

export const routes: Routes = [
  /** Web Routes **/
  {
    path: '',
    loadComponent: () =>
      import('@components/Web/Layouts/index/index.component').then(
        (m) => m.IndexWebComponent,
      ),
    children: [
      {
        path: '',
        title: 'Inicio',
        loadComponent: () =>
          import('@components/Web/Page/home/home.component').then(
            (m) => m.HomeComponent,
          ),
      },
      {
        path: 'anexos',
        title: 'Anexos',
        loadComponent: () =>
          import('@components/Web/Page/anexos/anexos.component').then(
            (m) => m.AnexosComponent,
          ),
      },
      {
        path: 'anexos/page/:page',
        title: 'Anexos',
        loadComponent: () =>
          import('@components/Web/Page/anexos/anexos.component').then(
            (m) => m.AnexosComponent,
          ),
      },

      {
        path: 'mobiles',
        title: 'Celulares',
        loadComponent: () =>
          import('@components/Web/Page/mobiles/mobiles.component').then(
            (m) => m.MobilesComponent,
          ),
      },
      {
        path: 'mobiles/page/:page',
        title: 'Celulares',
        loadComponent: () =>
          import('@components/Web/Page/mobiles/mobiles.component').then(
            (m) => m.MobilesComponent,
          ),
      },
      {
        path: 'page/:slug',
        title: 'Página',
        loadComponent: () =>
          import('@components/Web/Page/page/page.component').then(
            (m) => m.PageComponent,
          ),
      },

      {
        path: 'contact',
        title: 'Contacto',
        loadComponent: () =>
          import('@components/Web/Page/contact/contact.component').then(
            (m) => m.ContactComponent,
          ),
      },
    ],
  },

  /** Admin Routes **/
  {
    path: 'admin',
    loadComponent: () =>
      import('@components/Admin/Layouts/index/index.component').then(
        (m) => m.IndexAdminComponent,
      ),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import(
            '@components/Admin/Modules/dashboard/dashboard.component'
          ).then((m) => m.DashboardComponent),
      },

      /** Banner Routes **/
      {
        path: 'banners',
        loadComponent: () =>
          import(
            '@components/Admin/Modules/Banner/index-banner/index-banner.component'
          ).then((m) => m.IndexBannerComponent),
      },
      {
        path: 'banners/page/:page',
        loadComponent: () =>
          import(
            '@components/Admin/Modules/Banner/index-banner/index-banner.component'
          ).then((m) => m.IndexBannerComponent),
      },
      {
        path: 'banners/store',
        loadComponent: () =>
          import(
            '@components/Admin/Modules/Banner/store-banner/store-banner.component'
          ).then((m) => m.StoreBannerComponent),
      },
      {
        path: 'banners/update/:id',
        loadComponent: () =>
          import(
            '@components/Admin/Modules/Banner/update-banner/update-banner.component'
          ).then((m) => m.UpdateBannerComponent),
      },

      /** PopUp Routes **/
      {
        path: 'popups',
        loadComponent: () =>
          import(
            '@components/Admin/Modules/PopUp/index-popup/index-popup.component'
          ).then((m) => m.IndexPopupComponent),
      },
      {
        path: 'popups/page/:page',
        loadComponent: () =>
          import(
            '@components/Admin/Modules/PopUp/index-popup/index-popup.component'
          ).then((m) => m.IndexPopupComponent),
      },
      {
        path: 'popups/store',
        loadComponent: () =>
          import(
            '@components/Admin/Modules/PopUp/store-popup/store-popup.component'
          ).then((m) => m.StorePopupComponent),
      },
      {
        path: 'popups/update/:id',
        loadComponent: () =>
          import(
            '@components/Admin/Modules/PopUp/update-popup/update-popup.component'
          ).then((m) => m.UpdatePopupComponent),
      },

      /** Page Routes **/
      {
        path: 'pages',
        loadComponent: () =>
          import(
            '@components/Admin/Modules/Page/index-page/index-page.component'
          ).then((m) => m.IndexPageComponent),
      },
      {
        path: 'pages/page/:page',
        loadComponent: () =>
          import(
            '@components/Admin/Modules/Page/index-page/index-page.component'
          ).then((m) => m.IndexPageComponent),
      },
      {
        path: 'pages/store',
        loadComponent: () =>
          import(
            '@components/Admin/Modules/Page/store-page/store-page.component'
          ).then((m) => m.StorePageComponent),
      },
      {
        path: 'pages/update/:id',
        loadComponent: () =>
          import(
            '@components/Admin/Modules/Page/update-page/update-page.component'
          ).then((m) => m.UpdatePageComponent),
      },

      {
        path: 'pages/files/:idpage',
        loadComponent: () =>
          import(
            '@components/Admin/Modules/Page/file-index-page/file-index-page.component'
          ).then((m) => m.FileIndexPageComponent),
      },
      {
        path: 'pages/files/:idpage/page/:page',
        loadComponent: () =>
          import(
            '@components/Admin/Modules/Page/file-index-page/file-index-page.component'
          ).then((m) => m.FileIndexPageComponent),
      },

      {
        path: 'pages/files/update/:idfile/page/:idpage',
        loadComponent: () =>
          import(
            '@components/Admin/Modules/Page/file-update-page/file-update-page.component'
          ).then((m) => m.FileUpdatePageComponent),
      },
      /** User Routes **/
      {
        path: 'users',
        loadComponent: () =>
          import(
            '@components/Admin/Modules/User/index-user/index-user.component'
          ).then((m) => m.IndexUserComponent),
      },
      {
        path: 'users/page/:page',
        loadComponent: () =>
          import(
            '@components/Admin/Modules/User/index-user/index-user.component'
          ).then((m) => m.IndexUserComponent),
      },
      {
        path: 'users/store',
        loadComponent: () =>
          import(
            '@components/Admin/Modules/User/store-user/store-user.component'
          ).then((m) => m.StoreUserComponent),
      },
      {
        path: 'users/update/:id',
        loadComponent: () =>
          import(
            '@components/Admin/Modules/User/update-user/update-user.component'
          ).then((m) => m.UpdateUserComponent),
      },
      {
        path: 'users/password-reset/:id',
        loadComponent: () =>
          import(
            '@components/Admin/Modules/User/reset-password/reset-password.component'
          ).then((m) => m.ResetPasswordComponent),
      },
      {
        path: 'users/password-update',
        loadComponent: () =>
          import(
            '@components/Admin/Modules/User/update-password/update-password.component'
          ).then((m) => m.UpdatePasswordComponent),
      },
      {
        path: 'users/profile-update',
        loadComponent: () =>
          import(
            '@components/Admin/Modules/User/update-profile/update-profile.component'
          ).then((m) => m.UpdateProfileComponent),
      },

      /** File Routes **/
      {
        path: 'files',
        loadComponent: () =>
          import(
            '@components/Admin/Modules/File/index-file/index-file.component'
          ).then((m) => m.IndexFileComponent),
      },
      {
        path: 'files/page/:page',
        loadComponent: () =>
          import(
            '@components/Admin/Modules/File/index-file/index-file.component'
          ).then((m) => m.IndexFileComponent),
      },
      {
        path: 'files/store',
        loadComponent: () =>
          import(
            '@components/Admin/Modules/File/store-file/store-file.component'
          ).then((m) => m.StoreFileComponent),
      },
      {
        path: 'files/update/:id',
        loadComponent: () =>
          import(
            '@components/Admin/Modules/File/update-file/update-file.component'
          ).then((m) => m.UpdateFileComponent),
      },

      /** Anexo Routes **/
      {
        path: 'anexos',
        loadComponent: () =>
          import(
            '@components/Admin/Modules/Anexo/index-anexo/index-anexo.component'
          ).then((m) => m.IndexAnexoComponent),
      },
      {
        path: 'anexos/page/:page',
        loadComponent: () =>
          import(
            '@components/Admin/Modules/Anexo/index-anexo/index-anexo.component'
          ).then((m) => m.IndexAnexoComponent),
      },
      {
        path: 'anexos/store',
        loadComponent: () =>
          import(
            '@components/Admin/Modules/Anexo/store-anexo/store-anexo.component'
          ).then((m) => m.StoreAnexoComponent),
      },
      {
        path: 'anexos/update/:id',
        loadComponent: () =>
          import(
            '@components/Admin/Modules/Anexo/update-anexo/update-anexo.component'
          ).then((m) => m.UpdateAnexoComponent),
      },

      /** Mobile Routes **/
      {
        path: 'mobiles',
        loadComponent: () =>
          import(
            '@components/Admin/Modules/Mobile/index-mobile/index-mobile.component'
          ).then((m) => m.IndexMobileComponent),
      },
      {
        path: 'mobiles/page/:page',
        loadComponent: () =>
          import(
            '@components/Admin/Modules/Mobile/index-mobile/index-mobile.component'
          ).then((m) => m.IndexMobileComponent),
      },
      {
        path: 'mobiles/store',
        loadComponent: () =>
          import(
            '@components/Admin/Modules/Mobile/store-mobile/store-mobile.component'
          ).then((m) => m.StoreMobileComponent),
      },
      {
        path: 'mobiles/update/:id',
        loadComponent: () =>
          import(
            '@components/Admin/Modules/Mobile/update-mobile/update-mobile.component'
          ).then((m) => m.UpdateMobileComponent),
      },
    ],
  },

  /** Auth Routes **/
  {
    path: 'login',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@components/Auth/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('@components/Auth/forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent,
      ),
  },
  {
    path: 'reset-password/:token',
    loadComponent: () =>
      import('@components/Auth/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent,
      ),
  },
  {
    path: 'not-found',
    loadComponent: () =>
      import('@shared/not-found/not-found.component').then(
        (m) => m.NotFoundComponent,
      ),
  }, // Ruta para la página de error 404
  { path: '**', redirectTo: '/not-found' },

  // { path: '', redirectTo: '', pathMatch: 'full' },
];
