import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardService } from '../../services/card.service';

@Component({
  selector: 'app-card-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './card-manager.component.html',
  styleUrls: ['./card-manager.component.css']
})
export class CardManagerComponent implements OnInit {
  @Input() uid: string = '';

  cards: any[] = [];
  showAddForm = false;

  cardholderName = '';
  cardNumber = '';
  expiry = '';
  brand = '';

  constructor(private cardService: CardService) {}

  async ngOnInit() {
    if (this.uid) {
      this.cards = await this.cardService.getCards(this.uid);
      console.log('UID recibido en CardManagerComponent:', this.uid);
    }
  }

  async addCard() {
    if (!this.uid) return;

    await this.cardService.addCard(this.uid, {
      cardholderName: this.cardholderName,
      cardNumber: this.cardNumber,
      expiry: this.expiry,
      brand: this.brand
    });

    this.cards.push({
      cardholderName: this.cardholderName,
      cardNumberMasked: '**** **** **** ' + this.cardNumber.slice(-4),
      expiry: this.expiry,
      brand: this.brand
    });


    this.cardholderName = '';
    this.cardNumber = '';
    this.expiry = '';
    this.brand = '';
    this.showAddForm = false;
  }
  async deleteCard(card: any) {
    if (!this.uid || !card.id) {
      console.warn('No se puede eliminar: UID o ID no disponible');
      return;
    }

    try {
      await this.cardService.deleteCardById(this.uid, card.id);
      this.cards = this.cards.filter(c => c.id !== card.id);
    } catch (error) {
      console.error('Error al eliminar la tarjeta:', error);
    }
  }

  cardToDelete: any = null;
  showConfirmPopup = false;

  confirmDelete(card: any) {
    this.cardToDelete = card;
    this.showConfirmPopup = true;
  }

  cancelDelete() {
    this.cardToDelete = null;
    this.showConfirmPopup = false;
  }

  async confirmDeleteCard() {
    if (!this.uid || !this.cardToDelete?.id) return;

    try {
      await this.cardService.deleteCardById(this.uid, this.cardToDelete.id);
      this.cards = this.cards.filter(c => c.id !== this.cardToDelete.id);
    } catch (error) {
      console.error('Error al eliminar la tarjeta:', error);
    }

    this.cancelDelete();
  }
}
