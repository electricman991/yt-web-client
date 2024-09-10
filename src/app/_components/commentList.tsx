import { api } from '@/trpc/react';
import React from 'react';

interface Comment {
  username: string;
  commentText: string;
}
const CommentsList = () => {

  const [comments] = api.video.getComments.useSuspenseQuery();
  return (
    <div className="bg-gray-100 p-4 rounded mt-4">
      {comments.map((comment, index) => (
        <p key={index} className="mb-2 text-sm">
          {comment.username}: {comment.content}
        </p>
      ))}
    </div>
  );
};

export default CommentsList;
