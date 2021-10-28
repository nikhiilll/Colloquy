import { useEffect, useState, useRef, useContext } from "react";
import {
  createNewGroupChat,
  getUsersList,
} from "../../../services/chatServices";
import { useChatContext } from "../../../context/ChatContext";
import { useAuthContext } from "../../../context/AuthContext";

const NewGroup = ({ setIsOpen }) => {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const wrapperRef = useRef(null);
  const { setOpenedChat } = useChatContext();
  const { currentUser } = useAuthContext();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState("");

  // Handler for closing the modal
  const handleClickOutside = (e) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  const addUser = (userId, user) => {
    if (selectedUsers.some((su) => su.id == userId)) return;
    setSelectedUsers((prev) => [user, ...prev]);
  };

  const removeUser = (userId) => {
    const temp = selectedUsers.filter((su) => su.id != userId);
    setSelectedUsers([...temp]);
  };

  const createGroup = async (e) => {
    e.preventDefault();
    const participants = selectedUsers.map((se) => se.id);
    participants.push(currentUser.uid);
    const newChat = await createNewGroupChat(participants, groupName);
    setOpenedChat(newChat);
    setIsOpen(false);
  };

  // Get user list to add participants
  const getUsers = async () => {
    const res = await getUsersList();
    const temp = res.filter((user) => user.id !== currentUser.uid);
    setUsersList(temp);
    setLoading(false);
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
      className="bg-black text-white h-full w-full rounded-md p-2"
      ref={wrapperRef}
    >
      {/* Header */}
      <div className="p-4 text-xl font-semibold border-b-2 border-cfblue-400">
        Create a new group
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
                className="flex space-x-1 bg-cfblue-400 rounded-xl p-2 items-center mt-1"
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
      <div className="max-h-1/2 flex flex-col m-4">
        <div className="overflow-y-scroll">
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
      </div>

      <form
        onSubmit={createGroup}
        className="flex p-2 justify-center items-center"
      >
        <input
          type="text"
          placeholder="Enter group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="p-2 outline-none rounded-md w-3/4 border-2 focus:border-cfblue-300 focus:placeholder-cfblue-300 text-gray-800 "
        ></input>
        <div className=" w-1/4 flex justify-center items-center">
          <button
            type="submit"
            disabled={
              !(groupName.trim().length > 0) || selectedUsers.length === 0
            }
            className="p-2 px-3 text-white  rounded-md shadow-md flex items-center bg-cfblue-600 hover:bg-cfblue-700 transition-colors duration-500 ease-in-out disabled:opacity-50"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewGroup;
