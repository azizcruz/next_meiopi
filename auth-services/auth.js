import cookie from "react-cookies";
import store from './../store/store'

export const logout = () => {
  cookie.remove("signInUser");
};
export const isAuthenticated = () => {
  return store.getState().isLoggedIn
};
export const userData = () => {
  
  if (store.getState().userData) {
    return store.getState().userData
  } else {
    return {};
  }
};

export const getVisitorHashedIp = () => {
  return cookie.load("visitorHashedIp");
};
