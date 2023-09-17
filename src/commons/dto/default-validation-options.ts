import { BaseValidationOptions } from 'joi';

export const DEFAULT_VALIDATION_OPTIONS: BaseValidationOptions = {
  abortEarly: true,
  allowUnknown: true,
  stripUnknown: true,
};
