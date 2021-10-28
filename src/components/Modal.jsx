import { useRef, useEffect, createContext } from "react";
import { createPortal } from "react-dom";

const Modal = ({ children, isOpen }) => {
  if (isOpen) {
    return createPortal(
      <>
        <div className="fixed inset-0 bg-black opacity-60 z-100"></div>
        <div className="fixed inset-0 z-100 flex justify-center items-center">
          <div className="max-h-4/5 w-1/3">{children}</div>
        </div>
      </>,
      document.getElementById("modal")
    );
  }

  return null;
};

export default Modal;
