import React, { useEffect, useRef } from "react";

const Message = ({
  message,
  isCurrentUser,
  profilePhoto,
  privateRecipient,
}) => (
  <div
    className={`flex items-start space-x-2 ${
      isCurrentUser ? "justify-end" : "justify-start"
    }`}
  >
    {!isCurrentUser && !privateRecipient && (
      <img
        src={profilePhoto}
        alt="Avatar"
        className="w-8 h-8 rounded-full object-cover"
      />
    )}
    <div
      className={`max-w-sm px-4 py-2 rounded-lg shadow-sm ${
        isCurrentUser ? "bg-blue-500 text-white" : "bg-white text-gray-800"
      }`}
    >
      {!privateRecipient && (
        <p className="text-xs font-bold mb-1">
          {isCurrentUser ? "You" : message.sender}
        </p>
      )}
      <p className="text-sm">{message.text}</p>
    </div>
  </div>
);

const MessageList = ({
  messages,
  currentUsername,
  privateRecipient,
  allUsers,
}) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const filteredMessages = messages.filter((message) => {
    if (privateRecipient) {
      return (
        (message.sender === currentUsername &&
          message.recipient === privateRecipient) ||
        (message.sender === privateRecipient &&
          message.recipient === currentUsername)
      );
    }
    return !message.private;
  });

  return (
    <main className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-200">
      {filteredMessages.map((message, index) => {
        const isCurrentUser = message.sender === currentUsername;
        const sender = allUsers.find(
          (user) => user.username === message.sender
        );
        const profilePhoto =
          sender?.profilePhoto || "/uploads/default-avatar.png";

        return (
          <Message
            key={index}
            message={message}
            isCurrentUser={isCurrentUser}
            profilePhoto={profilePhoto}
            privateRecipient={privateRecipient}
          />
        );
      })}
      <div ref={messagesEndRef} />
    </main>
  );
};

export default MessageList;
