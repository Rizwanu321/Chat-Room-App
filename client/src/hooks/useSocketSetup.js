import { useState, useEffect } from "react";
import socket from "../utils/socket";
import axios from "../utils/axios";

export const useSocketSetup = ({ user, navigate }) => {
  const [currentUser, setCurrentUser] = useState({
    username: user.username,
    profilePhoto: null,
  });
  const [allUsers, setAllUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const currentUsername = user.username || localStorage.getItem("username");
    const currentRoom = user.room || localStorage.getItem("room");

    const fetchCurrentUserProfile = async () => {
      try {
        const response = await axios.get(`/users/profile/${currentUsername}`);
        if (response.data?.profilePhoto) {
          setCurrentUser((prev) => ({
            ...prev,
            profilePhoto: response.data.profilePhoto,
          }));
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    const fetchAllUsers = async () => {
      try {
        const response = await axios.get(`/users/room-users/${currentRoom}`);
        const filteredUsers = response.data.filter(
          (user) => user.username !== currentUsername
        );
        setAllUsers(filteredUsers);

        const currentUserData = response.data.find(
          (user) => user.username === currentUsername
        );
        if (currentUserData?.profilePhoto) {
          setCurrentUser((prev) => ({
            ...prev,
            profilePhoto: currentUserData.profilePhoto,
          }));
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setAllUsers([]);
      }
    };

    if (currentUsername) {
      fetchCurrentUserProfile();
      fetchAllUsers();

      socket.connect();
      socket.emit("userOnline", currentUsername);
      socket.emit("joinRoom", { username: currentUsername, room: currentRoom });
    }

    socket.on("usersInRoom", (userList) => {
      const filteredUsers = userList.filter(
        (user) => user.username !== currentUsername
      );
      setAllUsers(filteredUsers);
    });

    socket.on("userJoined", (userData) => {
      if (userData.username !== currentUsername) {
        setAllUsers((prevUsers) => {
          const userExists = prevUsers.some(
            (user) => user.username === userData.username
          );
          return userExists ? prevUsers : [...prevUsers, userData];
        });
        setOnlineUsers((prev) =>
          Array.from(new Set([...prev, userData.username]))
        );
      }
    });

    socket.on("userLeft", (userData) => {
      setOnlineUsers((prev) =>
        prev.filter((username) => username !== userData.username)
      );
      setAllUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.username === userData.username
            ? { ...user, isOnline: false }
            : user
        )
      );
    });

    socket.on("onlineUsersList", (onlineUsersList) => {
      setOnlineUsers(
        onlineUsersList.filter((username) => username !== currentUsername)
      );
      setAllUsers((prevUsers) =>
        prevUsers.map((user) => ({
          ...user,
          isOnline: onlineUsersList.includes(user.username),
        }))
      );
    });

    return () => {
      socket.emit("userOffline", currentUsername);
      socket.emit("leaveRoom", {
        username: currentUsername,
        room: currentRoom,
      });
      socket.disconnect();
      socket.off("usersInRoom");
      socket.off("userJoined");
      socket.off("userLeft");
      socket.off("onlineUsersList");
    };
  }, [user.username, user.room]);

  return {
    currentUser,
    allUsers,
    onlineUsers,
  };
};

export default useSocketSetup;
