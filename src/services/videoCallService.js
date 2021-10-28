import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  addDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  writeBatch,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";

export const listenForVideoCalls = async (
  userId,
  setIncomingVideoCallInfo,
  setIncomingCall
) => {
  const q = query(
    collection(db, "videocalls"),
    where("receivingCall", "array-contains", userId)
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      setIncomingVideoCallInfo({ id: doc.id, ...doc.data() });
      setIncomingCall(true);
    });
  });
};

// Create RTC offers
const STUN_SERVERS = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

const createRTCOffers = async (
  participants,
  userId,
  tracks,
  docId,
  setStreams,
  rtcConnections
) => {
  const offers = new Map();
  const offerICECollectionRef = collection(db, `videocalls/${docId}/offerICE`);

  for (let participant of participants) {
    // Do not create offer the current user in participant array
    if (participant === userId) continue;

    let pc = new RTCPeerConnection(STUN_SERVERS);
    let temp = rtcConnections.current;
    rtcConnections.current = [[participant, pc], ...temp];

    // Add local video and audio tracks to connection
    tracks.getTracks().forEach((track) => {
      pc.addTrack(track);
    });

    // On ice candidate handler
    pc.onicecandidate = (event) =>
      handleICEEvent(userId, participant, offerICECollectionRef, event);

    // Remote stream event handler
    const remoteStream = new MediaStream();
    pc.ontrack = (event) =>
      handleTrackEvent(participant, remoteStream, event, setStreams);

    // Participant left handler
    pc.oniceconnectionstatechange = (event) =>
      handleParticipantLeftEvent(pc, participant, setStreams);

    // Create the offer SDP
    const sessionDescription = await pc.createOffer();
    pc.setLocalDescription(sessionDescription);

    // Add the RTC connection to map for each participant
    offers.set(participant, {
      offerSDP: sessionDescription,
      sender: userId,
      receiver: participant,
      remoteStream: remoteStream,
      rtcConn: pc,
    });
  }

  return offers;
};

const writeSDPOffers = async (
  participants,
  userId,
  tracks,
  docId,
  setStreams,
  rtcConnections
) => {
  // Get the map of RTC connection offers
  const sdpOffers = await createRTCOffers(
    participants,
    userId,
    tracks,
    docId,
    setStreams,
    rtcConnections
  );
  const offerCollectionRef = collection(db, `videocalls/${docId}/offers`);

  for (let value of sdpOffers.values()) {
    await addDoc(offerCollectionRef, {
      offer: JSON.stringify(value.offerSDP),
      sender: value.sender,
      receiver: value.receiver,
    });
  }

  return sdpOffers;
};

export const joinVideoCall = async (
  docId,
  userId,
  tracks,
  setStreams,
  rtcConnections
) => {
  // Get participants list from call data
  const docSnap = await getDoc(doc(db, "videocalls", docId));
  const videoCallInfo = docSnap.data();

  // Add current user to participants
  updateDoc(doc(db, "videocalls", docId), {
    participants: arrayUnion(userId),
    receivingCall: arrayRemove(userId),
  });

  // Create and write SDP offers for every participant
  const sdpOffers = await writeSDPOffers(
    videoCallInfo.participants || [],
    userId,
    tracks,
    docId,
    setStreams,
    rtcConnections
  );

  // Listen to SDP answers for current user
  const answersCollectionRef = collection(db, `videocalls/${docId}/answers`);
  const answerICECollectionRef = collection(
    db,
    `videocalls/${docId}/answerICE`
  );

  const answersQ = query(answersCollectionRef, where("receiver", "==", userId));
  const unsubscribeAnswers = onSnapshot(answersQ, (querySnapshot) => {
    querySnapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        const answerData = change.doc.data();

        const reqdRTCConn = sdpOffers.get(answerData.sender);
        reqdRTCConn.rtcConn.setRemoteDescription(
          new RTCSessionDescription(JSON.parse(answerData.offer))
        );
      }
    });
  });

  // Listen to Answer ICE candidates
  const qICE = query(answerICECollectionRef, where("receiver", "==", userId));
  const unsubscribeICE = onSnapshot(qICE, (querySnapshot) => {
    querySnapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        const answerICE = change.doc.data();
        const candidate = new RTCIceCandidate(answerICE.candidates);
        const reqdRTCConn = sdpOffers.get(answerICE.sender);
        reqdRTCConn.rtcConn.addIceCandidate(candidate);
      }
    });
  });

  //   Call the listenVideoCall function to listen for any new users that join the call
  listenVideoCall(docId, userId, tracks, sdpOffers, setStreams, rtcConnections);
};

