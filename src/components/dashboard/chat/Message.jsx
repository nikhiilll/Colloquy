import { formatDistanceToNowStrict } from "date-fns";
import { useState } from "react";
import { useAuthContext } from "../../../context/AuthContext";
import Modal from "../../Modal";
import ImageDisplay from "../modals/ImageDisplay";

const Message = ({ content, senderName, senderId, createdAt, image }) => {
  const { currentUser } = useAuthContext();
  const [openImageModal, setOpenImageModal] = useState(false);

  return currentUser.uid === senderId ? (
    <>
      <div className="self-end bg-white text-gray-900 shadow-md rounded-xl p-2 max-w-1/2 flex flex-col">
        <p className="font-semibold mb-1 lg:text-lg text-gray-900 ">
          {senderName}
        </p>
        {image && (
          <img
            src={image}
            className="max-h-20 lg:max-h-60 cursor-pointer"
            // onClick={() => {
            //   setOpenImageModal(true);
            // }}
          ></img>
        )}
        <p className="text-gray-800 break-words">{content}</p>
        <p className="text-xs text-gray-500">
          {formatDistanceToNowStrict(new Date(createdAt)) + " ago"}
        </p>
      </div>
      {openImageModal && (
        <Modal isOpen={setOpenImageModal}>
          <ImageDisplay
            setIsOpen={setOpenImageModal}
            imageURL={image}
          ></ImageDisplay>
        </Modal>
      )}
    </>
  ) : (
    <>
      <div className="self-start bg-cfblue-500 text-gray-200 shadow-md rounded-xl p-2 max-w-1/2 flex flex-col">
        <p className="font-semibold mb-1 text-lg text-gray-100">{senderName}</p>
        {image && (
          <img
            src={image}
            className="max-h-20 lg:max-h-60 cursor-pointer"
          ></img>
        )}
        <p className="text-gray-100 break-words">{content}</p>
        <p className="text-xs text-gray-300">
          {formatDistanceToNowStrict(new Date(createdAt)) + " ago"}
        </p>
      </div>
    </>
  );
};

export default Message;
