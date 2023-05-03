import * as api from "../../api";

export const changePfp = (userId, pfp) => async (dispatch) => {
  dispatch({ type: "START_LOADING_CHANGE_PFP" });
  try {
    const { data } = await api.changePfp({ userId, pfp });
    console.log(data);
    if (!data.error) {
      dispatch({ type: "CHANGE_PFP", payload: pfp });
      dispatch({ type: "CHANGE_PFP_ON_POSTS", payload: { userId, pfp } });
    }
  } catch (error) {
    console.log(error);
  }
  dispatch({ type: "STOP_LOADING_CHANGE_PFP" });
};
