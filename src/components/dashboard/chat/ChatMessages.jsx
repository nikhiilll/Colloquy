import Message from "./Message";

const ChatMessages = ({ messages }) => {
  return (
    <div className="flex flex-col space-y-2 my-2 p-4">
      {messages.message.map((m) => (
        <Message key={m.id} {...m} />
      ))}
    </div>
  );
};

export default ChatMessages;
