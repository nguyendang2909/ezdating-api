import { BaseValidationOptions } from 'joi';

export const DEFAULT_VALIDATION_OPTIONS: BaseValidationOptions = {
  allowUnknown: true,
  stripUnknown: true,
  abortEarly: true,
};
