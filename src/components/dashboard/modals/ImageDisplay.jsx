import { useRef, useEffect } from "react";

const ImageDisplay = ({ imageURL, setIsOpen }) => {
  const wrapperRef = useRef();

  // Handler for closing the modal
  const handleClickOutside = (e) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    // Close the modal on click outside
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, []);

  return (
    <div className="fixed h-screen w-screen inset-0">
      <img
        ref={wrapperRef}
        src={imageURL}
        className="h-1/2 max-w-1/2 m-auto"
      ></img>
    </div>
  );
};

export default ImageDisplay;
