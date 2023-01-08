import React, { useCallback, useState, useEffect } from "react";
import axios from "../helpers/axios";

interface UserType {
  username: string;
  name: string;
  email: string;
  token: string;
}

export interface AuthContextType {
  isAuth: boolean;
  user: UserType | null;

  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = React.createContext<AuthContextType>({
  isAuth: false,
  user: null,
  login: async (username, pass) => {
    return false;
  },
  logout: () => {},
});

export function AuthContextProvider(props: { children?: React.ReactNode }) {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const { data } = await axios.post("/auth/login", { username, password });
      const user: UserType = {
        username: data.username,
        name: data.name,
        email: data.email,
        token: data.token,
      };

      setUser(user);
      setIsAuth(true);

      localStorage.setItem("auth-token", user.token);

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("auth-token");
    setIsAuth(false);
    setUser(null);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (token == null) {
      return;
    }

    axios
      .post("/auth/verify-token")
      .then((res) => {
        setIsAuth(true);
        setUser(res.data);
      })
      .catch((err) => {
        // token was invalidated;
        localStorage.removeItem("auth-token");
      });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuth,
        user,
        login,
        logout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