const listenVideoCall = async (
  docId,
  userId,
  tracks,
  sdpOffers,
  setStreams,
  rtcConnections
) => {
  const offerCollectionRef = collection(db, `videocalls/${docId}/offers`);
  const answerCollectionRef = collection(db, `videocalls/${docId}/answers`);
  const offerICECollectinRef = collection(db, `videocalls/${docId}/offerICE`);
  const answerICECollectionRef = collection(
    db,
    `videocalls/${docId}/answerICE`
  );

  // Listen for any offers made
  const qListenToOffers = query(
    offerCollectionRef,
    where("receiver", "==", userId)
  );
  const unsubscribeListenOffers = onSnapshot(
    qListenToOffers,
    (querySnapshot) => {
      // querySnapshot.forEach(async (doc) => {
      querySnapshot.docChanges().forEach(async (change) => {
        if (change.type === "added") {
          const offerData = change.doc.data();
          let pc = new RTCPeerConnection(STUN_SERVERS);

          let temp = rtcConnections.current;
          rtcConnections.current = [[offerData.sender, pc], ...temp];

          // Add local video and audio tracks to connection
          tracks.getTracks().forEach((track) => {
            pc.addTrack(track);
          });

          // On ice candidate handler
          pc.onicecandidate = (event) =>
            handleICEEvent(
              userId,
              offerData.sender,
              answerICECollectionRef,
              event
            );

          // Remote stream event handler
          const remoteStream = new MediaStream();
          pc.ontrack = (event) =>
            handleTrackEvent(offerData.sender, remoteStream, event, setStreams);
          pc.setRemoteDescription(
            new RTCSessionDescription(JSON.parse(offerData.offer))
          );

          // Participant left handler
          pc.oniceconnectionstatechange = (event) =>
            handleParticipantLeftEvent(pc, offerData.sender, setStreams);

          // Create the answer SDP
          const sessionDescription = await pc.createAnswer();
          pc.setLocalDescription(sessionDescription);

          // Add the RTC connection to map for each participant
          sdpOffers.set(offerData.sender, {
            offerSDP: sessionDescription,
            sender: userId,
            receiver: offerData.sender,
            remoteStream: remoteStream,
            rtcConn: pc,
          });

          // Write the answer to the answers collection
          addDoc(answerCollectionRef, {
            offer: JSON.stringify(sessionDescription),
            sender: userId,
            receiver: offerData.sender,
          });

          // Listen to offer ICE candidates
          const qICE = query(
            offerICECollectinRef,
            where("receiver", "==", userId)
          );
          const unsubscribeICE = onSnapshot(qICE, (querySnapshot) => {
            querySnapshot.docChanges().forEach((change) => {
              if (change.type === "added") {
                const offerICE = change.doc.data();
                const candidate = new RTCIceCandidate(offerICE.candidates);
                const reqdRTCConn = sdpOffers.get(offerICE.sender);
                reqdRTCConn.rtcConn.addIceCandidate(candidate);
              }
            });
          });
        }
      });
    }
  );
};

