import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './auth.guard';
import { HousingLocationFormComponent } from './pages/housing-location-form/housing-location-form.component';
import { ErrorComponent } from './pages/error/error.component';
import { RegisterComponent } from './pages/register/register.component';
import { roleGuard } from './guards/role.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomeModule),
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [authGuard],
  },
  {
    path: 'housing-locations/create',
    component: HousingLocationFormComponent,
    canActivate: [roleGuard],
    data: { expectedRole: 'admin' } 
  },
  {
    path: 'housing-locations/edit/:id',
    component: HousingLocationFormComponent,
    canActivate: [roleGuard],
    data: { expectedRole: 'admin' } 
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [authGuard],
  },
  {
    path: '**',
    component: ErrorComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
