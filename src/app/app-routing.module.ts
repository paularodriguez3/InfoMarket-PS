import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { ProductListComponent } from './pages/product-list/product-list.component';
import {ShoppingCartComponent} from './pages/shopping-cart/shopping-cart.component';
import {ClientSupportComponent} from './pages/client-support/client-support.component';
import { ForgottenPasswordComponent } from './pages/forgotten-password/forgotten-password.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'product-list/:category', component: ProductListComponent },
  { path: 'shopping-cart', component: ShoppingCartComponent },
  { path: 'client-support', component: ClientSupportComponent },
  { path: 'forgotten-password', component: ForgottenPasswordComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
