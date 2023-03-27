import * as api from "../../api";

export const createGroup = (groupData, user) => async (dispatch) => {
  dispatch({ type: "START_LOADING_CREATE_GROUP" });
  console.log(groupData);
  try {
    const { data } = await api.createGroup({
      groupData,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        pfp: user.pfp,
      },
    });
    console.log(data);
    if (!data.error) {
      dispatch({ type: "CREATE_GROUP", payload: data.result });
    }
  } catch (error) {
    console.log(error);
  }
  dispatch({ type: "STOP_LOADING_CREATE_GROUP" });
};

export const fetchGroups = () => async (dispatch) => {
  dispatch({ type: "START_LOADING_FETCH_GROUPS" });
  try {
    const { data } = await api.fetchGroups();
    console.log(data);
    if (!data.error) {
      dispatch({ type: "FETCH_GROUPS", payload: data.groups });
    }
  } catch (error) {
    console.log(error);
  }
  dispatch({ type: "STOP_LOADING_FETCH_GROUPS" });
};

export const followGroup = (user, groupId) => async (dispatch) => {
  dispatch({ type: "START_LOADING_FOLLOW_GROUP", payload: groupId });
  try {
    const { data } = await api.followGroup({ user, groupId });
    console.log(data);
    if (!data.error) {
      dispatch({
        type: "FOLLOW_GROUP",
        payload: {
          type: data.type,
          groupId: data.groupId,
          userId: data.userId,
          firstName: data.firstName,
          lastName: data.lastName,
          pfp: data.pfp,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
  dispatch({ type: "STOP_LOADING_FOLLOW_GROUP", payload: groupId });
};
