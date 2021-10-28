import { useState } from "react";
import { useChatContext } from "../../../context/ChatContext";
import ProfileSnap from "../Profile/ProfileSnap";
import Conversation from "./Conversation";
import Modal from "../../Modal";
import NewChat from "../modals/NewChat";
import NewGroup from "../modals/NewGroup";
import { useVideoCallContext } from "../../../context/VideocallContext";
import VideoCallBanner from "../../videoCall/VideoCallBanner";

const Conversations = () => {
  const { chats, setOpenedChat } = useChatContext();
  const videoCallCtx = useVideoCallContext();
  const [openNewChatModal, setOpenNewChatModal] = useState(false);
  const [openNewGroupModal, setOpenNewGroupModal] = useState(false);

  return (
    <div className="w-full h-full sm:w-1/4 rounded-md shadow-xl bg-black flex flex-col">
      {/* <div className="h-1/5"> */}
      <ProfileSnap />
      {/* </div> */}
      <div className="flex flex-col h-3/5 overflow-y-scroll no-scrollbar">
        {chats.map((chat) => (
          <Conversation
            key={chat.id}
            chat={chat}
            setOpenedChat={setOpenedChat}
          />
        ))}
      </div>

      {/* New chat buttons */}
      <div className="flex flex-col xl:flex-row w-full h-1/5 justify-evenly items-center">
        <button
          className="p-3 outline-none h-1/3 rounded-md shadow-md flex items-center bg-cfblue-600 hover:bg-cfblue-700 transition-colors duration-500 ease-in-out"
          onClick={() => setOpenNewGroupModal(true)}
        >
          New Group
        </button>
        <button
          className="p-3 outline-none h-1/3 rounded-md shadow-md flex items-center bg-cfblue-600 hover:bg-cfblue-700 transition-colors duration-500 ease-in-out"
          onClick={() => setOpenNewChatModal(true)}
        >
          New Chat
        </button>
      </div>

      {openNewChatModal && (
        <Modal isOpen={openNewChatModal}>
          <NewChat setIsOpen={setOpenNewChatModal} />
        </Modal>
      )}

      {openNewGroupModal && (
        <Modal isOpen={openNewGroupModal}>
          <NewGroup setIsOpen={setOpenNewGroupModal} />
        </Modal>
      )}

      {videoCallCtx.incomingCall && (
        <Modal isOpen={videoCallCtx.incomingCall}>
          <VideoCallBanner
            setIsOpen={videoCallCtx.setIncomingCall}
          ></VideoCallBanner>
        </Modal>
      )}
    </div>
  );
};

export default Conversations;
