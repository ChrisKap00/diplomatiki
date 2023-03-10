export default (
  state = {
    isLoading: false,
    user: JSON.parse(localStorage.getItem("user")),
    isLoadingVerification: false,
  },
  action
) => {
  switch (action.type) {
    case "AUTH":
      console.log(action?.data);
      localStorage.setItem("user", JSON.stringify({ ...action?.payload }));
      return { ...state, user: action?.payload };
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
    default:
      return state;
  }
};
