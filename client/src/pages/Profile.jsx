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

  const fetchUser = async (profileId) => {
    const token = await getToken();
    try {
      const { data } = await api.post(
        "/api/user/profiles",
        { profileId },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (data.success) {
        setUser(data.profile);
        setPosts(data.posts);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    if (profileId) {
      fetchUser(profileId);
    } else {
      fetchUser(currentUser._id);
    }
  }, [profileId, currentUser]);

  // useEffect(() => {
  //   const u = dummyUserData;
  //   const seeded = dummyPostsData.map((p) => ({
  //     ...p,
  //     likes_count: Array.isArray(p.likes_count) ? p.likes_count : [],
  //     comments: Array.isArray(p.comments) ? p.comments : [],
  //     shares: Number.isFinite(p.shares) ? p.shares : 0,
  //   }));
  //   setUser(u);
  //   setPosts(seeded);
  // }, []);

  // const handleToggleLike = (postId) => {
  //   const userId = dummyUserData._id;
  //   setPosts((prev) =>
  //     prev.map((p) => {
  //       if (p._id !== postId) return p;
  //       const hasLiked = p.likes_count.includes(userId);
  //       return {
  //         ...p,
  //         likes_count: hasLiked
  //           ? p.likes_count.filter((id) => id !== userId)
  //           : [...p.likes_count, userId],
  //       };
  //     }),
  //   );
  // };

  // const handleAddComment = (postId, text) => {
  //   if (!text.trim()) return;
  //   const newComment = {
  //     _id: crypto.randomUUID?.() || String(Date.now()),
  //     user: dummyUserData,
  //     text: text.trim(),
  //     createdAt: new Date().toISOString(),
  //   };
  //   setPosts((prev) =>
  //     prev.map((p) =>
  //       p._id === postId ? { ...p, comments: [newComment, ...p.comments] } : p,
  //     ),
  //   );
  // };

  // const handleShare = (postId) => {
  //   setPosts((prev) =>
  //     prev.map((p) =>
  //       p._id === postId ? { ...p, shares: (p.shares || 0) + 1 } : p,
  //     ),
  //   );
  // };

  // const likedByMe = posts.filter((p) =>
  //   p.likes_count.includes(dummyUserData._id),
  // );

  return user ? (
    <div className="relative h-full overflow-y-scroll bg-gray-50 p-6 ">
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

        <div className="mt-6 ">
          <div className="bg-white rounded-xl flex shadow p-1 max-w-md mx-auto">
            {["posts", "media", "likes"].map((tab) => (
              <button
                type="button"
                onClick={() => setActiveTab(tab)}
                key={tab}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors
                cursor-pointer ${
                  activeTab === tab
                    ? "bg-indigo-600 text-white "
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

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
