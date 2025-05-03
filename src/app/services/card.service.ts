import { Injectable, inject } from '@angular/core';
import {Firestore, collection, addDoc, getDocs, doc, deleteDoc} from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class CardService {
  private firestore = inject(Firestore);

  async getCards(uid: string): Promise<any[]> {
    const cardsRef = collection(this.firestore, `users/${uid}/cards`);
    const snapshot = await getDocs(cardsRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }


  async addCard(uid: string, card: {
    cardholderName: string,
    cardNumber: string,
    expiry: string,
    brand: string
  }): Promise<{ id: string, cardNumberMasked: string, brand: string, expiry: string, cardholderName: string }> {
    const masked = '**** **** **** ' + card.cardNumber.slice(-4);

    const docRef = await addDoc(collection(this.firestore, `users/${uid}/cards`), {
      cardholderName: card.cardholderName,
      cardNumberMasked: masked,
      expiry: card.expiry,
      brand: card.brand,
      createdAt: new Date()
    });

    return {
      id: docRef.id,
      cardholderName: card.cardholderName,
      cardNumberMasked: masked,
      expiry: card.expiry,
      brand: card.brand
    };
  }
  async deleteCardById(uid: string, cardId: string): Promise<void> {
    const cardRef = doc(this.firestore, `users/${uid}/cards/${cardId}`);
    await deleteDoc(cardRef);
  }
}
