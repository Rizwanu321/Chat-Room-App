import React, { useRef, useState, useEffect } from "react";
import { Send, Smile } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

const ChatInput = ({
  newMessage,
  onMessageChange,
  onSendMessage,
  typingIndicator,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiButtonRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const [emojiPickerPosition, setEmojiPickerPosition] = useState({
    top: 0,
    right: 0,
  });

  useEffect(() => {
    const updateEmojiPickerPosition = () => {
      if (emojiButtonRef.current) {
        const buttonRect = emojiButtonRef.current.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        let position = {
          bottom: windowHeight - buttonRect.top + 10,
          right: windowWidth - buttonRect.right,
        };

        if (windowWidth < 640) {
          position = {
            bottom: windowHeight - buttonRect.top + 10,
            left: Math.max(
              10,
              Math.min(windowWidth - 320, windowWidth / 2 - 160)
            ),
          };
        }

        if (position.bottom > windowHeight - 50) {
          position.bottom = windowHeight - 50;
        }

        setEmojiPickerPosition(position);
      }
    };

    if (showEmojiPicker) {
      updateEmojiPickerPosition();
      window.addEventListener("resize", updateEmojiPickerPosition);
      return () =>
        window.removeEventListener("resize", updateEmojiPickerPosition);
    }
  }, [showEmojiPicker]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showEmojiPicker &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        !emojiButtonRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  const handleEmojiSelect = (emoji) => {
    onMessageChange((prevMessage) => prevMessage + emoji.native);
  };

  return (
    <footer className="p-4 bg-white border-t">
      {typingIndicator && (
        <div className="text-sm text-gray-500 mb-2">{typingIndicator}</div>
      )}

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSendMessage();
          }}
          placeholder="Type your message..."
          className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
        />

        <div className="relative">
          <button
            ref={emojiButtonRef}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-3 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Smile size={24} />
          </button>
        </div>

        <button
          onClick={onSendMessage}
          className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <Send size={20} />
          <span className="hidden sm:inline">Send</span>
        </button>

        {showEmojiPicker && (
          <div
            ref={emojiPickerRef}
            style={{
              position: "fixed",
              bottom: `${emojiPickerPosition.bottom}px`,
              ...(emojiPickerPosition.right !== undefined
                ? { right: `${emojiPickerPosition.right}px` }
                : { left: `${emojiPickerPosition.left}px` }),
              zIndex: 1000,
            }}
            className="shadow-lg rounded-lg bg-white max-h-96 overflow-hidden"
          >
            <Picker
              data={data}
              onEmojiSelect={handleEmojiSelect}
              previewPosition="none"
              skinTonePosition="none"
              theme="light"
            />
          </div>
        )}
      </div>
    </footer>
  );
};

export default ChatInput;
