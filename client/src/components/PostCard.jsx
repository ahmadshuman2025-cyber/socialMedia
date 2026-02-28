import React, { useMemo, useState } from "react";
import { BadgeCheck, Heart, MessageCircle, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import api from "../api/axios";
import toast from "react-hot-toast";

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const currentUser = useSelector((state) => state.user.value);

  const [commentText, setCommentText] = useState("");

  // ✅ keep likes in state (safe array)
  const [likes, setLikes] = useState(
    Array.isArray(post.likes_count) ? post.likes_count : [],
  );

  const comments = Array.isArray(post.comments) ? post.comments : [];
  const shareCount = Number.isFinite(post.shares) ? post.shares : 0;

  const likedByMe = currentUser?._id ? likes.includes(currentUser._id) : false;
  const likeCount = likes.length;

  const postWithHashtags = useMemo(
    () =>
      (post.content || "").replace(
        /(#\w+)/g,
        '<span class="text-indigo-600">$1</span>',
      ),
    [post.content],
  );

  const handleLike = async () => {
    try {
      const { data } = await api.post(
        "/api/post/like",
        { postId: post._id },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        },
      );

      if (data.success) {
        toast.success(data.message);

        setLikes((prev) => {
          if (prev.includes(currentUser._id)) {
            return prev.filter((id) => id !== currentUser._id);
          } else {
            return [...prev, currentUser._id];
          }
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/post/${post._id}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "SnapGram",
          text: post.content?.slice(0, 140) || "Check this post!",
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard");
      }
    } catch {
      alert("Failed to share the post.");
    }
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    // You can connect this to backend later
    toast.success("Comment added (UI only)");
    setCommentText("");
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-4 w-full max-w-2xl">
      <div
        className="inline-flex items-center gap-3 cursor-pointer"
        onClick={() => navigate(`/profile/${post.user._id}`)}
      >
        <img
          src={post.user.profile_picture}
          alt=""
          className="w-10 h-10 rounded-full shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/60 transition-shadow duration-300"
        />
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1">
            <span className="font-medium text-slate-900">
              {post.user.full_name}
            </span>
            {post.user.is_verified && (
              <BadgeCheck className="w-4 h-4 text-blue-500" />
            )}
          </div>
          <div className="text-gray-500 text-sm">
            @{post.user.username} · {moment(post.createdAt).fromNow()}
          </div>
        </div>
      </div>

      {!!post.content && (
        <div
          className="text-gray-800 text-sm whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: postWithHashtags }}
        />
      )}

      <div className="grid grid-cols-2 gap-2">
        {Array.isArray(post.image_urls) &&
          post.image_urls.map((img, index) => {
            const isSingle = post.image_urls.length === 1;
            return (
              <div
                key={index}
                className={`group relative overflow-hidden rounded-lg ${
                  isSingle ? "col-span-2" : ""
                }`}
              >
                <img
                  src={img}
                  alt={`Post image ${index + 1}`}
                  className={`w-full ${
                    isSingle ? "h-auto" : "h-48"
                  } object-cover group-hover:scale-105 transition-transform duration-300`}
                />
              </div>
            );
          })}
      </div>

      <div className="flex items-center gap-6 text-gray-600 text-sm pt-2 border-t border-gray-300">
        <button
          type="button"
          onClick={handleLike}
          aria-pressed={likedByMe}
          className={`flex items-center gap-1 hover:opacity-80 ${
            likedByMe ? "text-rose-600" : ""
          }`}
        >
          <Heart className={`w-4 h-4 ${likedByMe ? "fill-current" : ""}`} />
          {likeCount > 0 && <span>{likeCount}</span>}
        </button>

        <div className="flex items-center gap-1">
          <MessageCircle className="w-4 h-4" />
          {comments.length > 0 && <span>{comments.length}</span>}
        </div>

        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-1 hover:opacity-80"
        >
          <Share2 className="w-4 h-4" />
          {shareCount > 0 && <span>{shareCount}</span>}
        </button>
      </div>

      <form
        onSubmit={handleSubmitComment}
        className="flex items-center gap-2 pt-2"
      >
        <input
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write a comment…"
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700"
        >
          Post
        </button>
      </form>

      {comments.length > 0 && (
        <div className="space-y-2">
          {comments.slice(0, 3).map((c) => (
            <div key={c._id} className="text-sm text-gray-700">
              <span className="font-medium mr-1">{c.user.full_name}:</span>
              <span>{c.text}</span>
            </div>
          ))}
          {comments.length > 3 && (
            <div className="text-xs text-gray-500">
              View all {comments.length} comments
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;
