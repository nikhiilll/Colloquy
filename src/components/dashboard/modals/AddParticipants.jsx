import { useRef, useState, useEffect } from "react";
import { useAuthContext } from "../../../context/AuthContext";
import { useChatContext } from "../../../context/ChatContext";
import {
  getUsersList,
  addParticipantsGroup,
} from "../../../services/chatServices";

const AddParticipants = ({ setIsOpen, participants }) => {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const { currentUser } = useAuthContext();
  const { openedChat, setOpenedChat } = useChatContext();

  const wrapperRef = useRef();

  const handleClickOutside = (e) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  const getUsers = async () => {
    const compare = (userid) => {
      for (let p of participants) {
        if (p.id === userid) return false;
      }
      return true;
    };

    const res = await getUsersList();
    const temp = res.filter((user) => compare(user.id));
    setUsersList(temp);
    setLoading(false);
  };

  const addUser = (userId, user) => {
    if (selectedUsers.some((su) => su.id == userId)) return;
    setSelectedUsers((prev) => [user, ...prev]);
  };

  const removeUser = (userId) => {
    const temp = selectedUsers.filter((su) => su.id != userId);
    setSelectedUsers([...temp]);
  };

  const addUsersToGroup = async () => {
    setLoading(true);
    const userIds = selectedUsers.map((su) => su.id);
    const result = await addParticipantsGroup(openedChat.id, userIds);
    setOpenedChat((prevData) => ({
      ...prevData,
      participants: [...prevData.participants, ...userIds],
    }));
    setIsOpen(false);
  };

  useEffect(() => {
    getUsers();

    // Close the modal on click outside
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, []);

  return (
    <div
      className="bg-black text-white max-h-full w-full rounded-md p-2 flex flex-col"
      ref={wrapperRef}
    >
      {/* Header */}
      <div className="h-1/8 p-4 text-xl font-semibold border-b-2 border-cfblue-400">
        Add users
      </div>

      {/* List of people scrollable */}
      {loading && (
        <div className="flex items-center justify-center space-x-2 mt-32 animate-bounce">
          <div className="w-4 h-4 bg-cfblue-600 rounded-full"></div>
          <div className="w-4 h-4 bg-cfblue-600 rounded-full"></div>
          <div className="w-4 h-4 bg-cfblue-600 rounded-full"></div>
        </div>
      )}

      {selectedUsers && (
        <div className="flex space-x-2 flex-wrap m-2">
          {selectedUsers.map((suser) => {
            return (
              <div
                key={suser.id}
                className="flex space-x-1 bg-cfblue-400 rounded-xl p-2 items-center"
              >
                <p>{suser.name}</p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeUser(suser.id);
                  }}
                  className="hover:text-cfblue-600 flex item"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}
      <div className="flex flex-col overflow-y-scroll no-scrollbar m-4">
        {usersList.map((user) => {
          if (currentUser.uid === user.id) return;

          return (
            <div
              key={user.id}
              onClick={() => addUser(user.id, user)}
              className="flex space-x-3 items-center p-2 cursor-pointer group hover:bg-cfblue-400 rounded-md"
            >
              <img
                src={user.profilePicUrl}
                className="h-8 w-8 rounded-full"
              ></img>
              <p className="text-lg text-gray-100">{user.name}</p>
            </div>
          );
        })}
      </div>

      <button
        disabled={selectedUsers.length === 0}
        onClick={addUsersToGroup}
        className="p-2 px-3 text-white self-center  rounded-md shadow-md flex items-center bg-cfblue-600 hover:bg-cfblue-700 transition-colors duration-500 ease-in-out disabled:opacity-50"
      >
        Add to group
      </button>
    </div>
  );
};

export default AddParticipants;
