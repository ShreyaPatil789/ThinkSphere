import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FaRegCommentDots } from "react-icons/fa";
import "./BlogCard.css";
import axios from "axios";
import { FaTrashAlt } from "react-icons/fa";
import { toast } from 'react-toastify';
import { Link } from "react-router-dom";

const BlogCard = ({ blog, category }) => {
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(blog?.likes?.length || 0);

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?._id) {
          setUserId(parsedUser._id);
        }
      } catch (err) {
        console.error("Error parsing user from localStorage", err);
      }
    }
  }, []);

  useEffect(() => {
    if (userId && blog?.likes) {
      const isLiked = blog.likes.some((id) => id.toString() === userId.toString());
      setLiked(isLiked);
      setLikeCount(blog.likes.length);
    }
  }, [blog, userId]);

  const handleLikeToggle = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
  
    if (!token || !userId) {
      alert("Please log in to like blogs.");
      return;
    }
  
    try {
      // Make the API request to either add or remove a like
      const response = await axios.put(
        `http://localhost:5000/api/blogs/${blog._id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const updatedLikes = response.data.likes;
      const likedStatus = updatedLikes.some((id) => id.toString() === userId);
  
      setLiked(likedStatus);
      setLikeCount(updatedLikes.length);
  
      
  
    } catch (error) {
      console.error("Error liking/unliking blog:", error);
    }
  };
  

  const toggleComments = async () => {
    setShowComments((prev) => !prev);
   
    try {
      const response = await axios.get(`http://localhost:5000/api/comments/${blog._id}`);
      setComments(response.data);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };


  const handleAddComment = async (e) => {
    toast.success("Comment Added successfully!");
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to comment.");
      return;
    }

    if (!newComment.trim()) return;

    try {
      const response = await axios.post(
        `http://localhost:5000/api/comments`,
        { content: newComment, blogId: blog._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComments((prev) => [...prev, response.data]);

      // ✅ Increment the comment count in the frontend
      blog.commentCount = (blog.commentCount || 0) + 1;

      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error.response?.data || error.message);
    }
  };
  const handleDeleteComment = async (commentId) => {
    toast.success(" comment deleted successfully!");


    const token = localStorage.getItem("token");
    if (!token) return alert("Login required");
  
    try {
      await axios.delete(`http://localhost:5000/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Remove the comment from the state
      setComments((prev) => prev.filter((c) => c._id !== commentId));
  
      // Ensure comment count doesn't go negative
      if (blog.commentCount > 0) {
        blog.commentCount = blog.commentCount - 1;
      }
  
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };
  
  
  
  return (
    <div className="blog-card">
     {blog.user && (
  <div className="blog-header">
   <img
  src={blog.user.profileImage ? blog.user.profileImage : "/default.png"}

  alt={blog.user.username || "User"}
  className="profile-pic"
  style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover" }}
/>
<h3
  style={{ cursor: "pointer" }}
  onClick={() => navigate(`/user/${blog.user._id}`)}
>
  {blog.user.username}
</h3>




  </div>
)}


      {blog.image && (
        <img
          src={blog.image}
          alt={blog.title}
          className="blog-image"
        />
      )}


      <h3 className="blog-title">{blog.title}</h3>
      <p className="blog-content">{blog.content.substring(0, 150)}...</p>

      <button
        className="read-more-btn"
        onClick={() => navigate(`/blogs/${category}/${blog._id}`)}
      >
        Read More
      </button>

      <div className="interaction-section">
        <div className="like-section" onClick={handleLikeToggle}>
          {liked ? <FaHeart className="heart-icon liked" /> : <FaRegHeart className="heart-icon" />}
          <p className="like-count">{likeCount} like{likeCount !== 1 && "s"}</p>
        </div>

        <div className="comment-toggle" onClick={toggleComments}>
          <FaRegCommentDots className="comment-icon" />
          <p>{blog.commentCount || 0} comment{blog.commentCount !== 1 && "s"}</p>

        </div>
      </div>

      {showComments && (
        <div className="comments-section">
          <div className="add-comment">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button onClick={handleAddComment}>Post</button>

          </div>

          <div className="all-comments">
            {comments.length === 0 ? (
              <p className="no-comments">No comments yet.</p>
            ) : (
              comments.map((c, index) => (
                <div key={index} className="single-comment">
                  <div className="comment-left">
                    <strong>{c.user?.username || "Anonymous"}:</strong> {c.text}
                  </div>

                  {true && (
                    <FaTrashAlt
                      className="delete-icon"
                      onClick={() => handleDeleteComment(c._id)}
                    />
                  )}
                </div>

              ))


            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogCard;
