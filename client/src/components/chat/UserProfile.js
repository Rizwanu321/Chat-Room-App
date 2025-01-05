import React from "react";

const UserProfile = ({ currentUser }) => {
  return (
    <div className="p-4 md:p-6 text-center border-b border-gray-500">
      <div className="relative inline-block">
        <img
          src={currentUser.profilePhoto}
          alt="Current User"
          className="w-16 md:w-24 h-16 md:h-24 rounded-full mx-auto border-4 border-blue-500"
        />
        <span className="absolute bottom-2 right-2 w-3 md:w-4 h-3 md:h-4 bg-green-500 rounded-full border-2 border-gray-900"></span>
      </div>
      <h2 className="mt-3 md:mt-4 text-lg md:text-xl font-semibold">
        {currentUser.username}
      </h2>
    </div>
  );
};

export default UserProfile;
