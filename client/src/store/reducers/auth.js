export default (
  state = {
    isLoading: false,
    user: JSON.parse(localStorage.getItem("user")),
    isLoadingVerification: false,
    isLoadingChangePfp: false,
    isLoadingReadNotifications: false,
    isLoadingFetchNotifications: false,
  },
  action
) => {
  switch (action.type) {
    case "AUTH":
      console.log(action.payload);
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...action.payload,
          result: {
            ...action.payload.result,
            notifications: action.payload.result.notifications.map(
              (notification) =>
                notification.unread
                  ? { ...notification, unreadClient: true }
                  : notification
            ),
          },
        })
      );
      return {
        ...state,
        user: {
          ...action.payload,
          result: {
            ...action.payload.result,
            notifications: action.payload.result.notifications.map(
              (notification) =>
                notification.unread
                  ? { ...notification, unreadClient: true }
                  : notification
            ),
          },
        },
      };
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
    case "RECEIVE_NOTIFICATION":
      return {
        ...state,
        user: {
          ...state.user,
          result: {
            ...state.user.result,
            notifications: [
              { ...action.payload, unreadClient: true },
              ...state.user.result.notifications,
            ],
          },
        },
      };
    case "START_LOADING_READ_NOTIFICATIONS":
      return { ...state, isLoadingReadNotifications: true };
    case "STOP_LOADING_READ_NOTIFICATIONS":
      return { ...state, isLoadingReadNotifications: false };
    case "READ_NOTIFICATIONS":
      return {
        ...state,
        user: {
          ...state.user,
          result: {
            ...state.user.result,
            notifications: state.user.result.notifications.map((notification) =>
              notification.unread
                ? { ...notification, unread: false }
                : { ...notification }
            ),
          },
        },
      };
    case "READ_NOTIFICATIONS_CLIENT":
      return {
        ...state,
        user: {
          ...state.user,
          result: {
            ...state.user.result,
            notifications: state.user.result.notifications.map((notification) =>
              notification.unreadClient
                ? { ...notification, unreadClient: false }
                : { ...notification }
            ),
          },
        },
      };
    case "START_LOADING_FETCH_NOTIFICATIONS":
      return { ...state, isLoadingFetchNotifications: true };
    case "STOP_LOADING_FETCH_NOTIFICATIONS":
      return { ...state, isLoadingFetchNotifications: false };
    case "FETCH_NOTIFICATIONS":
      return {
        ...state,
        user: {
          ...state.user,
          result: {
            ...state.user.result,
            notifications: action.payload
              .map((notification) =>
                notification.unread
                  ? {
                      ...notification,
                      unreadClient: true,
                    }
                  : notification
              )
              .sort(() => -1),
          },
        },
      };
    default:
      return state;
  }
};
