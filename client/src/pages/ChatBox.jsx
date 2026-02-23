import React, { useEffect, useRef, useState } from "react";
import { dummyMessagesData, dummyUserData } from "../assets/assets";
import { ImageIcon, SendHorizonal, Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

const ChatBox = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [user] = useState(dummyUserData);
  const messages = dummyMessagesData;

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const pickerRef = useRef(null);
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (!text.trim() && !image) return;
    setText("");
    setImage(null);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    function onDocClick(e) {
      if (!pickerRef.current) return;
      if (!pickerRef.current.contains(e.target)) setShowEmojiPicker(false);
    }
    if (showEmojiPicker) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [showEmojiPicker]);

  if (!user) return null;

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center gap-2 p-2 md:px-10 xl:pl-42 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-300">
        <img
          src={user.profile_picture}
          alt={user.full_name}
          className="size-8 rounded-full"
        />
        <div>
          <p className="font-medium">{user.full_name}</p>
          <p className="text-sm text-gray-500 -m-1.5">@{user.username}</p>
        </div>
      </div>

      <div className="overflow-y-scroll h-full p-5 md:px-10">
        <div className="space-y-4 max-w-4xl mx-auto">
          {[...(messages || [])]
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            .map((message, index) => (
              <div
                key={message._id || index}
                className={`flex flex-col ${
                  message.to_user_id !== user._id ? "items-start" : "items-end"
                }`}
              >
                <div
                  className={`p-2 text-sm max-w-sm bg-white text-slate-700 rounded-lg shadow ${
                    message.to_user_id !== user._id
                      ? "rounded-bl-none"
                      : "rounded-br-none"
                  }`}
                >
                  {message.message_type === "image" && message.media_url && (
                    <img
                      src={message.media_url}
                      alt="attached"
                      className="w-full max-w-sm rounded-lg mb-1"
                    />
                  )}
                  {message.text && <p>{message.text}</p>}
                </div>
              </div>
            ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="px-4">
        <div className="relative flex items-center gap-3 pl-5 p-1.5 bg-white w-full max-w-2xl mx-auto border border-gray-200 shadow rounded-full mb-5">
          <div className="relative" ref={pickerRef}>
            <button
              type="button"
              onClick={() => setShowEmojiPicker((s) => !s)}
              aria-label="Open emoji picker"
              className="p-1 rounded-full hover:bg-gray-100 transition"
            >
              <Smile className="size-6 text-gray-400 hover:text-indigo-500" />
            </button>

            {showEmojiPicker && (
              <div className="absolute bottom-12 left-0 z-50">
                <EmojiPicker
                  onEmojiClick={(emojiData) => {
                    setText((prev) => prev + (emojiData?.emoji || ""));
                    setShowEmojiPicker(false);
                  }}
                  theme="light"
                  height={350}
                  width={300}
                />
              </div>
            )}
          </div>

          <input
            type="text"
            className="flex-1 outline-none text-slate-700"
            placeholder="Type a message..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            onChange={(e) => setText(e.target.value)}
            value={text}
          />

          <label htmlFor="image" className="cursor-pointer">
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                className="h-8 rounded"
                alt="preview"
              />
            ) : (
              <ImageIcon className="size-7 text-gray-400" />
            )}
            <input
              type="file"
              id="image"
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </label>

          <button
            onClick={sendMessage}
            className="bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 cursor-pointer text-white p-2 rounded-full"
            aria-label="Send"
          >
            <SendHorizonal size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
