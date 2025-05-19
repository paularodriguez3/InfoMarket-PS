import { Injectable, inject } from '@angular/core';
import { CardService } from './card.service';
import { AddressService } from './address.service';
import { UserService } from './user.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private cardService = inject(CardService);
  private addressService = inject(AddressService);
  private userService = inject(UserService);
  private authService = inject(AuthService);

  async deleteEntireAccount(uid: string): Promise<void> {
    if (!uid) throw new Error('UID no disponible');

    const cards = await this.cardService.getCards(uid);
    for (const card of cards) {
      await this.cardService.deleteCardById(uid, card.id);
    }

    const addresses = await this.addressService.getAddresses(uid);
    for (const address of addresses) {
      await this.addressService.deleteAddressById(uid, address.id);
    }

    await this.userService.deleteUserData(uid);

    await this.authService.deleteUser();
  }
}
