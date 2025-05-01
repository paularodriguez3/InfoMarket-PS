import {Component, Input} from '@angular/core';
import {Product} from '../../models/product.model';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-add-product',
  standalone: true,
  templateUrl: './add-product.component.html',
  imports: [
    FormsModule
  ],
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {
  @Input() isEditing = true;
  @Input() product?: Product;

  product_name = '';
  description = '';
  category = '';
  subcategory = '';
  features = ['', '', '', ''];
  price = 0;
  quantity = 0;


  ngOnInit(): void {
    if (this.isEditing && !this.product) {
      throw new Error("Product is required when editing.");
    }

    if (this.isEditing) {
      this.product_name = this.product?.Nombre;
      this.description = this.product?.Descripcion;
      this.features = this.product?.Caracteristicas;
      this.price = this.product?.Precio;
    }
  }
}
