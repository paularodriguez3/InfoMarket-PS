// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import {AboutUsComponent} from './pages/about-us/about-us.component';
import {ProductListComponent} from './pages/product-list/product-list.component';
import {ShoppingCartComponent} from './pages/shopping-cart/shopping-cart.component';
import {ClientSupportComponent} from './pages/client-support/client-support.component';
import {ForgottenPasswordComponent} from './pages/forgotten-password/forgotten-password.component';
import {SignInComponent} from './pages/sign-in/sign-in.component';
import {ProductDetailsComponent} from './pages/product-details/product-details.component';
import {SignUpComponent} from './pages/sign-up/sign-up.component';
import {PersonalProfileComponent} from './pages/personal-profile/personal-profile.component';
import {BillingAddressComponent} from './pages/billing-address/billing-address.component';
import {OrderReviewTemplateComponent} from './components/order-review-template/order-review-template.component';
import {PaymentMethodComponent} from './pages/payment-method/payment-method.component';
import {ShippingMethodComponent} from './pages/shipping-method/shipping-method.component';
import {OrderReviewComponent} from './pages/order-review/order-review.component';
import {AddProductComponent} from './pages/add-product/add-product.component';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'product-list/:categoria', component: ProductListComponent },
  { path: 'product-list/:categoria/:subcategoria', component: ProductListComponent},
  { path: 'shopping-cart', component: ShoppingCartComponent },
  { path: 'client-support', component: ClientSupportComponent },
  { path: 'forgotten-password', component: ForgottenPasswordComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'product-details', component: ProductDetailsComponent },
  { path:  'sign-up', component: SignUpComponent },
  { path: 'personal-profile', component: PersonalProfileComponent },
  { path: 'billing-address', component: BillingAddressComponent },
  { path : 'order-review-template', component: OrderReviewTemplateComponent},
  { path: 'payment-method', component: PaymentMethodComponent },
  { path: 'shipping-method', component: ShippingMethodComponent },
  { path: 'order-review', component: OrderReviewComponent },
  { path: 'add-product', component: AddProductComponent },
];
