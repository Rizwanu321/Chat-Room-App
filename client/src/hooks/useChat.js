import { useState, useRef, useEffect } from "react";
import socket from "../utils/socket";

export const useChat = ({ user, navigate }) => {
  const [messages, setMessages] = useState(() => {
    const stored = localStorage.getItem("groupMessages");
    return stored ? JSON.parse(stored) : [];
  });

  const [privateMessages, setPrivateMessages] = useState(() => {
    const stored = localStorage.getItem("privateMessages");
    return stored ? JSON.parse(stored) : [];
  });

  const [newMessage, setNewMessage] = useState("");
  const [privateRecipient, setPrivateRecipient] = useState(null);
  const [typingIndicator, setTypingIndicator] = useState("");
  const typingTimeout = useRef(null);

  useEffect(() => {
    const currentUsername = user.username || localStorage.getItem("username");
    const currentRoom = user.room || localStorage.getItem("room");

    // Set up message listeners
    socket.on("previousMessages", (prevMessages) => {
      const groupMessages = prevMessages.filter(
        (msg) => !msg.private && msg.room === currentRoom
      );
      const privateChats = prevMessages.filter(
        (msg) =>
          msg.private &&
          (msg.sender === currentUsername || msg.recipient === currentUsername)
      );

      setMessages(groupMessages);
      setPrivateMessages(privateChats);

      localStorage.setItem("groupMessages", JSON.stringify(groupMessages));
      localStorage.setItem("privateMessages", JSON.stringify(privateChats));
    });

    socket.on("message", (message) => {
      if (!message.private && message.room === currentRoom) {
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages, message];
          localStorage.setItem("groupMessages", JSON.stringify(newMessages));
          return newMessages;
        });
      }
    });

    socket.on("privateMessage", (message) => {
      if (
        message.private &&
        (message.sender === currentUsername ||
          message.recipient === currentUsername)
      ) {
        setPrivateMessages((prevMessages) => {
          const messageExists = prevMessages.some(
            (msg) =>
              msg.text === message.text &&
              msg.sender === message.sender &&
              msg.recipient === message.recipient &&
              msg.createdAt === message.createdAt
          );

          if (!messageExists) {
            const newPrivateMessages = [...prevMessages, message];
            localStorage.setItem(
              "privateMessages",
              JSON.stringify(newPrivateMessages)
            );
            return newPrivateMessages;
          }
          return prevMessages;
        });
      }
    });

    socket.on("typing", ({ username: typingUser, isTyping }) => {
      if (isTyping) {
        setTypingIndicator(`${typingUser} is typing...`);
      } else {
        setTypingIndicator("");
      }
    });

    socket.emit("joinRoom", { username: currentUsername, room: currentRoom });

    return () => {
      socket.off("previousMessages");
      socket.off("message");
      socket.off("privateMessage");
      socket.off("typing");
    };
  }, [user.username, user.room]);

  const handleTyping = (text) => {
    const currentUsername = user.username || localStorage.getItem("username");
    const currentRoom = user.room || localStorage.getItem("room");

    clearTimeout(typingTimeout.current);

    if (text) {
      socket.emit("typing", {
        username: currentUsername,
        room: currentRoom,
        isTyping: true,
      });
    }

    typingTimeout.current = setTimeout(() => {
      socket.emit("typing", {
        username: currentUsername,
        room: currentRoom,
        isTyping: false,
      });
    }, 1000);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const currentUsername = user.username || localStorage.getItem("username");
    const currentRoom = user.room || localStorage.getItem("room");

    if (privateRecipient) {
      socket.emit("privateMessage", {
        sender: currentUsername,
        recipient: privateRecipient,
        text: newMessage,
        private: true,
      });
    } else {
      socket.emit("sendMessage", {
        room: currentRoom,
        sender: currentUsername,
        text: newMessage,
        private: false,
      });
    }

    setNewMessage("");
    socket.emit("typing", {
      username: currentUsername,
      room: currentRoom,
      isTyping: false,
    });
  };

  return {
    messages,
    setMessages,
    privateMessages,
    setPrivateMessages,
    newMessage,
    setNewMessage,
    privateRecipient,
    setPrivateRecipient,
    typingIndicator,
    setTypingIndicator,
    handleSendMessage,
    handleTyping,
  };
};

export default useChat;
