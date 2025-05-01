import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddProductService } from '../../services/add-product.service';
import { collection, getDocs} from '@angular/fire/firestore';
import {Product} from '../../models/product.model';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  product?: Product;

  quantity = 1;
  categories: string[] = [];
  subcategories: string[] = [];
  selectedCategory = '';
  selectedSubcategory = '';
  selectedProductName = '';
  selectedDescription = '';
  selectedPrice: number = 0;
  selectedImageUrl: string = ''; // Nueva propiedad para la URL de la imagen
  features:string[] = ['', ''];
  documentsCount: number = 0;

  constructor(private addProductService: AddProductService) {
  }

  ngOnInit() {
    const productJSON = localStorage.getItem('edit-product');
    localStorage.removeItem('edit-product');
    this.product = productJSON ? JSON.parse(productJSON): null;
    console.log(this.product);

    if (this.product) {
      this.selectedProductName = this.product.Nombre;
      this.selectedDescription = this.product.Descripcion;
      this.features = this.product.Caracteristicas;
      this.selectedPrice = this.product.Precio;
    }

    this.addProductService.getCategories().subscribe(
      (categories: string[]) => this.categories = categories,
      (error) => console.error("Error al obtener categorías:", error)
    );
  }

  onCategoryChange() {
    this.subcategories = this.addProductService.getSubcategories(this.selectedCategory);
    this.selectedSubcategory = '';
  }

  async onSubcategoryChange() {
    if (this.selectedCategory && this.selectedSubcategory) {
      const routeExists = await this.addProductService.checkIfRouteExists(this.selectedCategory, this.selectedSubcategory);

      if (routeExists) {
        const firestore = this.addProductService.getFirestore(); // Obtén firestore desde el servicio
        const productsRef = collection(firestore, `productos/${this.selectedCategory}/${this.selectedSubcategory}`);
        getDocs(productsRef).then(querySnapshot => {
          this.documentsCount = querySnapshot.size;
          console.log(`Número de documentos: ${this.documentsCount}`);
        }).catch(error => {
          console.error("Error al obtener documentos:", error);
        });
      } else {
        this.documentsCount = 0;
      }
    }
  }

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) this.quantity--;
  }

  addFeature() {
    this.features.push('');
  }

  saveProduct() {
    // Comprobamos cada campo individualmente
    if (!this.selectedProductName) {
      alert("Por favor, complete el campo 'Nombre del producto'.");
      return;
    }

    if (!this.selectedDescription) {
      alert("Por favor, complete el campo 'Descripción del producto'.");
      return;
    }

    if (!this.selectedCategory) {
      alert("Por favor, seleccione una categoría.");
      return;
    }

    if (!this.selectedSubcategory) {
      alert("Por favor, seleccione una subcategoría.");
      return;
    }

    if (this.selectedPrice <= 0) {
      alert("Por favor, complete el campo 'Precio' con un valor mayor a 0.");
      return;
    }

    // Si los campos están completos, guardamos el producto
    const productData = {
      Nombre: this.selectedProductName,
      Descripcion: this.selectedDescription,
      category: this.selectedCategory,
      subcategory: this.selectedSubcategory,
      Precio: this.selectedPrice,
      Cantidad: this.quantity,
      Caracteristicas: this.features.reduce((acc, val, idx) => {
        acc[`feature${idx + 1}`] = val;
        return acc;
      }, {} as { [key: string]: string })
    };

    this.addProductService.saveProduct(productData).then(() => {
      console.log('Producto guardado exitosamente');
      alert("Producto añadido exitosamente.");
    }).catch(error => {
      console.error('Error al guardar el producto: ', error);
      alert("Error al guardar el producto: " + error.message);
    });
  }

}
