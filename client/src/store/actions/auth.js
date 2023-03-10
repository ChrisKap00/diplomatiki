import * as api from "../../api";

export const signup = (formData, setAlert) => async (dispatch) => {
  dispatch({ type: "START_LOADING_AUTH" });
  try {
    const { data } = await api.signUp(formData);
    console.log(data);
    setAlert(data);
  } catch (error) {
    setAlert(error.response.data);
  }
  dispatch({ type: "STOP_LOADING_AUTH" });
};

export const signin = (formData, navigate, setAlert) => async (dispatch) => {
  dispatch({ type: "START_LOADING_AUTH" });
  try {
    const { data } = await api.signIn(formData);
    console.log(data);
    if (!data.error) {
      dispatch({ type: "AUTH", payload: data });
      navigate(0);
    } else {
      setAlert(data);
    }
  } catch (error) {
    setAlert(error.response.data);
  }
  dispatch({ type: "STOP_LOADING_AUTH" });
};

export const verify = (token, setAlert) => async (dispatch) => {
  dispatch({ type: "START_LOADING_VERIFICATION" });
  try {
    const { data } = await api.verify(token);
    console.log(data);
    setAlert(data);
  } catch (error) {
    console.log(error);
    setAlert(error.response.data);
  }
  dispatch({ type: "STOP_LOADING_VERIFICATION" });
};
