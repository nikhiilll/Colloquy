import { useRef, useEffect } from "react";

const VideoCard = ({ stream, isMuted }) => {
  const srcRef = useRef();

  useEffect(() => {
    srcRef.current.srcObject = stream;
  }, []);

  return (
    <video
      ref={srcRef}
      autoPlay
      muted={isMuted}
      playsInline
      controls={false}
      width={400}
      height={400}
    />
  );
};

export default VideoCard;
