import Button from "./Button";
import "./LoadingSpinner.css";

function LoadingSpinner() {
  return <div className="lds-dual-ring"></div>;
}

type LoadingButtoProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading: boolean;
};

export default function LoadingButton(props: LoadingButtoProps) {
  let buttonProps = {} as React.ButtonHTMLAttributes<HTMLButtonElement>;
  for (let key in props) {
    if (key == "loading") continue;
    if (key == "children") continue;
    if (key == "disabled") continue;

    buttonProps[key] = props[key];
  }

  let disabled = props.loading;
  if (props.disabled === true) disabled = true;

  return (
    <Button {...buttonProps} disabled={disabled}>
      <div className="flex gap-3 justify-center items-center">
        {props.loading ? <LoadingSpinner /> : null}

        {props.children}
      </div>
    </Button>
  );
}
