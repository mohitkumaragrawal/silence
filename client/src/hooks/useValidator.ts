import { useReducer } from "react";
import { ValidationFn } from "../validators";

interface InputControlType {
  value: string;
  errors: { [error: string]: string } | null;
  valid: boolean;
  touched: boolean;
}

interface ActionType {
  type: "CONTROL_CHANGE" | "CONTROL_TOUCHED";
  value?: string;
}

const useValidator = (validator: ValidationFn) => {
  // const inputControlReducer = useCallback(
  const inputControlReducer = (
    currInputControl: InputControlType,
    action: ActionType
  ) => {
    switch (action.type) {
      case "CONTROL_CHANGE":
        if (action.value === undefined) {
          throw new Error("action value was not provided");
        }

        const newErrors = validator(action.value);
        const isValid = newErrors === null;

        return {
          ...currInputControl,
          valid: isValid,
          errors: newErrors,
          value: action.value,
        };

      case "CONTROL_TOUCHED":
        return {
          ...currInputControl,
          touched: true,
        };
      default:
        throw new Error(`${action.type} is not handled`);
    }
  };

  const initialError = validator("");

  const [inputControlState, dispatch] = useReducer(inputControlReducer, {
    valid: initialError === null,
    errors: initialError,
    value: "",
    touched: false,
  });

  return {
    value: inputControlState.value,
    errors: inputControlState.errors,
    valid: inputControlState.valid,
    touched: inputControlState.touched,
    inputProps: {
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: "CONTROL_CHANGE", value: e.target.value });
      },
      onBlur: (e: any) => dispatch({ type: "CONTROL_TOUCHED" }),
      invalid: !inputControlState.valid && inputControlState.touched,
      value: inputControlState.value,
    },
  };
};

export default useValidator;
