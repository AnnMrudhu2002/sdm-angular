import { Routes } from '@angular/router';
import { PendingDocApproval } from './admin/pending-doc-approval/pending-doc-approval';
import { RegistrationRequest } from './admin/registration-request/registration-request';
import { authGuard } from './auth-guard';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Dashboard } from './dashboard/dashboard';
import { Home } from './home/home';
import { noAuthGuard } from './no-auth-guard';
import { AdminLayout } from './shared/admin-layout/admin-layout';
import { EducationalDetails } from './student/educational-details/educational-details';
import { MyDocuments } from './student/my-documents/my-documents';
import { Profile } from './student/profile/profile';
import { UploadDocuments } from './student/upload-documents/upload-documents';
import { ViewProfile } from './student/view-profile/view-profile';
import { Sample } from './sample/sample';

export const routes: Routes = [{ path: '', redirectTo: 'home', pathMatch: 'full' },
{path: 'home', component: Home},
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
        { path: 'registrationRequests', component: RegistrationRequest },
        { path: 'doc-approval', component: PendingDocApproval }

    ]
},
{
    path: 'student',
    canActivate: [authGuard],
    component: AdminLayout,  // you can keep this layout if same UI
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },  // redirect to profile
      { path: 'profile', component: Profile },
      { path: 'educationalDetails', component: EducationalDetails },
      { path: 'my-documents', component: MyDocuments },
      { path: 'uploadDocuments', component: UploadDocuments },
      { path: 'view-profile', component: ViewProfile },
      {path: 'sample', component:Sample}

    ]
  }, 


{ path: '**', redirectTo: 'auth/login' }
];
