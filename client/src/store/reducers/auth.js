export default (
  state = {
    isLoading: false,
    user: JSON.parse(localStorage.getItem("user")),
    isLoadingVerification: false,
    isLoadingChangePfp: false,
  },
  action
) => {
  switch (action.type) {
    case "AUTH":
      console.log(action.payload);
      localStorage.setItem("user", JSON.stringify({ ...action.payload }));
      return { ...state, user: action.payload };
    case "LOGOUT":
      localStorage.removeItem("user");
      return { ...state, user: null };
    case "UPDATE_USER_ON_ACTION":
      return { ...state, user: action.payload };
    case "START_LOADING_AUTH":
      return { ...state, isLoading: true };
    case "STOP_LOADING_AUTH":
      return { ...state, isLoading: false };
    case "START_LOADING_VERIFICATION":
      return { ...state, isLoadingVerification: true };
    case "STOP_LOADING_VERIFICATION":
      return { ...state, isLoadingVerification: false };
    case "ADD_GROUP_TO_USER":
      return {
        ...state,
        user: {
          ...state.user,
          result: {
            ...state.user.result,
            groups: [...state.user.result.groups, action.payload],
          },
        },
      };
    case "REMOVE_GROUP_FROM_USER":
      return {
        ...state,
        user: {
          ...state.user,
          result: {
            ...state.user.result,
            groups: state.user.result.groups.filter(
              (id) => id !== action.payload
            ),
          },
        },
      };
    case "ADD_POST_TO_USER":
      return {
        ...state,
        user: {
          ...state.user,
          result: {
            ...state.user.result,
            posts: [...state.user.result.posts, action.payload],
          },
        },
      };
    case "REMOVE_POST_FROM_USER":
      return {
        ...state,
        user: {
          ...state.user,
          result: {
            ...state.user.result,
            posts: state.user.result.posts.filter(
              (post) => post.postId !== action.payload
            ),
          },
        },
      };
    case "START_LOADING_CHANGE_PFP":
      return { ...state, isLoadingChangePfp: true };
    case "STOP_LOADING_CHANGE_PFP":
      return { ...state, isLoadingChangePfp: false };
    case "CHANGE_PFP":
      return {
        ...state,
        user: {
          ...state.user,
          result: { ...state.user.result, pfp: action.payload },
        },
      };
    default:
      return state;
  }
};
