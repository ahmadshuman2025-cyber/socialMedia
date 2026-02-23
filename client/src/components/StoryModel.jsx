import React, { useState } from "react";
import { ArrowLeft, Text as TextIcon, Upload, Sparkle } from "lucide-react";
import { toast } from "react-hot-toast";

const StoryModel = ({ setShowModel, fetchStories }) => {
  const bgColors = [
    "#4f46e5",
    "#7c3aed",
    "#db2777",
    "#e11d48",
    "#ca8a04",
    "#0d9488",
  ];

  const [mode, setMode] = useState("text");
  const [background, setBackground] = useState(bgColors[0]);
  const [text, setText] = useState("");
  const [media, setMedia] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleMediaUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMedia(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const createStoryAPI = async ({ mode, text, background, media }) => {
    await new Promise((r) => setTimeout(r, 800));

    return { ok: true };
  };

  const handleCreateStory = async () => {
    if (mode === "text" && !text.trim()) {
      toast.error("Please write something.");
      return;
    }
    if (mode === "media" && !media) {
      toast.error("Please select a photo or video.");
      return;
    }

    setSubmitting(true);
    try {
      await toast.promise(createStoryAPI({ mode, text, background, media }), {
        loading: "Saving...",
        success: "Story created 🎉",
        error: (e) => e?.message || "Failed to create story",
      });

      setText("");
      setMedia(null);
      setPreviewUrl(null);
      setMode("text");
      fetchStories?.();
      setTimeout(() => {
        setShowModel(false);
      }, 1000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] min-h-screen bg-black/80 backdrop-blur text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-4 flex items-center justify-between">
          <button
            type="button"
            className="text-white p-2 cursor-pointer"
            onClick={() => setShowModel(false)}
            aria-label="Close create story"
          >
            <ArrowLeft />
          </button>
          <h2 className="text-lg font-semibold">Create Story</h2>
          <span className="w-10" />
        </div>

        <div
          className="rounded-lg h-96 flex items-center justify-center relative overflow-hidden"
          style={{ backgroundColor: background }}
        >
          {mode === "text" && (
            <textarea
              className="bg-transparent text-white w-full h-full p-6 text-lg resize-none focus:outline-none placeholder-white/70"
              placeholder="What's on your mind?"
              onChange={(e) => setText(e.target.value)}
              value={text}
            />
          )}

          {mode === "media" &&
            previewUrl &&
            (media?.type?.startsWith("image") ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="object-contain max-h-full"
              />
            ) : (
              <video
                src={previewUrl}
                className="object-contain max-h-full"
                controls
              />
            ))}
        </div>

        <div className="flex mt-4 gap-2">
          {bgColors.map((color) => (
            <button
              key={color}
              type="button"
              className="w-6 h-6 rounded-full ring cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/70"
              style={{ backgroundColor: color }}
              onClick={() => setBackground(color)}
              title={color}
            />
          ))}
        </div>

        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={() => {
              setMode("text");
              setMedia(null);
              setPreviewUrl(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 p-2 rounded cursor-pointer ${
              mode === "text" ? "bg-white text-black" : "bg-zinc-800"
            }`}
          >
            <TextIcon size={18} /> Text
          </button>

          <label
            className={`flex-1 flex items-center justify-center gap-2 p-2 rounded cursor-pointer ${
              mode === "media" ? "bg-white text-black" : "bg-zinc-800"
            }`}
          >
            <input
              onChange={(e) => {
                handleMediaUpload(e);
                setMode("media");
              }}
              type="file"
              accept="image/*,video/*"
              className="hidden"
            />
            <Upload size={18} /> Photo/Video
          </label>
        </div>

        <button
          type="button"
          disabled={submitting}
          onClick={handleCreateStory}
          className="flex items-center justify-center gap-2 text-white py-3 mt-4 w-full rounded bg-gradient-to-r from-indigo-500 to-purple-600
                     hover:from-indigo-700 hover:to-purple-800 active:scale-95 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Sparkle size={18} />
          {submitting ? "Saving..." : "Create Story"}
        </button>
      </div>
    </div>
  );
};

export default StoryModel;
