import { useRef, useState, useEffect } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { useAuthContext } from "../../../context/AuthContext";

const ChatInfoGroup = ({ participantInfo }) => {
  const { currentUser } = useAuthContext();
  return (
    <div className="flex flex-col space-y-5 p-4">
      {/* Participant list */}
      {participantInfo.participants.map((participant) => {
        if (participant.id !== currentUser.uid) {
          return (
            <div className="flex space-x-2">
              <img
                src={participant.profilePicUrl}
                className="h-10 w-10 rounded-full"
              ></img>
              <div className="flex flex-col">
                <p>{participant.name}</p>
                <p className="text-sm">{participant.status}</p>
              </div>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

const ChatInfoDual = ({ participantInfo }) => {
  return (
    <div className="flex flex-col items-center p-4 space-y-3">
      <img
        src={participantInfo.profilePicUrl}
        className="h-12 w-12 md:h-24 md:w-24 rounded-full"
      ></img>
      <p>{participantInfo.status}</p>
      {!participantInfo.online ? (
        <p className="text-xs text-green-700">Online</p>
      ) : (
        <p className="text-xs text-gray-200">
          Last seen:
          {" " +
            formatDistanceToNowStrict(
              new Date(participantInfo.lastSeen.seconds * 1000)
            ) +
            " ago"}
        </p>
      )}
    </div>
  );
};

const ChatInfo = ({ isGroup, setIsOpen, participantInfo }) => {
  const wrapperRef = useRef();

  const handleClickOutside = (e) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    // Close the modal on click outside
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, []);

  return (
    <div
      className="bg-black text-white max-h-full w-full rounded-md p-2"
      ref={wrapperRef}
    >
      {/* Header */}
      <div className="h-1/8 p-4 text-xl font-semibold border-b-2 border-cfblue-400">
        {participantInfo.name}
      </div>
      {isGroup && <ChatInfoGroup participantInfo={participantInfo} />}
      {!isGroup && <ChatInfoDual participantInfo={participantInfo} />}
    </div>
  );
};

export default ChatInfo;
