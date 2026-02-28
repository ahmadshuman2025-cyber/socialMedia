import React from "react";
import { MapPin, MessageCircle, Plus, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { fetchUser } from "../features/user/userSlice";

const UserCard = ({ user }) => {
  const currentUser = useSelector((state) => state.user.value);
  const { getToken } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isFollowing = Array.isArray(currentUser?.following)
    ? currentUser.following.includes(user._id)
    : false;

  const isConnected = Array.isArray(currentUser?.connections)
    ? currentUser.connections.includes(user._id)
    : false;

  const followersCount = Array.isArray(user?.followers)
    ? user.followers.length
    : 0;

  const handleFollow = async () => {
    try {
      const { data } = await api.post(
        "/api/user/follow",
        { id: user._id },
        { headers: { Authorization: `Bearer ${await getToken()}` } },
      );

      if (data.success) {
        toast.success(data.message);
        dispatch(fetchUser(await getToken()));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleConnectionRequest = async () => {
    if (isConnected) {
      return navigate("/messages/" + user._id);
    }

    try {
      const { data } = await api.post(
        "/api/user/connect",
        { id: user._id },
        { headers: { Authorization: `Bearer ${await getToken()}` } },
      );

      if (data.success) {
        toast.success(data.message);
        // optional: refresh current user to update connections/pending
        dispatch(fetchUser(await getToken()));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="p-4 pt-6 flex flex-col justify-between w-72 shadow border border-gray-200 rounded-md">
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
          {user.location || "—"}
        </div>
        <div className="flex items-center gap-1 border border-gray-300 rounded-full px-3 py-1">
          <span>{followersCount}</span> Followers
        </div>
      </div>

      <div className="flex mt-4 gap-2">
        {/* Follow Button */}
        <button
          onClick={handleFollow}
          disabled={isFollowing}
          className="w-full py-2 rounded-md flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-500
            to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition text-white disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <UserPlus className="w-4 h-4" />
          {isFollowing ? "Following" : "Follow"}
        </button>

        {/* Connect / Message Button */}
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
            aria-label={`Connect with ${user.full_name}`}
          >
            <Plus className="h-5 w-5 group-hover:scale-105 transition" />
          </button>
        )}
      </div>
    </div>
  );
};

export default UserCard;
