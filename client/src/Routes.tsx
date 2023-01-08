import { useRoutes } from "react-router-dom";
import AuthGuard from "./auth/auth.guard";
import GuestGuard from "./auth/guest.guard";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Chat from "./pages/chat/Chat";

export default function Routes() {
  return useRoutes([
    {
      path: "/",
      element: (
        <AuthGuard>
          <Chat />
        </AuthGuard>
      ),
    },
    {
      path: "/login",
      element: (
        <GuestGuard>
          <Login />
        </GuestGuard>
      ),
    },
    {
      path: "/signup",
      element: (
        <GuestGuard>
          <Signup />
        </GuestGuard>
      ),
    },
  ]);
}
