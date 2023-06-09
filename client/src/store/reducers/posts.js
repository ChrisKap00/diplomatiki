export default (
  state = {
    isLoading: false,
    data: [],
    lastFetched: false,
  },
  action
) => {
  switch (action.type) {
    case "START_LOADING_FETCH_POSTS":
      return { ...state, isLoading: true };
    case "STOP_LOADING_FETCH_POSTS":
      return { ...state, isLoading: false };
    case "CLEAR_POSTS":
      return { ...state, data: [], lastFetched: false };
    case "FETCH_POSTS":
      return {
        ...state,
        data: [...state.data, ...action.payload.posts],
        lastFetched: action.payload.last,
      };
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
                comments: [...post.comments, action.payload.comment],
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
    case "SHOW_TEMP_DEL_COMMENT":
      return {
        ...state,
        data: state.data.map((post) =>
          post._id === action.payload.postId
            ? {
                ...post,
                comments: post.comments.map((comment) =>
                  comment._id === action.payload.commentId
                    ? { ...comment, postedAt: "Deleting..." }
                    : comment
                ),
                loadingPostComment: true,
              }
            : post
        ),
      };
    case "DELETE_COMMENT":
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
                        deleted: true,
                        text: "",
                        images: [],
                        file: null,
                        postedAt: action.payload.postedAt,
                      }
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
    case "SHOW_TEMP_REPLY":
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
                        replies: [...comment.replies, action.payload.reply],
                      }
                    : comment
                ),
              }
            : post
        ),
      };
    case "POST_REPLY":
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
                        replies: comment.replies.map((reply) =>
                          reply.postedAt === "Posting..."
                            ? action.payload.reply
                            : reply
                        ),
                      }
                    : comment
                ),
              }
            : post
        ),
      };
    case "SHOW_TEMP_DEL_REPLY":
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
                        replies: comment.replies.map((reply) =>
                          reply._id === action.payload.replyId
                            ? { ...reply, postedAt: "Deleting..." }
                            : reply
                        ),
                      }
                    : comment
                ),
                loadingPostComment: true,
              }
            : post
        ),
      };
    case "DELETE_REPLY":
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
                        replies: comment.replies.map((reply) =>
                          reply._id === action.payload.replyId
                            ? {
                                ...reply,
                                deleted: true,
                                text: "",
                                images: [],
                                file: null,
                                postedAt: action.payload.postedAt,
                              }
                            : reply
                        ),
                      }
                    : comment
                ),
                loadingPostComment: false,
              }
            : post
        ),
      };
    case "START_LOADING_LIKE_REPLY":
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
                        replies: comment.replies.map((reply) =>
                          reply._id === action.payload.replyId
                            ? { ...reply, loadingLike: true }
                            : reply
                        ),
                      }
                    : comment
                ),
              }
            : post
        ),
      };
    case "STOP_LOADING_LIKE_REPLY":
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
                        replies: comment.replies.map((reply) =>
                          reply._id === action.payload.replyId
                            ? { ...reply, loadingLike: false }
                            : reply
                        ),
                      }
                    : comment
                ),
              }
            : post
        ),
      };
    case "LIKE_REPLY":
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
                        replies: comment.replies.map((reply) =>
                          reply._id === action.payload.replyId
                            ? {
                                ...reply,
                                likes: reply.likes.includes(
                                  action.payload.userId
                                )
                                  ? reply.likes.filter(
                                      (id) => id !== action.payload.userId
                                    )
                                  : [...reply.likes, action.payload.userId],
                              }
                            : reply
                        ),
                      }
                    : comment
                ),
              }
            : post
        ),
      };
    case "CHANGE_PFP_ON_POSTS":
      return {
        ...state,
        data: state.data.map((post) => ({
          ...post,
          userPfp:
            post.userId === action.payload.userId
              ? action.payload.pfp
              : post.userPfp,
          comments: post.comments.map((comment) => ({
            ...comment,
            userPfp:
              comment.userId === action.payload.userId
                ? action.payload.pfp
                : comment.userPfp,
            replies: comment.replies.map((reply) => ({
              ...reply,
              userPfp:
                reply.userId === action.payload.userId
                  ? action.payload.pfp
                  : reply.userPfp,
            })),
          })),
        })),
      };
    default:
      return state;
  }
};
