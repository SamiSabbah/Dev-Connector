import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import Spinner from '../layout/Spinner';
import PostItem from '../posts/PostItem';
import { getSelectedPost } from '../../features/postsSlice';
import { Link } from 'react-router-dom';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

const Post = () => {
  const disptach = useDispatch();
  const { id } = useParams();
  const post = useSelector((state) => state.posts.selectedPost);
  const loading = useSelector((state) => state.posts.loading);

  useEffect(() => {
    disptach(getSelectedPost(id));
  }, [disptach, id]);

  return loading || post === null ? (
    <section className="container">
      <Spinner />
    </section>
  ) : (
    <section className="container">
      <Link to="/posts" className="btn">
        Back To Posts
      </Link>
      <PostItem post={post} showAction={false} />
      <CommentForm postId={id} />
      <div className="comments">
        {post.comments.map((comment) => (
          <CommentItem key={comment._id} comment={comment} postId={id} />
        ))}
      </div>
    </section>
  );
};

export default Post;
