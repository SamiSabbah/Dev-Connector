import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { io } from 'socket.io-client';

import { setAlertWithTime } from './alertsSlice';

const socket = io();

const initialState = {
  posts: [],
  selectedPost: null,
  loading: true,
  errors: {},
};

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
      state.loading = false;
    },
    setSelectedPost: (state, action) => {
      state.posts = state.posts.map((post) =>
        post._id === action.payload._id ? { ...post, ...action.payload } : post
      );
      state.selectedPost = action.payload;
      state.loading = false;
    },
    setErrors: (state, action) => {
      state.errors = action.payload;
      state.loading = false;
    },
    updateLikes: (state, action) => {
      state.posts = state.posts.map((post) =>
        post._id === action.payload.postId
          ? { ...post, likes: action.payload.likes }
          : post
      );
      state.loading = false;
    },
    postDelete: (state, action) => {
      state.posts = state.posts.filter(
        (post) => post._id !== action.payload.postId
      );
      state.loading = false;
    },
    postAdd: (state, action) => {
      state.posts = [action.payload, ...state.posts];
      state.loading = false;
    },
    commentAdd: (state, action) => {
      state.selectedPost = { ...state.selectedPost, comments: action.payload };
      state.loading = false;
    },
    commentDelete: (state, action) => {
      state.selectedPost = {
        ...state.selectedPost,
        comments: state.selectedPost.comments.filter(
          (comment) => comment._id !== action.payload
        ),
      };
      state.loading = false;
    },
  },
});

export const {
  setPosts,
  setErrors,
  updateLikes,
  postDelete,
  postAdd,
  setSelectedPost,
  commentAdd,
  commentDelete,
} = postsSlice.actions;

// Get all posts
export const getPosts = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/posts');

    dispatch(setPosts(res.data));
  } catch (err) {
    dispatch(
      setErrors({ msg: err.response.statusText, status: err.response.status })
    );
  }
};

// Get post
export const getSelectedPost = (postId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/posts/${postId}`);

    dispatch(setSelectedPost(res.data));
  } catch (err) {
    dispatch(
      setErrors({ msg: err.response.statusText, status: err.response.status })
    );
  }
};

// Add like
export const addLike = (postId) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/posts/like/${postId}`);

    dispatch(updateLikes({ postId, likes: res.data }));
    socket.emit('like post', postId);
  } catch (err) {
    dispatch(
      setErrors({ msg: err.response.data.msg, status: err.response.status })
    );
    if (err.response.status === 400)
      dispatch(
        setAlertWithTime({ alertType: 'danger', msg: err.response.data.msg })
      );
  }
};

// remove like
export const removeLike = (postId) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/posts/unlike/${postId}`);

    dispatch(updateLikes({ postId, likes: res.data }));
    socket.emit('unlike post', postId);
  } catch (err) {
    dispatch(
      setErrors({ msg: err.response.data.msg, status: err.response.status })
    );
    if (err.response.status === 400)
      dispatch(
        setAlertWithTime({ alertType: 'danger', msg: err.response.data.msg })
      );
  }
};

// Delete post
export const deletePost = (postId) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/posts/${postId}`);

    dispatch(postDelete({ postId, likes: res.data }));
    dispatch(setAlertWithTime({ alertType: 'success', msg: 'Post Removed!' }));
    socket.emit('delete post');
  } catch (err) {
    dispatch(
      setErrors({ msg: err.response.statusText, status: err.response.status })
    );
  }
};

// Add post
export const addPost = (formData) => async (dispatch) => {
  try {
    const res = await axios.post('/api/posts', formData);

    dispatch(postAdd(res.data));
    dispatch(setAlertWithTime({ alertType: 'success', msg: 'Post Created!' }));
    socket.emit('add post');
  } catch (err) {
    dispatch(
      setErrors({ msg: err.response.statusText, status: err.response.status })
    );
  }
};

// Add comment
export const addComment = (postId, formData) => async (dispatch) => {
  try {
    const res = await axios.post(`/api/posts/comment/${postId}`, formData);

    dispatch(commentAdd(res.data));
    dispatch(setAlertWithTime({ alertType: 'success', msg: 'Comment Added' }));
    socket.emit('add comment', postId);
  } catch (err) {
    dispatch(
      setErrors({ msg: err.response.statusText, status: err.response.status })
    );
  }
};

// Delete comment
export const deleteComment = (postId, commentId) => async (dispatch) => {
  try {
    await axios.delete(`/api/posts/comment/${postId}/${commentId}`);

    dispatch(commentDelete(commentId));
    dispatch(
      setAlertWithTime({ alertType: 'success', msg: 'Comment Deleted!' })
    );
    socket.emit('delete comment', postId);
  } catch (err) {
    dispatch(
      setErrors({ msg: err.response.statusText, status: err.response.status })
    );
  }
};

export default postsSlice.reducer;
