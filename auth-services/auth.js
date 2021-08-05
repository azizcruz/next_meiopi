import cookie from "react-cookies";

export const logout = () => {
  cookie.remove("signInUser");
};
export const isAuthenticated = () => {
  if (cookie.load("signInUser").username && cookie.load("signInUser").token) {
    return true;
  } else {
    return false;
  }
};
export const userData = () => {
  if (cookie.load("signInUser").username) {
    return {
      id: cookie.load("signInUser").id,
      username: cookie.load("signInUser").username,
    };
  } else {
    return {};
  }
};

export const getVisitorHashedIp = () => {
  return cookie.load("visitorHashedIp");
};
