import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardService } from '../../services/card.service';

@Component({
  selector: 'app-card-manager-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './card-manager-payment.component.html',
  styleUrls: ['./card-manager-payment.component.css']
})
export class CardManagerPaymentComponent implements OnInit {
  @Input() uid: string = '';
  cards: any[] = [];

  constructor(private cardService: CardService) {}

  async ngOnInit() {
    if (this.uid) {
      this.cards = await this.cardService.getCards(this.uid);
      console.log('UID en CardManagerComponent:', this.uid);
    }
  }

  copyToClipboard(card: any, field: 'pan' | 'expiry' | 'cardholderName') {
    let textToCopy = '';
    switch (field) {
      case 'pan':
        textToCopy = card.cardNumber;
        card.copied = 'pan';
        break;
      case 'expiry':
        textToCopy = card.expiry;
        card.copied = 'expiry';
        break;
      case 'cardholderName':
        textToCopy = card.cardholderName || 'Sin nombre';
        card.copied = 'owner';
        break;
    }

    navigator.clipboard.writeText(textToCopy);

    setTimeout(() => {
      card.copied = null;
    }, 2000);
  }

}

