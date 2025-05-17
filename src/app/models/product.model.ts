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
  Descuento?: number;
  Stock: number;
  Valoraciones?: Valoracion[];
}

export interface Feature {
  name: string;
  value: string;
}

export interface Valoracion {
  Puntuacion: number;
  Comentario: string;
  Fecha?: Date;
  Usuario: string;
}
