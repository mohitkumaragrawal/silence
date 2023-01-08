export default function Button(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  return (
    <button
      {...props}
      className={`bg-orange-700 hover:bg-orange-800 active:translate-y-1 transition-all rounded-lg py-2 disabled:bg-slate-700 ${props.className}`}
    >
      {props.children}
    </button>
  );
}
