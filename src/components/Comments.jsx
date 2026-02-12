import { useState } from "react";
import axios from "../utils/axios.js";
import { ThumbsUp } from "lucide-react";
import Input from "./Input.jsx";
import { timeAgo } from "../utils/helpers.js";
import { useSelector } from "react-redux";

const CommentsSection = ({ inPopup = false, comments, setComments, id }) => {    
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [comment, setComment] = useState("");
  const user = useSelector((state) => state.auth.userData);
  const addComment = async () => {
    try {
      const { data } = await axios.post(`/api/v1/comments/${id}`, {
        content: comment,
      });

      setComments((prev) => ({
        ...prev,
        comments: [data.data, ...prev.comments],
        totalComments: prev.totalComments + 1,
      }));
      setComment("");
    } catch (error) {
      console.error("Video :: addComment :: Error adding comment:", error);
    }
  };

  const toggleCommentLike = async (commentId) => {
    try {
      await axios.post(`api/v1/likes/toggle/c/${commentId}`);

      setComments((prev) => ({
        ...prev,
        comments: prev.comments.map((comment) => {
          if (comment._id === commentId) {
            const newHasLiked = !comment.hasLiked;
            return {
              ...comment,
              hasLiked: newHasLiked,
              likesCount: newHasLiked
                ? comment.likesCount + 1
                : comment.likesCount - 1,
            };
          }
          return comment;
        }),
      }));
    } catch (error) {
      console.error(
        "Video :: toggleCommentLike :: Error liking comment:",
        error,
      );
    }
  };

  return (
    <div className={inPopup ? "" : "mt-4 sm:mt-6"}>
      <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
        {comments?.totalComments || 0} Comments
      </h2>

      {/* Add Comment */}
      <div className="flex gap-2 sm:gap-3 items-start mb-4 sm:mb-6">
        <img
          src={user?.avatar?.url}
          alt="Your avatar"
          className="rounded-full w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0"
        />
        <div className="flex-1 flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
          <Input
            className="flex-1 border-b border-[#272727] text-sm pb-1 focus:outline-none bg-transparent focus:border-b-white transition-colors"
            value={comment}
            placeholder="Add a comment..."
            onChange={(e) => setComment(e.target.value)}
            onFocus={() => setIsInputFocused(true)}
          />
          <button
            onMouseDown={(e) => e.preventDefault()}
            className={`text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all ${
              isInputFocused && comment.trim()
                ? "bg-white text-black font-medium hover:bg-gray-200"
                : "bg-[#272727] text-gray-400 cursor-not-allowed"
            }`}
            disabled={!comment.trim()}
            onClick={addComment}
          >
            Comment
          </button>
        </div>
      </div>

      {/* Comments List */}
      <div className="flex flex-col gap-4">
        {comments && comments.comments.length > 0 ? (
          comments.comments.map((comment) => (
            <div key={comment?._id} className="flex gap-3">
              <img
                src={comment?.owner?.avatar?.url || user?.avatar?.url}
                alt={comment?.owner?.username}
                className="rounded-full w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline gap-1">
                  <p className="text-xs sm:text-sm font-medium">
                    @{comment?.owner?.username || user?.username}
                  </p>
                  <span className="text-gray-500 text-xs">
                    • {timeAgo(comment?.createdAt)}
                  </span>
                </div>
                <p className="text-sm sm:text-base mt-1 break-words">
                  {comment?.content}
                </p>
                <div className="flex gap-2 items-center mt-2">
                  <button
                    className="flex items-center gap-1 group"
                    onClick={() => toggleCommentLike(comment?._id)}
                  >
                    <ThumbsUp
                      className={`w-4 h-4 transition-colors ${
                        comment?.hasLiked
                          ? "text-white fill-white"
                          : "group-hover:text-white"
                      }`}
                    />
                    <span className="text-xs">{comment?.likesCount || 0}</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center py-8">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
