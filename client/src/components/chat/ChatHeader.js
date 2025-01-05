import React from "react";

const ChatHeader = ({ privateRecipient, room, onlineUsers, allUsers }) => {
  if (privateRecipient) {
    const recipientUser = allUsers.find(
      (user) => user.username === privateRecipient
    );
    return (
      <div className="flex items-center justify-center gap-3 pt-3 pb-3">
        <img
          src={recipientUser?.profilePhoto || "/uploads/default-avatar.png"}
          alt={privateRecipient}
          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
        />
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold text-gray-800">
            {privateRecipient}
          </h1>
          <p className="text-sm text-gray-500">
            {onlineUsers.includes(privateRecipient) ? "Online" : "Offline"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-xl font-semibold text-gray-800 text-center pt-3">
        Chat Room - {room}
      </h1>
      <p className="text-sm text-gray-500 mt-1 text-center pb-3">
        {onlineUsers.length} users online
      </p>
    </>
  );
};

export default ChatHeader;
