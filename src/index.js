import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";

ReactDOM.render(
  <div className="bg-black h-screen w-screen flex items-center">
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </div>,
  document.getElementById("root")
);
