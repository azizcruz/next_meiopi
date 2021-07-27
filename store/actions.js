import { action } from "easy-peasy";

export default {
  getFollowingQuestions: action((state, payload) => {
    let currentList = localStorage.getItem("followingQuestions")
      ? JSON.parse(localStorage.getItem("followingQuestions"))
      : [];

    state.followingQuestions = currentList;
  }),

  // ======

  setFollowingQuestions: action((state, payload) => {
    let currentList = [...payload.prevList];

    currentList.push({
      questionId: payload.questionId,
      slug: payload.slug,
      content: payload.content,
    });

    if (currentList.length > 5) {
      currentList.shift();
    }

    state.followingQuestions = currentList;
    localStorage.setItem("followingQuestions", JSON.stringify(currentList));
  }),
};
