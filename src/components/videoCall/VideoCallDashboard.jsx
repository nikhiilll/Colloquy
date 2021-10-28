import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import { useAuthContext } from "../../context/AuthContext";
import { useVideoCallContext } from "../../context/VideocallContext";
import {
  joinVideoCall,
  leaveCall,
  createCall,
} from "../../services/videoCallService";
import VideoCard from "./VideoCard";

const VideoCallDashboard = () => {
  const [streams, setStreams] = useState([]);
  const [localStream, setLocalStream] = useState(null);
  const [endedCall, setEndedCall] = useState(false);
  const videoCallCtx = useVideoCallContext();
  const { currentUser } = useAuthContext();
  const rtcConnections = useRef([]);
  const selfStream = useRef(null);
  const videoCallId = useRef();
  const history = useHistory();

  // Get user video and audio
  const joinCall = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    selfStream.current = stream;
    setLocalStream(stream);

    if (videoCallCtx.createdCall) {
      createCall(
        currentUser,
        videoCallCtx.usersList,
        stream,
        setStreams,
        rtcConnections,
        videoCallId
      );
    } else {
      joinVideoCall(
        videoCallCtx.incomingCallInfo.id,
        currentUser.uid,
        stream,
        setStreams,
        rtcConnections
      );
    }
  };

  // End call
  const endCall = async () => {
    selfStream.current.getTracks().forEach((track) => track.stop());
    setEndedCall(true);
    leaveCall(
      videoCallId.current || videoCallCtx?.incomingCallInfo?.id,
      currentUser.uid,
      rtcConnections
    );
    history.push("/dashboard");
  };

  useEffect(() => {
    joinCall();

    return () => {
      videoCallCtx.setCreatedCall(false);
      videoCallCtx.setIncomingCallInfo(false);
      videoCallCtx.setIncomingCall(false);
      videoCallCtx.setInCall(false);
      videoCallCtx.setUsersList([]);
      selfStream.current.getTracks().forEach((track) => track.stop());
      if (!endedCall) {
        leaveCall(
          videoCallCtx?.incomingCallInfo?.id || videoCallId.current,
          currentUser.uid,
          rtcConnections
        );
      }
    };
  }, []);

  return (
    <>
      <div className="h-screen w-screen md:h-full md:w-full p-4">
        <div className="h-full w-full bg-cfblue-500 text-white flex justify-between shadow-lg rounded-md">
          <div className="flex flex-wrap space-x-2 space-y-2 p-8 justify-center">
            {localStream && <VideoCard stream={localStream} isMuted={true} />}
            {streams &&
              streams.map(([participant, stream]) => {
                return <VideoCard key={participant} stream={stream} />;
              })}
          </div>
        </div>
        {/* End call */}
        <div
          onClick={endCall}
          className="fixed bottom-1/10 left-1/2 cursor-pointer flex items-center justify-center h-12 w-12 p-2 bg-red-700 hover:bg-red-900 hover:scale-110 text-gray-100 transition-colors duration-100 ease-in-out rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            <path d="M16.707 3.293a1 1 0 010 1.414L15.414 6l1.293 1.293a1 1 0 01-1.414 1.414L14 7.414l-1.293 1.293a1 1 0 11-1.414-1.414L12.586 6l-1.293-1.293a1 1 0 011.414-1.414L14 4.586l1.293-1.293a1 1 0 011.414 0z" />
          </svg>
        </div>
      </div>
    </>
  );
};

export default VideoCallDashboard;
