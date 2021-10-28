import { useState, useEffect } from "react";
import { useRef } from "react";
import { changeUserStatus } from "../../../services/userAccountService";

const ChangeStatus = ({ setIsOpen, updateUserData, userId }) => {
  const wrapperRef = useRef();
  const [updatedStatus, setUpdatedStatus] = useState("");

  // Handler for closing the modal
  const handleClickOutside = (e) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const res = changeUserStatus(userId, updatedStatus);
    updateUserData((prevData) => ({ ...prevData, status: updatedStatus }));
    setIsOpen(false);
  };

  useEffect(() => {
    // Close the modal on click outside
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, []);

  return (
    <div
      className="bg-black text-white max-h-full w-full rounded-md p-2"
      ref={wrapperRef}
    >
      {/* Header */}
      <div className="h-1/8 p-4 text-xl font-semibold border-b-2 border-cfblue-400">
        Edit status
      </div>

      <form
        onSubmit={onSubmitHandler}
        className="flex justify-between items-center p-4"
      >
        <input
          type="text"
          onChange={(e) => setUpdatedStatus(e.target.value)}
          value={updatedStatus}
          placeholder="Edit status"
          maxLength="60"
          className="outline-none w-4/5 bg-light-dark rounded-lg p-2 border-2 focus:border-cfblue-300 focus:placeholder-cfblue-300 text-gray-800 "
        ></input>
        <button
          type="submit"
          disabled={!updatedStatus.trim()}
          className="w-1/5 ml-2 p-2 text-white  rounded-md shadow-md flex items-center bg-cfblue-600 hover:bg-cfblue-700 transition-colors duration-500 ease-in-out disabled:opacity-50 justify-center"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default ChangeStatus;
