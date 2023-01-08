import { ValidationError } from "../validators";

const ValidationErrorComp = (props: { errors: ValidationError }) => {
  const errors = props.errors;
  let errorList: string[] = [];

  if (errors !== null) {
    Object.entries(errors).forEach((err) => errorList.push(err[0]));
  } else {
    return <p className="text-green-800">No errors</p>;
  }

  if (errorList.length === 0)
    return <p className="text-green-800">No errors</p>;
  return <p>{errors[errorList[0]]}</p>;
};

export default ValidationErrorComp;
