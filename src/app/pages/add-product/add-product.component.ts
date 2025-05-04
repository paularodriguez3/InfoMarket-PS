import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddProductService } from '../../services/add-product.service';
import { collection, getDocs, setDoc, doc } from '@angular/fire/firestore';
import { Storage } from '@angular/fire/storage';
import { getDownloadURL, ref, uploadBytesResumable } from '@angular/fire/storage';
import { Feature, Product } from '../../models/product.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  product?: Product;
  isEditing = false;

  quantity = 1;
  categories: string[] = [];
  subcategories: string[] = [];
  selectedCategory = '';
  selectedSubcategory = '';
  selectedProductName = '';
  selectedDescription = '';
  selectedPrice: number = 0;
  selectedImageUrl: string = '';
  selectedImagePath: string = '';
  selectedFile: File | null = null;
  features: Feature[] = [];

  documentsCount: number = 0;

  private storage = inject(Storage);

  constructor(private addProductService: AddProductService, private router : Router) {}

  ngOnInit() {
    const inputJSON = localStorage.getItem('edit-product');
    localStorage.removeItem('edit-product');
    const input = inputJSON ? JSON.parse(inputJSON) : null;

    if (input) {
      this.isEditing = true;

      this.product = input['product'] as Product;
      console.log(this.product);

      this.selectedProductName = this.product.Nombre;
      this.selectedDescription = this.product.Descripcion;
      this.features = this.product.Caracteristicas;
      this.selectedPrice = this.product.Precio;
      this.selectedImageUrl = this.product.Imagen;
      this.selectedCategory = this.product.Categoria;
      this.onCategoryChange();
      this.selectedSubcategory = this.product.Subcategoria;
      this.onSubcategoryChange();
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
        const firestore = this.addProductService.getFirestore();
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

  onImageSelect(event: any) {
    const file = event.target.files[0];
    console.log("Archivo seleccionado:", file);
    if (file) {
      this.selectedImagePath = file.name;
      this.selectedFile = new File([file], file.name, { type: 'image/jpeg' });
    }
  }

  uploadImage(file: File) {
    const filePath = `Informatica/${file.name}`;
    this.selectedImagePath = filePath;
    const storageRef = ref(this.storage, filePath);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
      },
      (error) => {
        console.error("Error al subir la imagen: ", error);
        alert("Error al subir la imagen.");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("Imagen subida con éxito:", downloadURL);
          this.selectedImageUrl = downloadURL;
          this.imageUploaded();
        });
      }
    );
  }

  imageUploaded() {
    console.log("Imagen subida correctamente.");
    alert("Imagen subida correctamente.");
  }

  saveProduct() {
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

    if (this.selectedFile) {
      this.uploadImage(this.selectedFile); // Subimos la imagen seleccionada
    }

    const formattedFeatures: { [key: string]: string } = {};
    this.features.forEach(feature => {
      if (feature.name && feature.value) {
        formattedFeatures[feature.name] = feature.value;
      }
    });

    const productData = {
      Nombre: this.selectedProductName,
      Descripcion: this.selectedDescription,
      Categoria: this.selectedCategory,
      Subcategoria: this.selectedSubcategory,
      Precio: this.selectedPrice,
      Cantidad: this.quantity,
      Caracteristicas: formattedFeatures,
      Imagen: this.selectedImagePath
    };

    if (!this.isEditing) {
      this.addProductService.saveProduct(productData).then(() => {
        console.log('Producto guardado exitosamente');
        alert("Producto añadido exitosamente.");
      }).catch(error => {
        console.error('Error al guardar el producto: ', error);
        alert("Error al guardar el producto: " + error.message);
      });
    } else {
      if(this.product) {
        this.addProductService.editProduct(this.product, productData)
      }
    }
  }

  addFeature() {
    this.features.push({ name: '', value: '' });
  }

  removeFeature(index: number) {
    this.features.splice(index, 1);
  }

  removeProduct() {
    if (this.product && 'id' in this.product) {
      this.addProductService.deleteProduct(this.product.id, this.selectedCategory, this.selectedSubcategory).then(() => {
        this.router.navigate(['/']);
        console.log("Producto eliminado.");
      });
    } else {
      console.error("The product has no id");
    }
  }
}
