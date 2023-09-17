import { ClientData } from './modules/auth/auth.type';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // App
      API_PORT: string;
      // AWS
      AWS_ACCESS_KEY_ID: string;

      AWS_BUCKET_NAME: string;
      AWS_SECRET_ACCESS_KEY: string;
      // Country states city
      COUNTRY_STATE_CITY_API_KEY: string;
      FIREBASE_CLIENT_EMAIL: string;
      FIREBASE_PRIVATE_KEY: string;
      // // Google
      // GOOGLE_CLIENT_ID: string;
      // GOOGLE_CLIENT_SECRET: string;
      // Firebase
      FIREBASE_PROJECT_ID: string;
      // Github
      GITHUB_WEBHOOK_SECRET_KEY: string;
      HASH_SECRET_KEY: string;
      JWT_REFRESH_TOKEN_SECRET_KEY: string;
      // Auth
      JWT_SECRET_KEY: string;
      MONGO_DB_HOST: string;
      MONGO_DB_NAME: string;

      MONGO_DB_PASS: string;
      MONGO_DB_PORT: string;
      MONGO_DB_USER: string;

      // Node env
      NODE_ENV: 'test' | 'development' | 'production' | 'staging';
      //  Database
      POSTGRES_DB_HOST: string;
      POSTGRES_DB_NAME: string;

      POSTGRES_DB_PORT: string;
      POSTGRES_PASS: string;
      POSTGRES_USER: string;

      // Cache
      REDIS_HOST: string;

      REDIS_PORT: string;
    }
  }
}

declare module 'socket.io/dist/socket' {
  interface Handshake {
    user: ClientData;
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
