import * as api from "../../api";

export const fetchMessages = (userId) => async (dispatch) => {
  try {
    const { data } = await api.fetchMessages(userId);
    console.log(data);
    if (!data.error)
      dispatch({ type: "FETCH_MESSAGES", payload: data.messages });
  } catch (error) {
    console.log(error);
  }
};

export const sendMessage = (messageData, info, socket) => async (dispatch) => {
  dispatch({ type: "SHOW_TEMP_MESSAGE", payload: { messageData, info } });
  try {
    socket.current.emit("send-msg", { ...messageData });
    const { data } = await api.sendMessage(messageData);
    console.log(data);
    dispatch({
      type: "SEND_MESSAGE",
      payload: { id: messageData.receiverId, data },
    });
  } catch (error) {
    console.log(error);
  }
};

export const fetchPfp = (id) => async (dispatch) => {
  try {
    const { data } = await api.fetchPfp(id);
    if (!data.error)
      dispatch({ type: "FETCH_PFP", payload: { pfp: data.pfp, senderId: id } });
  } catch (error) {
    console.log(error);
  }
};

export const fetchInfoForChat = (userId, setInfo) => async (dispatch) => {
  try {
    const { data } = await api.fetchInfoForChat(userId);
    if (!data.error) setInfo({ pfp: data.pfp, name: data.name });
  } catch (error) {
    console.log(error);
  }
};
