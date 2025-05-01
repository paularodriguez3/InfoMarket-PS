export interface Product {
  id?: string;
  Nombre: string;
  Descripcion: string;
  Imagen: string;
  Precio: number;
  Marca?: string;
  Color: string;
  Caracteristicas: Feature[];
}

export interface Feature {
  name: string;
  value: string;
}
