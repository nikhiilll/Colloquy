import { useEffect, useState, useRef, useContext } from "react";
import {
  getUsersList,
  createNewDualChat,
} from "../../../services/chatServices";
import { useChatContext } from "../../../context/ChatContext";
import { useAuthContext } from "../../../context/AuthContext";

const NewChat = ({ setIsOpen }) => {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const wrapperRef = useRef(null);
  const { setOpenedChat } = useChatContext();
  const { currentUser } = useAuthContext();

  // Create new chat
  const createNewChat = async (userId) => {
    const openedChat = await createNewDualChat(userId, currentUser.uid);
    setOpenedChat(openedChat);
    setIsOpen(false);
  };

  // Handler for closing the modal
  const handleClickOutside = (e) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const getUsers = async () => {
      let res = await getUsersList();
      setUsersList(res);
      setLoading(false);
    };

    getUsers();

    // Close the modal on click outside
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, []);
  return (
    <div
      className="bg-black text-white h-full w-full rounded-md p-2"
      ref={wrapperRef}
    >
      {/* Header */}
      <div className="h-1/8 p-4 text-xl font-semibold border-b-2 border-cfblue-400">
        Start a new chat
      </div>

      {/* List of people scrollable */}
      {loading && (
        <div className="flex items-center justify-center space-x-2 mt-32 animate-bounce">
          <div className="w-4 h-4 bg-cfblue-600 rounded-full"></div>
          <div className="w-4 h-4 bg-cfblue-600 rounded-full"></div>
          <div className="w-4 h-4 bg-cfblue-600 rounded-full"></div>
        </div>
      )}

      <div className="h-5/6 flex flex-col m-4">
        <div className="overflow-y-scroll no-scrollbar">
          {usersList.map((user) => {
            if (currentUser.uid === user.id) return;

            return (
              <div
                key={user.id}
                onClick={() => createNewChat(user.id)}
                className="flex space-x-3 items-center p-2 cursor-pointer group hover:bg-cfblue-400 rounded-md"
              >
                <img
                  src={user.profilePicUrl}
                  className="h-8 w-8 rounded-full"
                ></img>
                <p className="text-lg text-gray-100">{user.name}</p>
                {user?.online && (
                  <div className="bg-green-300 text-green-500 opacity-60 flex rounded-2xl text-xs p-1">
                    Online
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NewChat;
