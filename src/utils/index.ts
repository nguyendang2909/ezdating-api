export * from './paginations';
export * from './profiles.util';
export * from './utils.module';
export * from './validators';

export const delay = (time = 1000) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

export async function retry<T>(
  promiseFn: () => Promise<T>,
  maxTries = 3,
): Promise<T> {
  try {
    return await promiseFn();
  } catch (err) {
    if (maxTries > 0) {
      return await this.retry(promiseFn, maxTries - 1);
    }
    throw err;
  }
}
