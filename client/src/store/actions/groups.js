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
      dispatch({ type: "ADD_GROUP_TO_USER", payload: data.result._id });
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

export const followGroup = (userId, groupId) => async (dispatch) => {
  dispatch({ type: "START_LOADING_FOLLOW_GROUP", payload: groupId });
  console.log("HERE");
  try {
    const { data } = await api.followGroup({ userId, groupId });
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
      if (data.type === "add") dispatch({ type: "ADD_GROUP_TO_USER", payload: data.groupId });
      else dispatch({ type: "REMOVE_GROUP_FROM_USER", payload: data.groupId });
    }
  } catch (error) {
    console.log(error);
  }
  dispatch({ type: "STOP_LOADING_FOLLOW_GROUP", payload: groupId });
};
