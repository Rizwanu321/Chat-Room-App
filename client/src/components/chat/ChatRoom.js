import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import socket from "../../utils/socket";
import useChat from "../../hooks/useChat";
import useSocketSetup from "../../hooks/useSocketSetup";
import UserProfile from "./UserProfile";
import UserList from "./UserList";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";

const ChatRoom = () => {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const [showSidebar, setShowSidebar] = useState(false);
  const [highlightRoom, setHighlightRoom] = useState(false);

  const {
    messages,
    privateMessages,
    newMessage,
    setNewMessage,
    privateRecipient,
    setPrivateRecipient,
    handleSendMessage,
    typingIndicator,
    handleTyping,
  } = useChat({ user, navigate });

  const { currentUser, allUsers, onlineUsers } = useSocketSetup({
    user,
    navigate,
  });

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedRoom = localStorage.getItem("room");

    if ((!user.username && !storedUsername) || (!user.room && !storedRoom)) {
      navigate("/login");
      return;
    }

    if (user.username && user.room) {
      localStorage.setItem("username", user.username);
      localStorage.setItem("room", user.room);
    }
  }, [user.username, user.room, navigate]);

  const handleUserClick = (clickedUser) => {
    setPrivateRecipient(privateRecipient === clickedUser ? null : clickedUser);
  };

  const handleRoomClick = () => {
    setPrivateRecipient(null);
    setHighlightRoom(true);
    setTimeout(() => setHighlightRoom(false), 500);
  };

  const handleLogout = () => {
    const username = user.username || localStorage.getItem("username");
    const room = user.room || localStorage.getItem("room");

    socket.emit("userOffline", username);
    socket.emit("leaveRoom", { username, room });

    localStorage.removeItem("username");
    localStorage.removeItem("room");
    localStorage.removeItem("groupMessages");
    localStorage.removeItem("privateMessages");

    toast.info("👋 See you next time!", {
      icon: "🌟",
    });

    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        showSidebar={showSidebar}
        onToggleSidebar={() => setShowSidebar(!showSidebar)}
        onLogout={handleLogout}
      >
        <UserProfile currentUser={currentUser} />
        <div className="p-3 md:p-4 border-b border-gray-500">
          <h3
            className={`text-base md:text-lg font-bold ${
              highlightRoom ? "text-yellow-300" : "text-white-300"
            } cursor-pointer`}
            onClick={handleRoomClick}
          >
            Chat Room: {user.room || localStorage.getItem("room")}
          </h3>
        </div>
        <UserList
          users={allUsers}
          onlineUsers={onlineUsers}
          privateRecipient={privateRecipient}
          onUserClick={handleUserClick}
        />
      </Sidebar>

      <div className="flex-1 flex flex-col">
        <ChatHeader
          privateRecipient={privateRecipient}
          room={user.room || localStorage.getItem("room")}
          onlineUsers={onlineUsers}
          allUsers={allUsers}
        />

        <MessageList
          messages={privateRecipient ? privateMessages : messages}
          currentUsername={user.username || localStorage.getItem("username")}
          privateRecipient={privateRecipient}
          allUsers={allUsers}
        />

        <ChatInput
          newMessage={newMessage}
          onMessageChange={(text) => {
            setNewMessage(text);
            handleTyping(text);
          }}
          onSendMessage={handleSendMessage}
          typingIndicator={typingIndicator}
        />
      </div>
    </div>
  );
};

export default ChatRoom;
