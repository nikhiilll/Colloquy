import { useEffect, useState } from "react";
import { useAuthContext } from "../../../context/AuthContext";
import { useChatContext } from "../../../context/ChatContext";
import { getUserData } from "../../../services/userAccountService";

const Conversation = ({ chat, setOpenedChat }) => {
  const { currentUser } = useAuthContext();
  const [chatName, setChatName] = useState("");

  const getUserName = async (userId) => {
    const userData = await getUserData(userId);
    chat.dualName = userData.name;
    chat.dualParticipant = userData;
    setChatName(userData.name);
  };

  useEffect(() => {
    if (chat.group) {
      setChatName(chat.name);
    } else {
      for (let p of chat.participants) {
        if (p !== currentUser.uid) {
          getUserName(p);
          break;
        }
      }
    }
  }, []);

  return (
    <div
      className="w-full text-gray-300 hover:bg-cfblue-600 hover:text-cfblue-200 border-t border-gray-700 p-4 h-16 transition-colors duration-800 ease-in-out cursor-pointer"
      onClick={() => setOpenedChat(chat)}
    >
      <p className="lg:text-lg font-semibold">{chatName}</p>
    </div>
  );
};

export default Conversation;
