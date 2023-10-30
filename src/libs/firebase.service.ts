import { Inject, Injectable } from '@nestjs/common';
import { app } from 'firebase-admin';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

import { MODULE_INSTANCES } from '../constants';

@Injectable()
export class FirebaseService {
  constructor(
    @Inject(MODULE_INSTANCES.FIREBASE) public readonly firebase: app.App,
  ) {}

  public async decodeToken(token: string): Promise<DecodedIdToken> {
    try {
      return await this.firebase.auth().verifyIdToken(token);
    } catch (err) {
      throw new Error('Token is not valid!');
    }
  }
}
