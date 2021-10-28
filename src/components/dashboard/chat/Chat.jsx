import { useChatContext } from "../../../context/ChatContext";
import { useEffect, useRef, useState } from "react";
import {
  getChatParticipants,
  getUserChats,
} from "../../../services/chatServices";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";

import { useAuthContext } from "../../../context/AuthContext";
import { getUserData } from "../../../services/userAccountService";
import { useVideoCallContext } from "../../../context/VideocallContext";
import { useHistory, withRouter } from "react-router";
import Modal from "../../Modal";
import ChatInfo from "../modals/ChatInfo";
import AddParticipants from "../modals/AddParticipants";

const ChatWithoutRouter = () => {
  const [chatData, setChatData] = useState();
  const [participants, setParticipants] = useState([]);
  const [dualChatParticipant, setDualChatParticipant] = useState();
  const [participantString, setParticipantString] = useState("");
  const [chatName, setChatName] = useState("");
  const [chatInfo, setChatInfo] = useState(false);
  const [addParticipants, setAddParticipants] = useState(false);

  const bottomRef = useRef();

  const { openedChat } = useChatContext();
  const videoCallCtx = useVideoCallContext();
  const { currentUser } = useAuthContext();

  const history = useHistory();

  // Get Chat name in case dualname is not set
  const getUserName = async (userId) => {
    const userData = await getUserData(userId);
    setDualChatParticipant(userData);
    setChatName(userData.name);
  };

  // Get participant names
  const getParticipants = async () => {
    const res = await getChatParticipants(openedChat?.participants);
    let pString = "";
    res.map((p) => {
      pString = pString + ", " + p.name;
    });
    setParticipantString(pString.substr(2));
    setParticipants([...res]);
  };

  // Create call
  const videoCallUsers = () => {
    const callUsersList = participants
      .map((p) => p.id)
      .filter((p) => p !== currentUser.uid);
    videoCallCtx.setUsersList(callUsersList);
    videoCallCtx.setCreatedCall(true);
    history.push("/videocall");
  };

  const scrollIntoView = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setParticipants([]);
    setParticipantString("");
    if (openedChat) {
      getUserChats(openedChat?.messagesRef, setChatData, scrollIntoView);
      getParticipants();

      // Get user name if dual name is not set
      if (!openedChat.group && !openedChat.dualName) {
        for (let p of openedChat.participants) {
          if (p !== currentUser.uid) {
            getUserName(p);
            break;
          }
        }
      }

      setDualChatParticipant(openedChat.dualParticipant);
    }
  }, [openedChat]);

  useEffect(() => {
    scrollIntoView();
  }, [chatData]);

  return openedChat ? (
    <div className="grid grid-rows-6 grid-cols-1 w-full h-full bg-pale-white rounded-md mt-2 sm:mt-0 sm:ml-2">
      {/* Chat Header */}
      <div className="bg-gray-100 text-gray-900 shadow-lg rounded-md px-6 py-2 flex justify-between items-center">
        <div
          onClick={() => setChatInfo(true)}
          className="flex flex-col cursor-pointer hover:text-cfblue-600"
        >
          {openedChat.group && (
            <p className="text-2xl font-bold">{openedChat.name}</p>
          )}
          {!openedChat.group && (
            <p className="text-2xl font-bold">{openedChat.dualName}</p>
          )}
          {!openedChat.name && !openedChat.dualName && (
            <p className="text-2xl font-bold">{chatName}</p>
          )}
          {openedChat.group && (
            <p className="text-sm text-gray-600">
              {`Members: ` + participantString}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-6">
          {/* Add new participants */}
          {openedChat.group && (
            <div
              onClick={() => setAddParticipants(true)}
              className="cursor-pointer hover:text-cfblue-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
          )}

          {/* Video call button */}
          <div
            onClick={videoCallUsers}
            className="cursor-pointer hover:text-cfblue-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-9 w-9"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Chat Messages Component */}
      <div className=" row-span-5 overflow-y-scroll no-scrollbar">
        {chatData && <ChatMessages messages={chatData} />}
        <div ref={bottomRef}></div>
      </div>

      {/* Chat Input */}
      <div className="row-span-1 mt-1">
        <ChatInput chatId={openedChat?.messagesRef} />
      </div>

      {chatInfo && (
        <Modal isOpen={chatInfo}>
          <ChatInfo
            isGroup={openedChat.group}
            setIsOpen={setChatInfo}
            participantInfo={
              openedChat.group
                ? { ...openedChat, participants }
                : dualChatParticipant
            }
          ></ChatInfo>
        </Modal>
      )}

      {addParticipants && (
        <Modal isOpen={addParticipants}>
          <AddParticipants
            setIsOpen={setAddParticipants}
            participants={participants}
          ></AddParticipants>
        </Modal>
      )}
    </div>
  ) : null;
};

const Chat = withRouter(ChatWithoutRouter);
export default Chat;
