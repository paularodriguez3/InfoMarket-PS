import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddProductService } from '../../services/add-product.service';
import { collection, getDocs, setDoc, doc } from '@angular/fire/firestore'; // Importar setDoc y doc

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  quantity = 1;
  categories: string[] = [];
  subcategories: string[] = [];
  selectedCategory = '';
  selectedSubcategory = '';
  selectedProductName = '';
  selectedDescription = '';
  selectedPrice: number = 0;
  selectedImageUrl: string = ''; // Nueva propiedad para la URL de la imagen
  features = {
    feature1: '',
    feature2: '',
    feature3: '',
    feature4: ''
  };
  documentsCount: number = 0;

  constructor(private addProductService: AddProductService) {
  }

  ngOnInit() {
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
      Caracteristicas: {
        feature1: this.features.feature1,
        feature2: this.features.feature2,
        feature3: this.features.feature3,
        feature4: this.features.feature4
      }
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
