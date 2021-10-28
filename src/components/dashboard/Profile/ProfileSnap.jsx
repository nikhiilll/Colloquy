import { useEffect, useState } from "react";
import { useHistory, withRouter } from "react-router";
import { useAuthContext } from "../../../context/AuthContext";
import {
  getUserData,
  getUserConversations,
} from "../../../services/userAccountService";
import Modal from "../../Modal";
import ChangeStatus from "../modals/ChangeStatus";

const ProfileSnapWithoutRouter = () => {
  const { currentUser, logoutUser } = useAuthContext();

  const [userData, setUserData] = useState({});
  const [openOptions, setOpenOptions] = useState(false);
  const [changeStatus, setChangeStatus] = useState(false);

  const history = useHistory();

  const getUser = async () => {
    const data = await getUserData(currentUser.uid);
    setUserData(data);
  };

  const logout = async () => {
    logoutUser(currentUser);
    history.push("/");
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="flex flex-row justify-between items-center text-gray-100">
      <div className="flex items-top p-4 space-x-4">
        <img
          src={currentUser.photoURL}
          className="h-12 w-12 lg:h-15 lg:w-15 rounded-full"
        ></img>
        <div className="flex flex-col space-y-2">
          <p className="text-sm lg:text-xl font-semibold break-words">
            {currentUser.displayName}
          </p>
          <p className="break-all text-sm">{userData.status}</p>
        </div>
      </div>

      {/* Options */}
      <div
        className="justify-self-end flex flex-col relative m-1"
        onMouseEnter={() => setOpenOptions(true)}
        onMouseLeave={() => setOpenOptions(false)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 hover:text-cfblue-500 cursor-pointer"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>

        {openOptions && (
          <div className="absolute top-6 right-3 flex flex-col bg-black border border-gray-700 rounded-md">
            <button
              onClick={() => setChangeStatus(true)}
              className="p-2 flex justify-center items-center whitespace-nowrap hover:bg-cfblue-500 rounded-md  transition-colors duration-300 ease-in-out"
            >
              Edit status
            </button>
            <button
              onClick={logout}
              className="p-2 hover:bg-cfblue-500 rounded-md  flex justify-center items-center transition-colors duration-300 ease-in-out"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {changeStatus && (
        <Modal isOpen={setChangeStatus}>
          <ChangeStatus
            setIsOpen={setChangeStatus}
            updateUserData={setUserData}
            userId={currentUser.uid}
          ></ChangeStatus>
        </Modal>
      )}
    </div>
  );
};

const ProfileSnap = withRouter(ProfileSnapWithoutRouter);

export default ProfileSnap;
