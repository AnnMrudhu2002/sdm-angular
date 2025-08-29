import { Routes } from '@angular/router';
import { RegistrationRequest } from './admin/registration-request/registration-request';
import { authGuard } from './auth-guard';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Dashboard } from './dashboard/dashboard';
import { noAuthGuard } from './no-auth-guard';
import { AdminLayout } from './shared/admin-layout/admin-layout';

export const routes: Routes = [{ path: '', redirectTo: 'auth', pathMatch: 'full' },
{
    path: 'auth',
    canActivate: [noAuthGuard],
    children: [
        { path: '', redirectTo: 'login', pathMatch: 'full' }, 
        { path: 'login', component: Login },
        { path: 'register', component: Register }
    ]
},
{
    path: 'admin',
    canActivate: [authGuard],
    component: AdminLayout,
    children: [
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        { path: 'dashboard', component: Dashboard },
        { path: 'registrationRequests', component: RegistrationRequest }
    ]
},


{ path: '**', redirectTo: 'auth/login' }
];
