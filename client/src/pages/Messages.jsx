import React from "react";
import { Eye, MessageSquare } from "lucide-react";
import { dummyConnectionsData } from "../assets/assets";

import { useNavigate } from "react-router-dom";

const Messages = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative bg-slate-100">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1
            className="text-3xl font-bold text-slate-900 mb-2 
             hover:underline hover:decoration-2 hover:decoration-slate-400 
             transition-all duration-300 
             drop-shadow-[0_3px_5px_rgba(0,0,0,0.35)]"
          >
            Messages
          </h1>

          <p
            className="text-slate-600 
             hover:underline hover:decoration-2 hover:decoration-slate-400 
             transition-all duration-300
             drop-shadow-[0_2px_4px_rgba(100,116,139,0.25)]"
          >
            Talk to Your Friends and Family
          </p>
        </div>
        <div className="flex flex-col gap-3">
          {dummyConnectionsData.map((user) => (
            <div
              key={user._id}
              className="max-w-xl flex flex-wrap gap-5 p-6 bg-white shadow rounded-md"
            >
              <img
                src={user.profile_picture}
                alt=""
                className="rounded-full size-12 mx-auto"
              />

              <div className="flex-1">
                <p className="font-medium text-slate-700 ">{user.full_name}</p>
                <p className="text-slate-500">@{user.username}</p>
                <p className="text-sm text-gray-600">{user.bio}</p>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <button
                  onClick={() => navigate(`/messages/${user._id}`)}
                  className="size-10 flex items-center justify-center text-sm rounded bg-slate-100
                  hover:bg-slate-300 text-slate-800 active:scale-95 transition-all duration-300 cursor-pointer gap-1"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate(`/profile/${user._id}`)}
                  className="size-10 flex items-center justify-center text-sm rounded bg-slate-100
                  hover:bg-slate-300 text-slate-800 active:scale-95 transition-all duration-300 cursor-pointer"
                >
                  <Eye />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Messages;
