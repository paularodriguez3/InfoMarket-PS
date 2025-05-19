export interface Product {
  id?: string;
  Nombre: {es: string, en: string, fr:string, zh:string};
  Descripcion: {es: string, en: string, fr:string, zh:string};
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
  Destacado?: boolean;
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
  uid: string;
}

export type lang = 'es' | 'en' | 'fr' | 'zh';
