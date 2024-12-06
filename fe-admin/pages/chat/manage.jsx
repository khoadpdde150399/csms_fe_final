import React from "react";
import Header from '@/components/Header'
import ChatComponent from "@/components/ChatComponent/ChatComponent";

const ChatPage = () => {
  return (
    <div style={{ padding: "20px" }}>
      <Header title="Staff Chat Interface" />
      <ChatComponent />
    </div>
  );
};

export default ChatPage;