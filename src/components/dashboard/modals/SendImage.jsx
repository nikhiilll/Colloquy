import { useState, useEffect, useRef } from "react";
import {
  sendImageMessage,
  sendChatMessage,
} from "../../../services/chatServices";
import { v4 as uuidv4 } from "uuid";
import { useAuthContext } from "../../../context/AuthContext";

const SendImage = ({ setIsOpen, chatId }) => {
  const [selectedFile, setSelectedFile] = useState();
  const [previewFile, setPreviewFile] = useState();
  const [caption, setCaption] = useState("");
  const [sending, setSending] = useState(false);
  const wrapperRef = useRef();
  const { currentUser } = useAuthContext();

  useEffect(() => {
    if (!selectedFile) {
      setPreviewFile(undefined);
      return;
    }

    const imageURL = URL.createObjectURL(selectedFile);
    setPreviewFile(imageURL);

    return () => URL.revokeObjectURL(previewFile);
  }, [selectedFile]);

  useEffect(() => {
    // Close the modal on click outside
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, []);

  // Handler for closing the modal
  const handleClickOutside = (e) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  // File is selected
  const onFileSelect = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    setSelectedFile(e.target.files[0]);
  };

  const sendChat = async (e) => {
    e.preventDefault();
    setSending(true);
    const fileURL = await sendImageMessage(selectedFile);
    const messageData = {
      id: uuidv4(),
      content: caption,
      image: fileURL,
      createdAt: Date.now(),
      senderId: currentUser.uid,
      senderName: currentUser.displayName,
    };

    const result = await sendChatMessage(chatId, messageData);
    setIsOpen(false);
  };

  return sending ? (
    <div className="flex items-center justify-center space-x-2 mt-32 animate-bounce">
      <div className="w-4 h-4 bg-cfblue-600 rounded-full"></div>
      <div className="w-4 h-4 bg-cfblue-600 rounded-full"></div>
      <div className="w-4 h-4 bg-cfblue-600 rounded-full"></div>
    </div>
  ) : (
    <div
      className="bg-black text-gray-100 w-full rounded-md p-4 flex flex-col items-center"
      ref={wrapperRef}
    >
      {previewFile && (
        <div className="w-1/3 m-4">
          <img src={previewFile} className=" object-contain"></img>
        </div>
      )}

      <form onSubmit={sendChat} className="flex flex-col space-y-8">
        <label className="cursor-pointer w-full hover:bg-cfblue-500 p-3 rounded-lg border border-cfblue-500 text-center transition-colors duration-500 ease-in-out">
          Select Image
          <input
            type="file"
            accept="image/*"
            onChange={onFileSelect}
            className="hidden"
          ></input>
        </label>

        <div className="flex justify-between items-center">
          <input
            type="text"
            value={caption}
            placeholder="Message"
            onChange={(e) => setCaption(e.target.value)}
            className="outline-none w-4/5 bg-light-dark rounded-lg p-2 border-2 focus:border-cfblue-300 focus:placeholder-cfblue-300 text-gray-800 "
          ></input>
          <button
            type="submit"
            disabled={!selectedFile && !caption}
            className="w-1/5 ml-2 p-2 text-white  rounded-md shadow-md flex items-center bg-cfblue-600 hover:bg-cfblue-700 transition-colors duration-500 ease-in-out disabled:opacity-50 justify-center"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default SendImage;
