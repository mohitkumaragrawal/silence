export default function Heading(props: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <h1
      className={`text-3xl py-4 tracking-wide font-bold text-orange-400 ${props.className}`}
    >
      {props.children}
    </h1>
  );
}
