import { Injectable } from '@nestjs/common';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

import { firebase } from './firebase';

@Injectable()
export class FirebaseService {
  public async decodeToken(token: string): Promise<DecodedIdToken> {
    try {
      return await firebase.auth().verifyIdToken(token);
    } catch (err) {
      throw new Error('Token is not valid!');
    }
  }
}
