import { Injectable } from '@nestjs/common';
import firebaseAdmin from 'firebase-admin';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

@Injectable()
export class FirebaseService {
  public app = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
    }),
  });

  public async decodeToken(token: string): Promise<DecodedIdToken> {
    try {
      return await this.app.auth().verifyIdToken(token);
    } catch (err) {
      throw new Error('Token is not valid!');
    }
  }
}
