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

  cardToDelete: any = null;
  showConfirmPopup = false;

  floatingMessage='';
  floatingSuccess= false;

  constructor(private cardService: CardService) {}

  async ngOnInit() {
    if (this.uid) {
      this.cards = await this.cardService.getCards(this.uid);
      console.log('UID en CardManagerComponent:', this.uid);
    }
  }

  formatCardNumber() {
    this.cardNumber = this.cardNumber
      .replace(/\s+/g, '')
      .replace(/[^0-9]/g, '')
      .match(/.{1,4}/g)?.join(' ') || '';
  }


  showFloatingMessage(message: string, success: boolean) {
    this.floatingMessage = message;
    this.floatingSuccess = success;
    setTimeout(() => {
      this.floatingMessage = '';
    }, 3000);
  }

  async addCard() {
    if (!this.uid) return;

    // Validación manual como en AddressManager
    if (
      !this.cardholderName.trim() ||
      !this.cardNumber.trim() ||
      !this.expiry.trim()
    ) {
      this.showFloatingMessage('Por favor, completa todos los campos obligatorios.', false);
      return;
    }

    const cleanCardNumber = this.cardNumber.replace(/\s+/g, '');

    try {
      const newCard = await this.cardService.addCard(this.uid, {
        cardholderName: this.cardholderName.trim(),
        cardNumber: cleanCardNumber,
        expiry: this.expiry.trim(),
        brand: this.brand.trim()
      });

      this.cards.push(newCard);

      this.cardholderName = '';
      this.cardNumber = '';
      this.expiry = '';
      this.brand = '';
      this.showAddForm = false;

      this.showFloatingMessage('Tarjeta guardada con éxito.', true);
    } catch (error) {
      console.error('Error al guardar la tarjeta:', error);
      this.showFloatingMessage('Error al guardar la tarjeta. Inténtalo de nuevo.', false);
    }
  }


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
