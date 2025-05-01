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
  selectedImageUrl: string = '';
  selectedImagePath: string = '';
  features: { name: string, value: string }[] = [];

  documentsCount: number = 0;

  private storage = inject(Storage);

  constructor(private addProductService: AddProductService) {}

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
        // Una vez subida la imagen, obtenemos la URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("Imagen subida con éxito:", downloadURL);
          this.selectedImageUrl = downloadURL; // Si es necesario, guarda la URL completa aquí
          this.imageUploaded(); // Llamamos al método imageUploaded para continuar
        });
      }
    );
  }

  imageUploaded() {
    console.log("Imagen subida correctamente.");
    alert("Imagen subida correctamente.");
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

    if (this.selectedImagePath) {
      this.uploadImage(new File([], this.selectedImagePath)); // Subimos la imagen seleccionada
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
      category: this.selectedCategory,
      subcategory: this.selectedSubcategory,
      Precio: this.selectedPrice,
      Cantidad: this.quantity,
      Caracteristicas: formattedFeatures,
      Imagen: this.selectedImagePath
    };

    this.addProductService.saveProduct(productData).then(() => {
      console.log('Producto guardado exitosamente');
      alert("Producto añadido exitosamente.");
    }).catch(error => {
      console.error('Error al guardar el producto: ', error);
      alert("Error al guardar el producto: " + error.message);
    });
  }

  addFeature() {
    this.features.push({ name: '', value: '' });
  }

  removeFeature(index: number) {
    this.features.splice(index, 1);
  }
}