export const createCall = async (
  user,
  callUsersList,
  tracks,
  setStreams,
  rtcConnections,
  videoCallId
) => {
  const docRef = await addDoc(collection(db, "videocalls"), {
    participants: [],
    receivingCall: callUsersList,
    creatorName: user.displayName,
    creatorPic: user.photoURL,
  });

  videoCallId.current = docRef.id;
  joinVideoCall(docRef.id, user.uid, tracks, setStreams, rtcConnections);
  setTimeout(async () => {
    await updateDoc(docRef, {
      receivingCall: [],
    });
  }, 15000);
};

export const leaveCall = async (docId, userId, rtcConnections) => {
  rtcConnections.current.forEach(([participant, pc]) => {
    pc.close();
    pc = null;
  });

  rtcConnections.current = [];

  await updateDoc(doc(db, "videocalls", docId), {
    participants: arrayRemove(userId),
  });

  // Get all the references for cleanup
  const offerCollectionRef = collection(db, `videocalls/${docId}/offers`);
  const answerCollectionRef = collection(db, `videocalls/${docId}/answers`);
  const offerICECollectinRef = collection(db, `videocalls/${docId}/offerICE`);
  const answerICECollectionRef = collection(
    db,
    `videocalls/${docId}/answerICE`
  );

  const offerDocRefSnapshotSender = getDocs(
    offerCollectionRef,
    where("sender", "==", userId)
  );
  const offerDocRefSnapshotReceiver = getDocs(
    offerCollectionRef,
    where("receiver", "==", userId)
  );
  const answerCollectionRefSender = getDocs(
    answerCollectionRef,
    where("sender", "==", userId)
  );
  const answerCollectionRefReceiver = getDocs(
    answerCollectionRef,
    where("receiver", "==", userId)
  );
  const offerICECollectinRefSender = getDocs(
    offerICECollectinRef,
    where("sender", "==", userId)
  );
  const offerICECollectinRefReceiver = getDocs(
    offerICECollectinRef,
    where("receiver", "==", userId)
  );
  const answerICECollectionRefSender = getDocs(
    answerICECollectionRef,
    where("sender", "==", userId)
  );
  const answerICECollectionRefReceiver = getDocs(
    answerICECollectionRef,
    where("receiver", "==", userId)
  );

  let promises = [
    offerDocRefSnapshotSender,
    offerDocRefSnapshotReceiver,
    answerCollectionRefSender,
    answerCollectionRefReceiver,
    offerICECollectinRefSender,
    offerICECollectinRefReceiver,
    answerICECollectionRefSender,
    answerICECollectionRefReceiver,
  ];

  const deleteBatch = writeBatch(db);
  const results = await Promise.all(promises);

  results.forEach((result) => {
    result.forEach((res) => deleteBatch.delete(res.ref));
  });

  await deleteBatch.commit();
};

export const declineIncomingCall = async (docId, userId) => {
  await updateDoc(doc(db, "videocalls", docId), {
    receivingCall: arrayRemove(userId),
  });
};
// On track handlers
const handleTrackEvent = (participant, remoteStream, event, setStreams) => {
  if (event.track) {
    remoteStream.addTrack(event.track);
    setStreams((prevStreams) => {
      for (let [p, rs] of prevStreams) {
        if (rs === remoteStream) return prevStreams;
      }
      return [[participant, remoteStream], ...prevStreams];
    });
  }
};

const handleICEEvent = (userId, participant, collectionRef, event) => {
  if (event.candidate) {
    addDoc(collectionRef, {
      sender: userId,
      receiver: participant,
      candidates: event.candidate.toJSON(),
    });
  }
};

const handleParticipantLeftEvent = (pc, participant, setStreams) => {
  if (["disconnected", "failed", "closed"].includes(pc.iceConnectionState)) {
    setStreams((prevStreams) => {
      const updatedStreams = prevStreams.filter(
        ([userId, stream]) => userId !== participant
      );
      return updatedStreams;
    });
  }
};
