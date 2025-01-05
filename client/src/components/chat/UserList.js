import React from "react";

const UserList = ({ users, onlineUsers, privateRecipient, onUserClick }) => {
  const sortedUsers = [...users].sort((a, b) => {
    const aOnline = onlineUsers.includes(a.username);
    const bOnline = onlineUsers.includes(b.username);
    return aOnline === bOnline
      ? a.username.localeCompare(b.username)
      : aOnline
      ? -1
      : 1;
  });

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
      <div className="p-3 md:p-4">
        <h4 className="text-sm font-semibold text-gray-400 mb-3 md:mb-4">
          MEMBERS
        </h4>
        {sortedUsers.map((user) => (
          <div
            key={user.username}
            onClick={() => onUserClick(user.username)}
            className={`flex items-center mb-3 p-2 rounded-lg cursor-pointer transition-colors
              ${
                privateRecipient === user.username
                  ? "bg-blue-600"
                  : "hover:bg-gray-800"
              }`}
          >
            <div className="relative">
              <img
                src={user.profilePhoto || "/uploads/default-avatar.png"}
                alt={user.username}
                className="w-8 md:w-10 h-8 md:h-10 rounded-full object-cover"
              />
              <span
                className={`absolute bottom-0 right-0 w-2 md:w-3 h-2 md:h-3 rounded-full border-2 border-gray-900
                ${
                  onlineUsers.includes(user.username)
                    ? "bg-green-500"
                    : "bg-gray-500"
                }`}
              ></span>
            </div>
            <span
              className={`ml-3 font-medium ${
                onlineUsers.includes(user.username)
                  ? "text-white"
                  : "text-gray-400"
              }`}
            >
              {user.username}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
