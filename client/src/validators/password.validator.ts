import {
  minLength,
  maxLength,
  combineValidators,
  ValidationError,
  ValidationFn,
} from "./core.validator";

export const requireDigit: ValidationFn = (value?: string): ValidationError => {
  if (value && /^.*[0-9]+.*$/.test(value)) {
    return null;
  }
  return { requireDigit: "at least one digit(0-9) is required" };
};

export const requireLowerAlpha: ValidationFn = (
  value?: string
): ValidationError => {
  if (value && /^.*[a-z]+.*$/.test(value)) {
    return null;
  }
  return { requireLowerAlpha: "at least one lower case alphabet is required" };
};

export const requireUpperAlpha: ValidationFn = (
  value?: string
): ValidationError => {
  if (value && /^.*[A-Z]+.*$/.test(value)) {
    return null;
  }
  return { requireUpperAlpha: "at least one upper case alphabet is required" };
};

export const passwordValidator = combineValidators([
  minLength(8),
  maxLength(50),
]);
