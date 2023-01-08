import NavBar from "./NavBar";

export default function Layout(props: { children?: React.ReactNode }) {
  return (
    <div className="w-screen h-screen flex flex-col">
      <NavBar />
      <div className="w-full h-full bg-slate-900 text-slate-200 font-mono overflow-x-hidden overflow-y-auto">
        {props.children}
      </div>
    </div>
  );
}
