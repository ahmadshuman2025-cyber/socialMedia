import React, { useEffect, useState } from "react";
import { dummyPostsData, dummyUserData, assets } from "../assets/assets";
import Loading from "../components/Loading";
import StoriesBar from "../components/StoriesBar";
import PostCard from "../components/PostCard";
import RecentMessages from "../components/RecentMessages";

const Feed = () => {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const seeded = dummyPostsData.map((p) => ({
      ...p,
      likes_count:
        Array.isArray(p.likes_count) && p.likes_count.length > 0
          ? p.likes_count
          : Array.from(
              { length: Math.floor(Math.random() * 4) + 1 },
              (_, i) => `user_${i}`
            ),
      comments: Array.isArray(p.comments) ? p.comments : [],
      shares: Number.isFinite(p.shares)
        ? p.shares
        : Math.floor(Math.random() * 3) + 1,
    }));
    setFeeds(seeded);
    setLoading(false);
  }, []);

  const handleToggleLike = (postId) => {
    const userId = dummyUserData._id;
    setFeeds((prev) =>
      prev.map((p) => {
        if (p._id !== postId) return p;
        const hasLiked = p.likes_count.includes(userId);
        return {
          ...p,
          likes_count: hasLiked
            ? p.likes_count.filter((id) => id !== userId)
            : [...p.likes_count, userId],
        };
      })
    );
  };

  const handleAddComment = (postId, text) => {
    if (!text.trim()) return;
    const newComment = {
      _id: crypto.randomUUID?.() || String(Date.now()),
      user: dummyUserData,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };
    setFeeds((prev) =>
      prev.map((p) =>
        p._id === postId ? { ...p, comments: [newComment, ...p.comments] } : p
      )
    );
  };

  const handleShare = (postId) => {
    setFeeds((prev) =>
      prev.map((p) =>
        p._id === postId ? { ...p, shares: (p.shares || 0) + 1 } : p
      )
    );
  };

  return !loading ? (
    <div className="h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center xl:gap-8">
      <div>
        <StoriesBar />
        <div className="p-4 space-y-6">
          {feeds.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              currentUserId={dummyUserData._id}
              onToggleLike={() => handleToggleLike(post._id)}
              onAddComment={(text) => handleAddComment(post._id, text)}
              onShared={() => handleShare(post._id)}
            />
          ))}
        </div>
      </div>

      <div className="max-xl:hidden sticky top-0">
        <div className="max-w-xs bg-white text-xs p-4 rounded-md inline-flex flex-col gap-2 shadow">
          <h1 className="text-slate-800 font-semibold">Sponsored</h1>
          <img
            src={assets.sponsored_img}
            alt=""
            className="w-75 h-50 rounded-md transition-transform duration-300 ease-in-out hover:scale-105"
          />
          <p className="text-slate-600">Email Marketing</p>
          <p className="text-slate-400">
            Supercharge your marketing with a powerful, easy-to-use platform
            built for results.
          </p>
        </div>
        <RecentMessages />
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Feed;
