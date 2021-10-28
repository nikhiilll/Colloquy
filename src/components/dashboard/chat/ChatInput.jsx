import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAuthContext } from "../../../context/AuthContext";
import { sendChatMessage } from "../../../services/chatServices";
import Modal from "../../Modal";
import SendImage from "../modals/SendImage";

const ChatInput = ({ chatId }) => {
  const { currentUser } = useAuthContext();
  const [message, setMessage] = useState("");
  const [openSendPictureModal, setOpenSendPictureModal] = useState(false);

  const sendMessageHandler = async (e) => {
    e.preventDefault();
    if (!message) return;
    const messageData = {
      id: uuidv4(),
      content: message,
      createdAt: Date.now(),
      senderId: currentUser.uid,
      senderName: currentUser.displayName,
    };

    setMessage("");
    const result = await sendChatMessage(chatId, messageData);
  };

  return (
    <div className="px-4">
      <form
        onSubmit={sendMessageHandler}
        className="flex items-center justify-between w-full m-2 h-full space-x-3"
      >
        {/* Chat message input */}
        <input
          type="text"
          placeholder="Send a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-10/12 p-3 rounded-xl outline-none border-2 focus:border-cfblue-300 focus:placeholder-cfblue-300 text-gray-800 "
        ></input>

        {/* Send image */}
        <div
          onClick={() => setOpenSendPictureModal((prev) => !prev)}
          className="flex items-center justify-center hover:text-cfblue-600 cursor-pointer text-gray-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
        </div>

        {/* Send message */}
        <div className="w-2/12 flex justify-center items-center">
          <button
            type="submit"
            className="p-3 w-full rounded-xl bg-cfblue-600 hover:bg-cfblue-700 transition-colors duration-400 ease-in-out"
          >
            Send
          </button>
        </div>
      </form>

      {openSendPictureModal && (
        <Modal isOpen={setOpenSendPictureModal}>
          <SendImage
            setIsOpen={setOpenSendPictureModal}
            chatId={chatId}
          ></SendImage>
        </Modal>
      )}
    </div>
  );
};

export default ChatInput;
