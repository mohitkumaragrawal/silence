import { useContext } from "react";
import { Navigate } from "react-router";
import { AuthContext } from "./auth.context";

export default function AuthGuard(props: { children?: React.ReactNode }) {
  const auth = useContext(AuthContext);

  if (auth.isAuth) {
    return <>{props.children}</>;
  } else {
    return <Navigate to="/login" />;
  }
}
