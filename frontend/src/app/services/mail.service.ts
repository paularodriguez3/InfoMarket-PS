import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MailService {
  http: HttpClient = inject(HttpClient);
  apiUrl: string = "http://localhost:3000/send-email"

  constructor() { }

  sendEmail(to: string, pedido: any, templateName: string): Observable<any> {
    let htmlText = "";
    let subjectText = "";
    if (templateName === "OrderConfirm") {
      htmlText = this.templateOrderConfirm(pedido);
      subjectText = "¡Gracias por tu compra!";
    }
    const payload = {
      to: to,
      subject: subjectText,
      html: htmlText
    };

    return this.http.post(this.apiUrl, payload);
  }

  htmlProductGetter(pedido: any): string {
    let html = `<ul>`;
    for (let product of pedido['productos']) {
      let precio = product.product.Descuento
        ? (product.product.Precio * (1 - product.product.Descuento / 100)).toFixed(2)
        : product.product.Precio.toString();

      html += `<li>${product.product.Nombre}: ${precio}€ x ${product.quantity}</li>`;
    }
    html += `</ul>`;
    return html.trim();
  }

  templateOrderConfirm(pedido: any) {
    let html = `
        <div style="font-family: Arial, sans-serif; margin: auto; background-color:#f0f0f0;">
          <h2>¡Gracias por tu compra!</h2>
          <p>Estimado cliente, aquí tiene los detalles de su pedido:</p>
          <p>Fecha de entrega: ${pedido.arrivalDate}</p>
          <p>${this.htmlProductGetter(pedido)}</p>
          <p>Precio total: ${pedido.precioTotal}€</p>
          <p>Gracias por confiar en nosotros. Atentamente,</p>
          <p>El equipo de InfoMarket</p>
        </div>
      `
    return html.trim();
  }

}
