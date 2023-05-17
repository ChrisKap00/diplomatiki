import * as api from "../../api";

export const post = (postData) => async (dispatch) => {
  dispatch({
    type: "SHOW_TEMP_POST",
    payload: {
      userName: postData.userName,
      userId: postData.userId,
      userPfp: postData.userPfp,
      groupId: postData.groupId,
      groupName: postData.groupName,
      text: postData.text,
      images: postData.images,
      file: postData.file,
      postedAt: "Posting...",
      likes: [],
      comments: [],
    },
  });
  try {
    const { data } = await api.post(postData);
    console.log(data);
    if (!data.error) {
      dispatch({
        type: "CREATE_POST",
        payload: {
          _id: data.postId,
          userName: postData.userName,
          userId: postData.userId,
          userPfp: postData.userPfp,
          groupId: postData.groupId,
          groupName: postData.groupName,
          text: postData.text,
          images: postData.images,
          file: postData.file,
          postedAt: data.postedAt,
          likes: [],
          comments: [],
        },
      });
      dispatch({
        type: "ADD_POST_TO_USER",
        payload: { groupId: postData.groupId, postId: data.postId },
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const fetchPosts = (params) => async (dispatch) => {
  dispatch({ type: "START_LOADING_FETCH_POSTS" });
  try {
    const { data } = await api.fetchPosts(params);
    console.log(data);
    if (!data.error) {
      dispatch({
        type: "FETCH_POSTS",
        payload: { posts: data.posts, last: data.last },
      });
    }
  } catch (error) {
    console.log(error);
  }
  dispatch({ type: "STOP_LOADING_FETCH_POSTS" });
};

export const fetchPost =
  (postId, setPost, setIsloading) => async (dispatch) => {
    setIsloading(true);
    try {
      const { data } = await api.fetchPost(postId);
      console.log(data);
      if (!data.error) {
        setIsloading(false);
        setPost(data.post);
        return;
      }
    } catch (error) {
      console.log(error);
    }
    setIsloading(false);
  };

export const deletePost = (id) => async (dispatch) => {
  dispatch({ type: "SHOW_TEMP_DELETE_POST", payload: id });
  try {
    const { data } = await api.deletePost(id);
    if (!data.error) {
      dispatch({ type: "DELETE_POST", payload: data.postId });
      dispatch({ type: "REMOVE_POST_FROM_USER", payload: data.postId });
    }
  } catch (error) {
    console.log(error);
  }
};

export const likePost =
  ({ userId, postId }) =>
  async (dispatch) => {
    dispatch({ type: "START_LOADING_LIKE_POST", payload: postId });
    try {
      const { data } = await api.likePost({ userId, postId });
      if (!data.error) {
        dispatch({
          type: "LIKE_POST",
          payload: { userId: data.userId, postId: data.postId },
        });
      }
    } catch (error) {
      console.log(error);
    }
    dispatch({ type: "STOP_LOADING_LIKE_POST", payload: postId });
  };

export const postComment = (commentData) => async (dispatch) => {
  dispatch({
    type: "SHOW_TEMP_COMMENT",
    payload: {
      comment: {
        userName: commentData.userName,
        userId: commentData.userId,
        userPfp: commentData.userPfp,
        text: commentData.comment.text,
        images: commentData.comment.images,
        file: commentData.comment.file,
        postedAt: "Posting...",
        deleted: false,
        likes: [],
        replies: [],
      },
      postId: commentData.postId,
    },
  });
  try {
    console.log(commentData);
    const { data } = await api.postComment(commentData);
    console.log(data);
    if (!data.error) {
      dispatch({
        type: "POST_COMMENT",
        payload: {
          comment: {
            userName: commentData.userName,
            userId: commentData.userId,
            userPfp: commentData.userPfp,
            text: commentData.comment.text,
            images: commentData.comment.images,
            file: commentData.comment.file,
            postedAt: data.postedAt,
            likes: [],
            replies: [],
            _id: data.commentId,
          },
          postId: commentData.postId,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const deleteComment = (params) => async (dispatch) => {
  dispatch({ type: "SHOW_TEMP_DEL_COMMENT", payload: params });
  try {
    const { data } = await api.deleteComment(params);
    console.log(data);
    if (!data.error) {
      dispatch({
        type: "DELETE_COMMENT",
        payload: {
          postId: params.postId,
          commentId: params.commentId,
          postedAt: data.postedAt,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const likeComment = (params) => async (dispatch) => {
  dispatch({ type: "START_LOADING_LIKE_COMMENT", payload: params });
  try {
    const { data } = await api.likeComment(params);
    console.log(data);
    if (!data.error) dispatch({ type: "LIKE_COMMENT", payload: params });
  } catch (error) {
    console.log(error);
  }
  dispatch({ type: "STOP_LOADING_LIKE_COMMENT", payload: params });
};

export const postReply = (replyData) => async (dispatch) => {
  dispatch({
    type: "SHOW_TEMP_REPLY",
    payload: {
      reply: {
        userName: replyData.userName,
        userId: replyData.userId,
        userPfp: replyData.userPfp,
        text: replyData.reply.text,
        images: replyData.reply.images,
        file: replyData.reply.file,
        postedAt: "Posting...",
        deleted: false,
        likes: [],
        replies: [],
      },
      postId: replyData.postId,
      commentId: replyData.commentId,
    },
  });
  try {
    const { data } = await api.postReply(replyData);
    console.log(data);
    if (!data.error) {
      dispatch({
        type: "POST_REPLY",
        payload: {
          reply: {
            userName: replyData.userName,
            userId: replyData.userId,
            userPfp: replyData.userPfp,
            text: replyData.reply.text,
            images: replyData.reply.images,
            file: replyData.reply.file,
            postedAt: data.postedAt,
            likes: [],
            replies: [],
            _id: data.replyId,
          },
          postId: replyData.postId,
          commentId: replyData.commentId,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const deleteReply = (params) => async (dispatch) => {
  dispatch({ type: "SHOW_TEMP_DEL_REPLY", payload: params });
  try {
    const { data } = await api.deleteReply(params);
    console.log(data);
    if (!data.error) {
      dispatch({
        type: "DELETE_REPLY",
        payload: {
          postId: params.postId,
          commentId: params.commentId,
          replyId: params.replyId,
          postedAt: data.postedAt,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const likeReply = (params) => async (dispatch) => {
  dispatch({ type: "START_LOADING_LIKE_REPLY", payload: params });
  try {
    const { data } = await api.likeReply(params);
    console.log(data);
    if (!data.error) dispatch({ type: "LIKE_REPLY", payload: params });
  } catch (error) {
    console.log(error);
  }
  dispatch({ type: "STOP_LOADING_LIKE_REPLY", payload: params });
};
