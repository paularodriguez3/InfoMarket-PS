import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardService } from '../../services/card.service';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-card-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
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

  editMode = false;
  editingCard: any = null;


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

    if (!this.cardholderName.trim() || !this.cardNumber.trim() || !this.expiry.trim()) {
      this.showFloatingMessage('Por favor, completa todos los campos obligatorios.', false);
      return;
    }

    const cleanCardNumber = this.cardNumber.replace(/\s+/g, '');

    try {
      if (this.editMode && this.editingCard?.id) {
        await this.cardService.editCardById(this.uid, this.editingCard.id, {
          cardholderName: this.cardholderName.trim(),
          cardNumber: cleanCardNumber,
          expiry: this.expiry.trim(),
          brand: this.brand.trim()
        });

        const index = this.cards.findIndex(c => c.id === this.editingCard.id);
        if (index !== -1) {
          this.cards[index] = {
            ...this.cards[index],
            cardholderName: this.cardholderName.trim(),
            cardNumber: cleanCardNumber,
            expiry: this.expiry.trim(),
            brand: this.brand.trim()
          };
        }

        this.showFloatingMessage('Tarjeta actualizada con éxito.', true);
      } else {
        const newCard = await this.cardService.addCard(this.uid, {
          cardholderName: this.cardholderName.trim(),
          cardNumber: cleanCardNumber,
          expiry: this.expiry.trim(),
          brand: this.brand.trim()
        });

        this.cards.push(newCard);
        this.showFloatingMessage('Tarjeta guardada con éxito.', true);
      }

      this.cardholderName = '';
      this.cardNumber = '';
      this.expiry = '';
      this.brand = '';
      this.editMode = false;
      this.editingCard = null;
      this.showAddForm = false;

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
  startEditingCard(card: any) {
    this.editMode = true;
    this.editingCard = card;

    this.cardholderName = card.cardholderName;
    this.cardNumber = card.cardNumber.replace(/\s+/g, '').match(/.{1,4}/g)?.join(' ') || '';
    this.expiry = card.expiry;
    this.brand = card.brand;
    this.showAddForm = true;
  }
  resetForm() {
    this.cardholderName = '';
    this.cardNumber = '';
    this.expiry = '';
    this.brand = '';
    this.editMode = false;
    this.editingCard = null;
    this.showAddForm = false;
  }
  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.resetForm();
    }
  }
}
