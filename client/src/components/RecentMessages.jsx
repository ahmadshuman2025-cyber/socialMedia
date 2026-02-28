import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { useAuth, useUser } from "@clerk/clerk-react";
import api from "../api/axios";
import toast from "react-hot-toast";

const RecentMessages = () => {
  const [messages, setMessages] = useState([]);
  const { user } = useUser();
  const { getToken } = useAuth();

  const intervalRef = useRef(null);

  const fetchRecentMessages = async () => {
    try {
      const token = await getToken();
      const { data } = await api.get("/api/user/recent-messages", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      // ✅ Group by sender:
      // - keep latest message for preview/time
      // - count unseen messages from that sender
      const grouped = data.messages.reduce((acc, msg) => {
        const senderId = msg.from_user_id?._id;
        if (!senderId) return acc;

        if (!acc[senderId]) {
          acc[senderId] = {
            latest: msg,
            unseenCount: msg.seen ? 0 : 1,
          };
        } else {
          // count unseen
          if (!msg.seen) acc[senderId].unseenCount += 1;

          // keep latest message
          if (
            new Date(msg.createdAt) > new Date(acc[senderId].latest.createdAt)
          ) {
            acc[senderId].latest = msg;
          }
        }

        return acc;
      }, {});

      // ✅ Sort by latest message time, then flatten
      const sorted = Object.values(grouped)
        .sort(
          (a, b) => new Date(b.latest.createdAt) - new Date(a.latest.createdAt),
        )
        .map((x) => ({
          ...x.latest,
          unseenCount: x.unseenCount,
        }));

      setMessages(sorted);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!user) return;

    fetchRecentMessages();

    intervalRef.current = setInterval(fetchRecentMessages, 30000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [user]);

  return (
    <div className="bg-white max-w-xs p-4 min-h-20 rounded-md shadow text-xs text-slate-800">
      <h3 className="font-semibold text-slate-800 mb-4">Recent Messages</h3>

      <div className="flex flex-col max-h-56 overflow-y-scroll no-scrollbar">
        {messages.map((message, index) => (
          <Link
            to={`/messages/${message.from_user_id._id}`}
            key={message._id || index}
            className="flex items-start gap-2 py-2 hover:bg-slate-100"
            onClick={() => {
              // ✅ when user opens chat, clear local badge instantly
              const updated = messages.map((m, i) =>
                i === index ? { ...m, seen: true, unseenCount: 0 } : m,
              );
              setMessages(updated);
            }}
          >
            <img
              src={message.from_user_id.profile_picture}
              alt=""
              className="w-8 h-8 rounded-full"
            />

            <div className="w-full">
              <div className="flex justify-between">
                <p className="font-medium">{message.from_user_id.full_name}</p>
                <p className="text-[10px] text-slate-400">
                  {moment(message.createdAt).fromNow()}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-gray-500">
                  {message.text ? message.text : "Media"}
                </p>

                {/* ✅ show real unseen count */}
                {message.unseenCount > 0 && (
                  <p className="bg-indigo-500 text-white min-w-4 h-4 px-1 flex items-center justify-center rounded-full text-[10px]">
                    {message.unseenCount}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentMessages;
