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
  cardNumber = '';

  constructor(private cardService: CardService) {}

  async ngOnInit() {
    if (this.uid) {
      this.cards = await this.cardService.getCards(this.uid);
      console.log('UID en CardManagerComponent:', this.uid);
    }
  }

  copyToClipboard(card: any) {
    navigator.clipboard.writeText(card.cardNumber);
    card["copied"] = true;

  }
}
