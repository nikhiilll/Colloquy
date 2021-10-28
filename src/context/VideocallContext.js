import { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./AuthContext";
import { listenForVideoCalls } from "../services/videoCallService";

const VideoCallContext = createContext({
  incomingCall: false,
  setIncomingCall: () => {},
  inCall: false,
  setInCall: () => {},
  incomingCallInfo: {},
  setIncomingCallInfo: () => {},
  createdCall: false,
  setCreatedCall: () => {},
  usersList: [],
  setUsersList: () => {},
});

export const useVideoCallContext = () => {
  return useContext(VideoCallContext);
};

export const VideoCallContextProvider = ({ children }) => {
  const [incomingCall, setIncomingCall] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [incomingCallInfo, setIncomingCallInfo] = useState();
  const [createdCall, setCreatedCall] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const { currentUser } = useAuthContext();

  useEffect(() => {
    if (currentUser) {
      listenForVideoCalls(
        currentUser.uid,
        setIncomingCallInfo,
        setIncomingCall
      );
    }
  }, [currentUser]);

  const initialValue = {
    incomingCall,
    setIncomingCall,
    inCall,
    setInCall,
    incomingCallInfo,
    setIncomingCallInfo,
    createdCall,
    setCreatedCall,
    usersList,
    setUsersList,
  };

  return (
    <VideoCallContext.Provider value={initialValue}>
      {children}
    </VideoCallContext.Provider>
  );
};
