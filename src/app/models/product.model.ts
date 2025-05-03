export interface Product {
  id?: string;
  Nombre: string;
  Descripcion: string;
  Imagen: string;
  Precio: number;
  Marca?: string;
  Color: string;
  Caracteristicas: Feature[];
  Categoria: string;
  Subcategoria: string;
}

export interface Feature {
  name: string;
  value: string;
}
