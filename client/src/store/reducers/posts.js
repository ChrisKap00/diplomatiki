export default (
  state = {
    isLoading: false,
    data: [],
  },
  action
) => {
  switch (action.type) {
    case "START_LOADING_FETCH_POSTS":
      return { ...state, isLoading: true };
    case "STOP_LOADING_FETCH_POSTS":
      return { ...state, isLoading: false };
    case "FETCH_POSTS":
      return { ...state, data: action.payload };
    case "SHOW_TEMP_POST":
      return { ...state, data: [action.payload, ...state.data] };
    case "CREATE_POST":
      return {
        ...state,
        data: state.data.map((post) =>
          post.postedAt === "Posting..." ? action.payload : post
        ),
      };
    case "SHOW_TEMP_DELETE_POST":
      return {
        ...state,
        data: state.data.map((post) =>
          post._id === action.payload
            ? { ...post, postedAt: "Deleting..." }
            : post
        ),
      };
    case "DELETE_POST":
      return {
        ...state,
        data: state.data.filter((post) => post._id !== action.payload),
      };
    default:
      return state;
  }
};
