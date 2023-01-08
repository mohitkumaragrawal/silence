interface InputControlType {
  value: string;
  errors: { [error: string]: string } | null;
  valid: boolean;
  touched: boolean;
}

const createForm = (controls: { [name: string]: InputControlType }) => {
  let valid = true;
  let touched = true;
  let value: { [name: string]: string } = {};

  Object.keys(controls).forEach((controlName) => {
    valid = valid && controls[controlName].valid;
    touched = touched && controls[controlName].touched;
    value[controlName] = controls[controlName].value;
  });

  return { valid, touched, value };
};

export default createForm;
