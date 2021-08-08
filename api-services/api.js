import api from "./axios";
import Cookies from "js-cookie";

const jwtoken = Cookies.get("_auth");
const jwtType = Cookies.get("_auth_type");
api.defaults.headers.common["Authorization"] = `${jwtType} ${jwtoken}`;

// Questions api
export const addQuestion = (payload) =>
  api.post("/v1/posts", payload).then((res) => res.data);

export const editQuestion = (payload) => {
  api
    .put(`/v1/posts/${payload.postId}`, payload.payload)
    .then((res) => res.data);
};

export const getQuestions = () =>
  api.get("/v1/posts?limit=20").then((res) => res.data);

export const getSingleQuestion = (payload) =>
  api
    .get(`/v1/posts/${payload.postId}/${payload.slug}`)
    .then((res) => res.data);

// User api
export const getHashedIp = (payload) => {
  return api.post("/v1/posts/get-hashed-ip", payload).then((res) => res.data);
};

// Opinions api
export const addOpinion = (payload) =>
  api
    .post(`/v1/posts/${payload.postId}/comment`, { content: payload.content })
    .then((res) => res.data);

export const submitAgreeWith = (payload) =>
  api
    .put(`/v1/posts/${payload.commentId}/comment/up-vote`, {
      userIpOrId: payload.userIpOrId,
    })
    .then((res) => res.data);

export const editOpinion = (payload) =>
  api
    .put(`/v1/posts/${payload.commentId}/comment`, { content: payload.content })
    .then((res) => res.data);

export const editReply = (payload) =>
  api
    .put(`/v1/posts/${payload.replyId}/reply`, { content: payload.content })
    .then((res) => res.data);

export const addReply = (payload) =>
  api
    .post(`/v1/posts/${payload.commentId}/reply`, { content: payload.content })
    .then((res) => res.data);

export const fetchOpinions = (payload) =>
  api.get(`/v1/posts/${payload.postId}/post/comment`).then((res) => res.data);

// User api
export const login = (payload) =>
  api.post(`/v1/auth/login`, payload).then((res) => res.data);
export const logout = (payload) =>
  api.get(`/v1/users/${payload.userId}`).then((res) => res.data);
export const fetchUser = (payload) =>
  api.get(`/v1/users/${payload.userId}`).then((res) => res.data);

// Tags api
export const getTags = () => api.get(`/v1/posts/tags`).then((res) => res.data);

// Poll api
export const votePoll = (payload) => {
  let postId = payload.postId;
  delete payload.postId;
  delete payload.option;
  return api
    .put(`/v1/posts/${postId}/poll/vote`, payload)
    .then((res) => res.data);
};
