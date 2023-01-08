import { ValidationError, ValidationFn } from "./core.validator";

const emailSimpleRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const emailValidator: ValidationFn = (
  value?: string
): ValidationError => {
  if (value && emailSimpleRegex.test(value)) {
    return null;
  }
  return { email: "invalid email provided" };
};
