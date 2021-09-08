import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CvComponent } from './cv/cv.component';
import { Error404Component } from './error404/error404.component';

const routes: Routes = [
  {
    path: '',
    component: CvComponent,
  },
  {
    path: 'cv',
    component: CvComponent,
  },
  {
    path: 'currencyExch',
    loadChildren: () =>
      import('./currency-exchange/currency-exchange.module').then(
        (m) => m.CurrencyExchangeModule
      ),
  },
  {
    path: 'error',
    component: Error404Component,
  },
  { path: '**', redirectTo: '/error', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
