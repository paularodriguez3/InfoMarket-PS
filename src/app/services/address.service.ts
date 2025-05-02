import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, doc, deleteDoc } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class AddressService {
  private firestore = inject(Firestore);

  async getAddresses(uid: string): Promise<any[]> {
    const addressesRef = collection(this.firestore, `users/${uid}/addresses`);
    const snapshot = await getDocs(addressesRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  async addAddress(uid: string, address: { fullAddress: string }): Promise<{ id: string, fullAddress: string }> {
    const docRef = await addDoc(collection(this.firestore, `users/${uid}/addresses`), {
      fullAddress: address.fullAddress,
      createdAt: new Date()
    });

    return {
      id: docRef.id,
      fullAddress: address.fullAddress
    };
  }


  async deleteAddressById(uid: string, addressId: string): Promise<void> {
    const addressRef = doc(this.firestore, `users/${uid}/addresses/${addressId}`);
    await deleteDoc(addressRef);
  }
}
