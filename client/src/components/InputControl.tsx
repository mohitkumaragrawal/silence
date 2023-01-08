interface InputControlProps {
  label?: string;
  invalid?: boolean;
  children?: React.ReactNode;
}

export default function InputControl(
  props: React.InputHTMLAttributes<HTMLInputElement> & InputControlProps
) {
  return (
    <div className="flex flex-col">
      <input
        className="bg-transparent  border-b-2 text-slate-300 outline-none w-full border-orange-300 active:border-orange-700 focus:border-orange-700 transition-all p-2 order-2"
        // {...props}
        onChange={props.onChange}
        onBlur={props.onBlur}
        placeholder={props.placeholder}
        type={props.type}
      />
      <label
        className={`text-lg text-orange-200 order-1 ${
          props.invalid === true ? "text-red-500" : ""
        }`}
        htmlFor={props.id}
      >
        {props.label}
      </label>

      {props.invalid === true && props.children !== undefined ? (
        <div className="order-3 text-sm text-red-500">{props.children}</div>
      ) : null}
    </div>
  );
}
