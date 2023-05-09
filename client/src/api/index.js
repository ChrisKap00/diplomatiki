import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000" });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("user")) {
    req.headers.authorization = `Bearer ${
      JSON.parse(localStorage.getItem("user")).token
    }`;
  }
  return req;
});

export const signUp = (formData) => API.post("/auth/signup", formData);
export const signIn = (formData) => API.post("/auth/signin", formData);
export const verify = (token) => API.get(`/auth/verification/${token}`);

export const changePfp = (data) => API.post("/profile/changePfp", data);
export const fetchProfileInfo = (userId) =>
  API.get(`/profile/fetchProfileInfo?userId=${userId}`);

export const createGroup = ({ groupData, user }) =>
  API.post("groups/create", { groupData, user });
export const fetchGroups = () => API.get("/groups/fetchGroups");
export const followGroup = ({
  user: { userId, firstName, lastName, pfp },
  groupId,
}) =>
  API.patch(
    `/groups/follow?userId=${userId}&firstName=${firstName}&lastName=${lastName}&pfp=${pfp}&groupId=${groupId}`
  );

export const post = (postData) => API.post("/posts/post", postData);
export const fetchPosts = (params) => API.post(`/posts/fetch`, params);
export const deletePost = (id) => API.delete(`/posts/delete?postId=${id}`);
export const likePost = ({ userId, postId }) =>
  API.patch(`/posts/like?userId=${userId}&postId=${postId}`);
export const postComment = (commentData) =>
  API.post(`/posts/comment`, commentData);
export const deleteComment = ({ postId, commentId }) =>
  API.patch(`/posts/deleteComment?postId=${postId}&commentId=${commentId}`);
export const likeComment = ({ userId, postId, commentId }) =>
  API.patch(
    `/posts/likeComment?userId=${userId}&postId=${postId}&commentId=${commentId}`
  );
export const postReply = (replyData) => API.post("/posts/reply", replyData);
export const deleteReply = ({ postId, commentId, replyId }) =>
  API.patch(
    `/posts/deleteReply?postId=${postId}&commentId=${commentId}&replyId=${replyId}`
  );
export const likeReply = ({ userId, postId, commentId, replyId }) =>
  API.patch(
    `/posts/likeReply?userId=${userId}&postId=${postId}&commentId=${commentId}&replyId=${replyId}`
  );

export const fetchMessages = (userId) =>
  API.get(`/messages/fetchMessages?userId=${userId}`);
export const sendMessage = (messageData) =>
  API.post("messages/sendMessage", messageData);
export const fetchInfoForChat = (userId) =>
  API.get(`/messages/fetchInfoForChat?userId=${userId}`);
