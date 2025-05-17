import { Component, OnInit } from '@angular/core';
import { WishListService } from '../../services/wish-list.service';
import { Product } from '../../models/product.model';
import { WishProductInfoComponent } from '../../components/wish-product-info/wish-product-info.component';
import { NgForOf } from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.css'],
  standalone: true,
  imports: [
    WishProductInfoComponent,
    NgForOf,
    TranslatePipe
  ]
})
export class WishListComponent implements OnInit {
  wishlistItems: Product[] = [];

  constructor(private wishListService: WishListService) {}

  async ngOnInit() {
    this.wishlistItems = await this.wishListService.getWishList();
  }

  async removeFromWishList(productId: string) {
    await this.wishListService.removeFromWishList(productId);
    this.wishlistItems = await this.wishListService.getWishList();
  }
}
