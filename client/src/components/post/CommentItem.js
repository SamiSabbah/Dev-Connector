import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteComment } from '../../features/postsSlice';

const CommentItem = ({
  comment: { _id, text, name, avatar, user, date },
  postId,
}) => {
  const disptach = useDispatch();
  const authUser = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

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
          Commented on {moment(date).format('YYYY/MM/DD')}
        </p>
        {!loading && user === authUser._id && (
          <button
            onClick={(e) => disptach(deleteComment(postId, _id))}
            type="button"
            className="btn btn-danger"
          >
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
