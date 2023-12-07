import { ClientData } from './modules/auth/auth.type';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      API_PORT: string;
      AWS_ACCESS_KEY_ID: string;
      AWS_BUCKET_NAME: string;
      AWS_SECRET_ACCESS_KEY: string;
      COUNTRY_STATE_CITY_API_KEY: string;
      FIREBASE_CLIENT_EMAIL: string;
      FIREBASE_PRIVATE_KEY: string;
      FIREBASE_PROJECT_ID: string;
      GITHUB_WEBHOOK_SECRET_KEY: string;
      GOOGLE_CLIENT_ID: string;
      HASH_SECRET_KEY: string;
      JWT_REFRESH_TOKEN_SECRET_KEY: string;
      JWT_SECRET_KEY: string;
      MONGO_DB_AUTO_INDEX: string;
      MONGO_DB_HOST: string;
      MONGO_DB_NAME: string;
      MONGO_DB_PASS: string;
      MONGO_DB_PORT: string;
      MONGO_DB_USER: string;
      NODE_ENV: 'test' | 'development' | 'production' | 'staging';
      POSTGRES_DB_HOST: string;
      POSTGRES_DB_NAME: string;
      POSTGRES_DB_PORT: string;
      POSTGRES_PASS: string;
      POSTGRES_USER: string;
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
