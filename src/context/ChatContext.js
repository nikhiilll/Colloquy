import { createContext, useEffect, useState, useContext } from "react";
import { getUserConversations } from "../services/userAccountService";
import { useAuthContext } from "./AuthContext";

const ChatContext = createContext({
  chats: [],
  setChats: () => {},
  openedChat: null,
  setOpenedChat: () => {},
});

export const useChatContext = () => {
  return useContext(ChatContext);
};

export const ChatContextProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [openedChat, setOpenedChat] = useState();
  const { currentUser } = useAuthContext();

  useEffect(() => {
    getUserConversations(currentUser.uid, setChats);
  }, []);

  const initialValue = {
    chats,
    setChats,
    openedChat,
    setOpenedChat,
  };

  return (
    <ChatContext.Provider value={initialValue}>{children}</ChatContext.Provider>
  );
};
