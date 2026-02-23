import React from "react";
import { MapPin, MessageCircle, Plus, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { dummyUserData } from "../assets/assets";

const UserCard = ({ user }) => {
  const currentUser = dummyUserData;

  const isFollowing = currentUser?.following.includes(user._id);
  const isConnected = currentUser?.connections.includes(user._id);

  const handleFollow = async (e) => {
    e.stopPropagation();
  };

  const handleConnectionRequest = async (e) => {
    e.stopPropagation();
  };

  return (
    <div
      key={user._id}
      className="p-4 pt-6 flex flex-col justify-between w-72 shadow border border-gray-200 rounded-md"
    >
      <div className="text-center">
        <img
          src={user.profile_picture}
          alt=""
          className="rounded-full w-16 shadow-md mx-auto"
        />
        <p className="mt-4 font-semibold">{user.full_name}</p>
        {user.username && (
          <p className="text-gray-500 font-light">@{user.username}</p>
        )}
        {user.bio && (
          <p className="text-gray-600 mt-2 text-center text-sm px-4">
            {user.bio}
          </p>
        )}
      </div>

      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-600">
        <div className="flex items-center gap-1 border border-gray-300 rounded-full px-3 py-1">
          <MapPin className="w-4 h-4" />
          {user.location}
        </div>
        <div className="flex items-center gap-1 border border-gray-300 rounded-full px-3 py-1">
          <span>{user.followers.length}</span>Followers
        </div>
      </div>

      <div className="flex mt-4 gap-2">
        <button
          onClick={handleFollow}
          disabled={isFollowing}
          className="w-full py-2 rounded-md flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-500
            to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition text-white"
        >
          <UserPlus className="w-4 h-4" />
          {isFollowing ? "Following" : "Follow"}
        </button>

        {isConnected ? (
          <Link
            to={`/messages/${user._id}`}
            className="flex items-center justify-center w-16 border text-slate-500 group rounded-md active:scale-95"
            onClick={(e) => e.stopPropagation()}
            aria-label={`Message ${user.full_name}`}
          >
            <MessageCircle className="h-5 w-5 group-hover:scale-105 transition" />
          </Link>
        ) : (
          <button
            onClick={handleConnectionRequest}
            className="flex items-center justify-center w-16 border text-slate-500 group rounded-md active:scale-95"
          >
            <Plus className="h-5 w-5 group-hover:scale-105 transition" />
          </button>
        )}
      </div>
    </div>
  );
};

export default UserCard;
