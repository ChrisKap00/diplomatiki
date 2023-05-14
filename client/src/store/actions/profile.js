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

export const fetchProfileInfo = (userId, setProfile) => async (dispatch) => {
  try {
    const { data } = await api.fetchProfileInfo(userId);
    if (!data.error) {
      setProfile({
        _id: userId,
        pfp: data.pfp,
        firstName: data.firstName,
        lastName: data.lastName,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const fetchUsers = (query, setUsers) => async (dispatch) => {
  try {
    const { data } = await api.fetchUsers(query);
    console.log(data);
    if (!data.error) {
      setUsers(data.users);
    }
  } catch (error) {
    console.log(error);
  }
};

export const readNotifications = (userId) => async (dispatch) => {
  dispatch({ type: "START_LOADING_READ_NOTIFICATIONS" });
  try {
    const { data } = await api.readNotifications(userId);
    console.log(data);
    if (!data.error) {
      dispatch({ type: "READ_NOTIFICATIONS" });
    }
  } catch (error) {
    console.log(error);
  }
  dispatch({ type: "STOP_LOADING_READ_NOTIFICATIONS" });
};

export const fetchNotifications = (userId) => async (dispatch) => {
  dispatch({ type: "START_LOADING_FETCH_NOTIFICATIONS" });
  try {
    const { data } = await api.fetchNotifications(userId);
    console.log(data);
    if (!data.error) {
      dispatch({ type: "FETCH_NOTIFICATIONS", payload: data.notifications });
    }
  } catch (error) {
    console.log(error);
  }
  dispatch({ type: "STOP_LOADING_FETCH_NOTIFICATIONS" });
};
