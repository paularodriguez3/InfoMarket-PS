import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {lang} from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class MailService {
  http: HttpClient = inject(HttpClient);
  apiUrl: string = "http://localhost:3000/send-email"
  translate: TranslateService = inject(TranslateService);

  constructor() { }

  sendEmail(to: string, pedido: any, templateName: string): Observable<any> {
    let htmlText = "";
    let subjectText = "";
    if (templateName === "OrderConfirm") {
      const templateTexts = this.templateOrderConfirm(pedido);
      htmlText = templateTexts[0];
      subjectText = templateTexts[1];
    }
    const payload = {
      to: to,
      subject: subjectText,
      html: htmlText
    };

    return this.http.post(this.apiUrl, payload);
  }

  htmlProductGetter(pedido: any, language: lang): string {
    let html = `<ul>`;
    for (let product of pedido['productos']) {
      let precio = product.product.Descuento
        ? (product.product.Precio * (1 - product.product.Descuento / 100)).toFixed(2)
        : product.product.Precio.toString();

      html += `<li>${product.product.Nombre[language]}: ${precio}€ x ${product.quantity}</li>`;
    }
    html += `</ul>`;
    return html.trim();
  }

  templateOrderConfirm(pedido: any) {
    const language = this.translate.currentLang as lang;
    let html = {
      es: `
        <div style="font-family: Arial, sans-serif; margin: auto; background-color:#f0f0f0;">
          <h2>¡Gracias por tu compra!</h2>
          <p>Estimado cliente, aquí tiene los detalles de su pedido:</p>
          <p>Fecha de entrega: ${pedido.arrivalDate}</p>
          <p>${this.htmlProductGetter(pedido, language)}</p>
          <p>Precio total: ${pedido.precioTotal}€</p>
          <p>Gracias por confiar en nosotros. Atentamente,</p>
          <p>El equipo de InfoMarket</p>
        </div>
      `,
      fr: `
        <div style="font-family: Arial, sans-serif; margin: auto; background-color:#f0f0f0;">
          <h2>Merci pour votre achat!</h2>
          <p>Chère cliente, cher client, voici les détails de votre commande:</p>
          <p>Date de livraison: ${pedido.arrivalDate}</p>
          <p>${this.htmlProductGetter(pedido, language)}</p>
          <p>Prix total: ${pedido.precioTotal}€</p>
          <p>Merci de nous faire confiance. Nous vous prions d'agréer, Madame, Monsieur, l'expression de nos salutations distinguées.</p>
          <p>L'équipe InfoMarket</p>
        </div>
      `,
      en: `
        <div style="font-family: Arial, sans-serif; margin: auto; background-color:#f0f0f0;">
          <h2>Thank you for your purchase!</h2>
          <p>Dear customer, here are the details of your order:</p>
          <p>Delivery date: ${pedido.arrivalDate}</p>
          <p>${this.htmlProductGetter(pedido, language)}</p>
          <p>Total price: ${pedido.precioTotal}€</p>
          <p>Thank you for trusting us. Sincerely,</p>
          <p>The InfoMarket team</p>
        </div>
      `,
      zh: `
        <div style="font-family: Arial, sans-serif; margin: auto; background-color:#f0f0f0;">
          <h2>感謝您的購買</h2>
          <p>親愛的顧客，以下是您訂單的詳細資料:</p>
          <p>交貨日期: ${pedido.arrivalDate}</p>
          <p>${this.htmlProductGetter(pedido, language)}</p>
          <p>總價: ${pedido.precioTotal}€</p>
          <p>感謝您對我們的信任. 謹致問候</p>
          <p>，InfoMarket 團隊.</p>
        </div>
      `
    }
    const subject = {
      es: "¡Gracias por tu compra!",
      fr: "Merci pour votre achat!",
      en: "Thank you for your purchase!",
      zh: "感謝您的購買"
    }
    const result = [];
    result.push(html[language].trim(), subject[language]);
    return result;
  }

}
