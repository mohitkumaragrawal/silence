export type ValidationError = { [error: string]: string } | null;

export type ValidationFn = (value?: string) => ValidationError;

export const minLength = (length: number): ValidationFn => {
  return (value?: string) => {
    if (value && value.length >= length) return null;
    return { minLength: `atleast ${length} characters are required` };
  };
};

export const maxLength = (length: number): ValidationFn => {
  return (value?: string) => {
    if (value && value.length <= length) return null;
    return { maxLength: `atmost ${length} characters are allowed` };
  };
};

export const required = (value?: string) => {
  if (value && value.length > 0) return null;
  return { required: `this field is required *` };
};

export const combineValidators = (validators: ValidationFn[]): ValidationFn => {
  return (value?: string) => {
    let valid = true;
    let validationErrors: ValidationError = {};

    validators.forEach((validator) => {
      const error = validator(value);
      if (error) {
        valid = false;
        validationErrors = { ...validationErrors, ...error };
      }
    });
    if (valid) return null;
    return validationErrors;
  };
};
