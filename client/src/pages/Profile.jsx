// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Loading from "../components/Loading";
import UserProfileInfo from "../components/UserProfileInfo";
import PostCard from "../components/PostCard";
import ProfileModel from "../components/ProfileModel";
import moment from "moment";
import { useAuth } from "@clerk/clerk-react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const Profile = () => {
  const currentUser = useSelector((state) => state.user.value);
  const { getToken } = useAuth();
  const { profileId } = useParams();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [showEdit, setShowEdit] = useState(false);

  const fetchUser = async (id) => {
    try {
      const token = await getToken();
      const { data } = await api.post(
        "/api/user/profiles",
        { profileId: id },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (data.success) {
        setUser(data.profile);
        setPosts(Array.isArray(data.posts) ? data.posts : []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!profileId && !currentUser?._id) return;
    fetchUser(profileId || currentUser._id);
  }, [profileId, currentUser?._id]);

  // ✅ posts I liked (for Likes tab)
  const likedByMe = (posts || []).filter((p) => {
    const likesArr = Array.isArray(p.likes_count) ? p.likes_count : [];
    return likesArr.includes(currentUser?._id);
  });

  // ✅ REAL backend like endpoint: POST /api/post/like
  const handleToggleLike = async (postId) => {
    try {
      const token = await getToken();

      const { data } = await api.post(
        "/api/post/like",
        { postId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (!data.success) {
        return toast.error(data.message);
      }

      // ✅ update UI instantly
      setPosts((prev) =>
        (prev || []).map((p) => {
          if (p._id !== postId) return p;

          const likesArr = Array.isArray(p.likes_count) ? p.likes_count : [];
          const hasLiked = likesArr.includes(currentUser?._id);

          return {
            ...p,
            likes_count: hasLiked
              ? likesArr.filter((id) => id !== currentUser?._id)
              : [...likesArr, currentUser?._id],
          };
        }),
      );
    } catch (e) {
      toast.error(e.message);
    }
  };

  // You don't have comment/share endpoints in your router yet
  const handleAddComment = async () => {};
  const handleShare = async () => {};

  return user ? (
    <div className="relative h-full overflow-y-scroll bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="h-40 md:h-56 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200">
            {user.cover_photo && (
              <img
                src={user.cover_photo}
                alt=""
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <UserProfileInfo
            user={user}
            posts={posts}
            profileId={profileId}
            setShowEdit={setShowEdit}
          />
        </div>

        <div className="mt-6">
          <div className="bg-white rounded-xl flex shadow p-1 max-w-md mx-auto">
            {["posts", "media", "likes"].map((tab) => (
              <button
                type="button"
                onClick={() => setActiveTab(tab)}
                key={tab}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                  activeTab === tab
                    ? "bg-indigo-600 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* POSTS */}
          {activeTab === "posts" && (
            <div className="mt-6 flex flex-col items-center gap-6">
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  currentUserId={currentUser?._id}
                  onToggleLike={() => handleToggleLike(post._id)}
                  onAddComment={(text) => handleAddComment(post._id, text)}
                  onShared={() => handleShare(post._id)}
                />
              ))}
            </div>
          )}

          {/* MEDIA */}
          {activeTab === "media" && (
            <div className="flex flex-wrap mt-6 max-w-6xl">
              {posts
                .filter(
                  (post) =>
                    Array.isArray(post.image_urls) &&
                    post.image_urls.length > 0,
                )
                .map((post) =>
                  post.image_urls.map((image, index) => (
                    <Link
                      target="_blank"
                      to={image}
                      key={`${post._id}-${index}`}
                      className="relative group"
                    >
                      <img
                        src={image}
                        alt=""
                        className="w-64 aspect-video object-cover"
                      />
                      <p className="absolute bottom-0 right-0 text-xs p-1 px-3 backdrop-blur-xl text-white opacity-0 group-hover:opacity-100 transition duration-300">
                        Posted {moment(post.createdAt).fromNow()}
                      </p>
                    </Link>
                  )),
                )}
            </div>
          )}

          {/* LIKES */}
          {activeTab === "likes" && (
            <div className="mt-6 flex flex-col items-center gap-6">
              {likedByMe.length === 0 && (
                <p className="text-sm text-gray-500">
                  You haven’t liked any posts yet.
                </p>
              )}

              {likedByMe.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  currentUserId={currentUser?._id}
                  onToggleLike={() => handleToggleLike(post._id)}
                  onAddComment={(text) => handleAddComment(post._id, text)}
                  onShared={() => handleShare(post._id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {showEdit && <ProfileModel setShowEdit={setShowEdit} />}
    </div>
  ) : (
    <Loading />
  );
};

export default Profile;
