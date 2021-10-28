import { useState, useEffect, useRef } from "react";
import { useHistory, withRouter } from "react-router";
import { useAuthContext } from "../../context/AuthContext";
import { useVideoCallContext } from "../../context/VideocallContext";
import { declineIncomingCall } from "../../services/videoCallService";

const VideoCallBanner = ({ setIsOpen }) => {
  const wrapperRef = useRef(null);
  const { currentUser } = useAuthContext();
  const {
    setInCall,
    setIncomingCall,
    incomingCallInfo,
    setIncomingCallInfo,
    setCreatedCall,
    setUsersList,
  } = useVideoCallContext();
  const history = useHistory();
  let incomingCallAudio = new Audio("IncomingCall.mp3");
  incomingCallAudio.load();
  incomingCallAudio.loop = true;

  useEffect(() => {
    incomingCallAudio.play();

    return () => {
      incomingCallAudio.pause();
    };
  }, []);

  // Call handlers
  const acceptCall = () => {
    setInCall(true);
    setIncomingCall(false);
    history.push("/videocall");
  };

  const declineCall = () => {
    declineIncomingCall(incomingCallInfo.id, currentUser.uid);
    incomingCallAudio.pause();
    setCreatedCall(false);
    setIncomingCallInfo(false);
    setIncomingCall(false);
    setInCall(false);
    setUsersList([]);
  };

  // Handler for closing the modal
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
      className="bg-black text-gray-100 max-h-full w-4/5 rounded-md p-8"
      ref={wrapperRef}
    >
      <div className="flex flex-col justify-center items-center">
        <div className="flex flex-col space-y-4">
          {/* Caller info */}
          <div className="flex space-x-2 justify-center items-center mb-6">
            <img
              src={incomingCallInfo.creatorPic}
              className="h-12 w-12 rounded-full"
            ></img>
            <p className="font-semibold text-2xl">
              {incomingCallInfo.creatorName} is calling
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-between text-white">
            <button
              type="button"
              className="p-3 px-6  bg-red-600 rounded-xl hover:bg-red-800 transition-colors duration-150 ease-in-out shadown-sm"
              onClick={declineCall}
            >
              Decline
            </button>
            <button
              type="button"
              className="p-3 px-6  rounded-xl bg-cfblue-600 hover:bg-cfblue-700  transition-colors duration-150 ease-in-out shadow-sm"
              onClick={acceptCall}
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const VideoCallBannerRouter = withRouter(VideoCallBanner);

export default VideoCallBannerRouter;
