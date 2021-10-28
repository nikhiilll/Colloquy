import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import {
  loginUserFacebook,
  loginUserGoogle,
  logoutUser,
} from "../services/firebaseLoginService";

const AuthContext = createContext({
  currentUser: null,
  loginUserGoogle: () => {},
  loginUserFacebook: () => {},
  logoutUser: () => {},
});

export const useAuthContext = () => {
  return useContext(AuthContext);
};

const lsUserData = JSON.parse(localStorage.getItem("colloquy-userdata"));

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(lsUserData || null);
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        localStorage.setItem("colloquy-userdata", JSON.stringify(user));
      } else {
        localStorage.removeItem("colloquy-userdata");
        setCurrentUser(null);
      }
    });

    return () => logoutUser(currentUser);
  }, []);

  const initialValue = {
    currentUser: currentUser,
    loginUserFacebook: loginUserFacebook,
    loginUserGoogle: loginUserGoogle,
    logoutUser: logoutUser,
  };

  return (
    <AuthContext.Provider value={initialValue}>{children}</AuthContext.Provider>
  );
};
