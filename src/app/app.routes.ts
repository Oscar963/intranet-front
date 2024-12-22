import { Routes } from '@angular/router';
import { IndexWebComponent } from './Web/Layouts/index/index.component';
import { IndexAdminComponent } from './Admin/Layouts/index/index.component';
import { HomeComponent } from './Web/Page/home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { DashboardComponent } from './Admin/Modules/dashboard/dashboard.component';
import { ForgotPasswordComponent } from './Auth/forgot-password/forgot-password.component';
import { LoginComponent } from './Auth/login/login.component';
import { ResetPasswordComponent } from './Auth/reset-password/reset-password.component';

export const routes: Routes = [
  {
    path: '',
    component: IndexWebComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
    ],
  },

  {
    path: 'admin',
    component: IndexAdminComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'reset-password/:token',
    component: ResetPasswordComponent,
  },
  { path: '**', redirectTo: 'login' },
];
