import {inject, Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Product} from '../models/product.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslateProductService {
  httpClient: HttpClient = inject(HttpClient);
  private apiUrl: string = "http://localhost:3000/translate-product";
  constructor() { }

  translateProduct(product: {
    Nombre: { es: string };
    Descripcion: { es: string };
    Categoria: string;
    Subcategoria: string;
    Precio: number;
    Marca: string;
    Color: string;
    Stock: number;
    Caracteristicas: { [p: string]: string };
    Imagen: string;
    Descuento: number;
    Destacado: boolean
  }): Observable<any> {
    return this.httpClient.post<any>(this.apiUrl, product);
  }
}
