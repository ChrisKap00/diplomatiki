export default (
  state = {
    isLoadingCreateGroup: false,
    isLoadingFetchGroups: false,
    groups: [],
  },
  action
) => {
  switch (action.type) {
    case "START_LOADING_FETCH_GROUPS":
      return { ...state, isLoadingGroups: true };
    case "STOP_LOADING_FETCH_GROUPS":
      return { ...state, isLoadingGroups: false };
    case "FETCH_GROUPS":
      return { ...state, groups: action.payload };
    case "CREATE_GROUP":
      return { ...state, groups: [...state.groups, action.payload] };
    case "START_LOADING_CREATE_GROUP":
      return { ...state, isLoadingCreateGroup: true };
    case "STOP_LOADING_CREATE_GROUP":
      return { ...state, isLoadingCreateGroup: false };
    case "FOLLOW_GROUP":
      return {
        ...state,
        groups: state.groups.map((group) =>
          group._id === action.payload.groupId
            ? {
                ...group,
                users:
                  action.payload.type === "add"
                    ? [
                        ...group.users,
                        {
                          _id: action.payload.userId,
                          firstName: action.payload.firstName,
                          lastName: action.payload.lastName,
                          pfp: action.payload.pfp,
                        },
                      ]
                    : group.users.filter(
                        (user) => user._id !== action.payload.userId
                      ),
              }
            : group
        ),
      };
    case "START_LOADING_FOLLOW_GROUP":
      return {
        ...state,
        groups: state.groups.map((group) =>
          group._id === action.payload
            ? { ...group, loadingFollow: true }
            : group
        ),
      };
    case "STOP_LOADING_FOLLOW_GROUP":
      return {
        ...state,
        groups: state.groups.map((group) =>
          group._id === action.payload
            ? { ...group, loadingFollow: false }
            : group
        ),
      };
    default:
      return state;
  }
};
