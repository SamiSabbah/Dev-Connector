import moment from 'moment';
import { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addLike, deletePost, removeLike } from '../../features/postsSlice';

const PostItem = ({
  post: { _id, text, name, avatar, user, likes, comments, date },
  showAction = true,
}) => {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);
  const authLoading = useSelector((state) => state.auth.loading);

  return (
    <div className="post bg-white p-1 my-1">
      <div>
        <Link to={`/profile/${user}`}>
          <img className="round-img" src={avatar} alt={name} />
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        <p className="my-1">{text}</p>
        <p className="post-date">
          Posted on {moment(date).format('YYYY/MM/DD')}
        </p>

        {showAction && (
          <Fragment>
            <button
              onClick={(e) => dispatch(addLike(_id))}
              type="button"
              className="btn btn-light"
            >
              <i className="fas fa-thumbs-up"></i>
              {likes.length > 0 && <span> {likes.length}</span>}
            </button>
            <button
              onClick={(e) => dispatch(removeLike(_id))}
              type="button"
              className="btn btn-light"
            >
              <i className="fas fa-thumbs-down"></i>
            </button>
            <Link to={`/posts/${_id}`} className="btn btn-primary">
              Discussion{' '}
              {comments.length > 0 && (
                <span className="comment-count"> {comments.length}</span>
              )}
            </Link>
            {!authLoading && user === authUser._id && (
              <button
                onClick={(e) => dispatch(deletePost(_id))}
                type="button"
                className="btn btn-danger"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default PostItem;
