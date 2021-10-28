import Conversations from "./conversations/Conversations";
import Chat from "./chat/Chat";
import { ChatContextProvider } from "../../context/ChatContext";

const Dashboard = () => {
  return (
    <div className="h-screen w-screen md:h-full md:w-full p-4">
      <div className="w-full h-full bg-cfblue-400 text-white flex flex-col sm:flex-row justify-between p-4 shadow-lg rounded-md">
        <ChatContextProvider>
          <Conversations />
          <Chat />
        </ChatContextProvider>
      </div>
    </div>
  );
};

export default Dashboard;
