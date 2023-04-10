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
    case "START_LOADING_LIKE_POST":
      return {
        ...state,
        data: state.data.map((post) =>
          post._id === action.payload ? { ...post, loadingLike: true } : post
        ),
      };
    case "STOP_LOADING_LIKE_POST":
      return {
        ...state,
        data: state.data.map((post) =>
          post._id === action.payload ? { ...post, loadingLike: false } : post
        ),
      };
    case "LIKE_POST":
      return {
        ...state,
        data: state.data.map((post) =>
          post._id === action.payload.postId
            ? {
                ...post,
                likes: post.likes.includes(action.payload.userId)
                  ? post.likes.filter((id) => id !== action.payload.userId)
                  : [...post.likes, action.payload.userId],
              }
            : post
        ),
      };
    case "SHOW_TEMP_COMMENT":
      return {
        ...state,
        data: state.data.map((post) =>
          post._id === action.payload.postId
            ? {
                ...post,
                comments: [action.payload.comment, ...post.comments],
                loadingPostComment: true,
              }
            : post
        ),
      };
    case "POST_COMMENT":
      return {
        ...state,
        data: state.data.map((post) =>
          post._id === action.payload.postId
            ? {
                ...post,
                comments: post.comments.map((comment) =>
                  comment.postedAt === "Posting..."
                    ? action.payload.comment
                    : comment
                ),
                loadingPostComment: false,
              }
            : post
        ),
      };
    case "START_LOADING_LIKE_COMMENT":
      return {
        ...state,
        data: state.data.map((post) =>
          post._id === action.payload.postId
            ? {
                ...post,
                comments: post.comments.map((comment) =>
                  comment._id === action.payload.commentId
                    ? { ...comment, loadingLike: true }
                    : comment
                ),
              }
            : post
        ),
      };
    case "STOP_LOADING_LIKE_COMMENT":
      return {
        ...state,
        data: state.data.map((post) =>
          post._id === action.payload.postId
            ? {
                ...post,
                comments: post.comments.map((comment) =>
                  comment._id === action.payload.commentId
                    ? { ...comment, loadingLike: false }
                    : comment
                ),
              }
            : post
        ),
      };
    case "LIKE_COMMENT":
      return {
        ...state,
        data: state.data.map((post) =>
          post._id === action.payload.postId
            ? {
                ...post,
                comments: post.comments.map((comment) =>
                  comment._id === action.payload.commentId
                    ? {
                        ...comment,
                        likes: comment.likes.includes(action.payload.userId)
                          ? comment.likes.filter(
                              (id) => id !== action.payload.userId
                            )
                          : [...comment.likes, action.payload.userId],
                      }
                    : comment
                ),
              }
            : post
        ),
      };
    default:
      return state;
  }
};
