import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { ShoppingCartComponent } from './pages/shopping-cart/shopping-cart.component';
import { ClientSupportComponent } from './pages/client-support/client-support.component';
import { ForgottenPasswordComponent } from './pages/forgotten-password/forgotten-password.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { ShoppingProcessComponent } from './pages/shopping-process/shopping-process.component';
import { ShoppingInfoComponent } from './pages/shopping-info/shopping-info.component';
import { BillingAddressComponent } from './pages/billing-address/billing-address.component';
import { OrderReviewComponent } from './pages/order-review/order-review.component';
import { OrderReviewTemplateComponent } from './pages/order-review-template/order-review-template.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    HomeComponent,
    NavBarComponent,
    AboutUsComponent,
    ProductListComponent,
    ShoppingCartComponent,
    ClientSupportComponent,
    ForgottenPasswordComponent,
    SignInComponent,
    ProductDetailsComponent,
    ShoppingProcessComponent,
    ShoppingInfoComponent,
    BillingAddressComponent,
    OrderReviewComponent,
    OrderReviewTemplateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
