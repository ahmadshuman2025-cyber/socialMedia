import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { assets, dummyUserData } from "../assets/assets";
import MenuItems from "./MenuItems";
import { CirclePlus, LogOut } from "lucide-react";
import { UserButton, useClerk } from "@clerk/clerk-react";
import GoogleTranslate from "../translator/GoogleTranslate";

const SideBar = ({ sidebarOpen, setSideBarOpen }) => {
  const navigate = useNavigate();
  const user = dummyUserData;
  const { signOut } = useClerk();

  return (
    <div
      className={`fixed inset-y-0 left-0 z-20 w-60 xl:w-72 bg-white border-r border-gray-200
        flex flex-col justify-between items-center
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        sm:translate-x-0 sm:static`}
    >
      <div className="w-full">
        <img
          src={assets.logo}
          alt=""
          className="w-48 ml-7 my-2 cursor-pointer"
          onClick={() => navigate("/")}
        />
        <hr className="border-gray-300 mb-8" />
        <MenuItems setSideBarOpen={setSideBarOpen} />

        <Link
          to="/create-post"
          className="flex items-center justify-center gap-2 py-2.5 mt-6 mx-6 rounded-lg bg-gradient-to-r
            from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 transition text-white cursor-pointer"
        >
          <CirclePlus className="w-5 h-5" />
          Create Post
        </Link>

        <GoogleTranslate />
      </div>

      <div className="w-full border-t border-gray-200 p-4 px-7 flex items-center justify-between">
        <UserButton />
        <div className="min-w-0">
          <h1 className="text-sm font-medium truncate">{user.full_name}</h1>
          <p className="text-xs text-gray-500 truncate">@{user.username}</p>
        </div>
        <LogOut
          onClick={signOut}
          className="w-4.5 text-gray-400 hover:text-gray-700 transition cursor-pointer"
          title="Sign out"
        />
      </div>
    </div>
  );
};

export default SideBar;
