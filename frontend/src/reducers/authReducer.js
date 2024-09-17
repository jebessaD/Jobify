import { LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT } from "../actions/types";

const user = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  loading: true,
  user: user,
};

console.log(initialState, "initialState", localStorage.getItem("user"));

export default function authReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case LOGIN_SUCCESS:
      localStorage.setItem("token", payload.token);
      localStorage.setItem("user", JSON.stringify(payload.user));
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
      };
    case LOGIN_FAIL:
    case LOGOUT:
      localStorage.setItem("token", null);
      localStorage.removeItem("token");
      localStorage.setItem("user", null);
      localStorage.removeItem("user");
      return {
        ...state,
        user:null,
        token: null,
        isAuthenticated: null,
        loading: false,
      };
    default:
      return state;
  }
}
