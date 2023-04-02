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
    }
  } catch (error) {
    console.log(error);
  }
};

export const fetchPosts = (params) => async (dispatch) => {
  try {
    const { data } = await api.fetchPosts(params);
    console.log(data);
    if (!data.error) {
      dispatch({ type: "FETCH_POSTS", payload: data.posts });
    }
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = (id) => async (dispatch) => {
  dispatch({ type: "SHOW_TEMP_DELETE_POST", payload: id });
  try {
    const { data } = await api.deletePost(id);
    if (!data.error) {
      dispatch({ type: "DELETE_POST", payload: data.postId });
    }
  } catch (error) {
    console.log(error);
  }
};
