import { useContext } from "react";
import { Navigate } from "react-router";
import { AuthContext } from "./auth.context";

export default function GuestGuard(props: { children?: React.ReactNode }) {
  const auth = useContext(AuthContext);

  if (auth.isAuth) {
    return <Navigate to="/" />;
  } else {
    return <>{props.children}</>;
  }
}
