import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../auth/auth.context";
import Button from "./Button";

function NavBarLink(props: { path: string; label: string }) {
  const clsName =
    "text-lg select-none cursor-pointer font-mono text-slate-300 hover:text-orange-400 transition-all";
  return (
    <NavLink
      to={props.path}
      className={({ isActive }) =>
        `${clsName} ${isActive ? "font-bold text-orange-400" : ""}`
      }
    >
      {props.label}
    </NavLink>
  );
}

export default function NavBar() {
  const auth = useContext(AuthContext);

  const loginActions = (
    <div className="flex gap-5">
      <NavBarLink label="login" path="/login" />
      <NavBarLink label="signup" path="/signup" />
    </div>
  );

  return (
    <div className="flex justify-around p-3 bg-slate-800 text-slate-300 items-center border-b-4 border-b-slate-900">
      <div
        className="
          text-2xl
          select-none
          tracking-wider
          first-letter:text-3xl
          font-mono
          font-bold
          italic
          text-orange-400"
      >
        silence
      </div>

      {auth && auth.isAuth ? (
        <div className="flex gap-5 font-mono items-center">
          <p>Hi {auth.user.name}!</p>
          <Button className="px-4" onClick={auth.logout}>
            logout
          </Button>
        </div>
      ) : (
        loginActions
      )}
    </div>
  );
}
