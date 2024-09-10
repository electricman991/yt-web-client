import { api } from "@/trpc/react";
import React, { useState } from 'react';

const CommentForm = ({ videoId }: {videoId: string}) => {
  const [username, setUsername] = useState('');
  const [commentText, setCommentText] = useState('');

  const commentUpload = api.video.setComment.useMutation()

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // console.log(`New comment from ${username}: ${commentText}`);
    // You can also send the comment data to a server here

    commentUpload.mutateAsync({videoId: videoId, commentText: commentText})
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded">
      <label className="block text-sm font-medium mb-2" htmlFor="username">
        Username: 
      </label>
      <input
        type="text"
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="bg-gray-100 p-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
      />

      <label className="block text-sm font-medium mb-2" htmlFor="comment-text">
        Comment:
      </label>
      <textarea
        id="comment-text"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        className="bg-gray-100 p-2 rounded w-full h-20 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />

      <button type="submit" className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
        Post Comment
      </button>
    </form>
  );
};

export default CommentForm;
