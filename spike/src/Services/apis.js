// apis.js

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:4000/api/v1";
//console.log("[API] Base URL:", BASE_URL);

// Authentication endpoints
export const endpoint = {
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
  LOGOUT_API: BASE_URL + "/auth/logout",
  OTP_API: BASE_URL + "/auth/sendotp",
  VERIFY_OTP_API: BASE_URL + "/auth/verifyotp",
  RESEND_OTP_API: BASE_URL + "/auth/resendotp",
  FORGOT_PASSWORD_API: BASE_URL + "/auth/forgot-password",
  RESET_PASSWORD_API: BASE_URL + "/auth/reset-password",
  CHANGE_PASSWORD_API: BASE_URL + "/auth/change-password",
  GET_ME : BASE_URL + "/auth/me",
  IS_AUTH : BASE_URL + "/auth/is-auth",

  // ✅ Tournament Endpoints
  CREATE_TOURNAMENT_API: BASE_URL + "/tournament/create",
  GET_ALL_TOURNAMENTS_API: BASE_URL + "/tournament/all",
  GET_TOURNAMENT_BY_ID : BASE_URL + "/tournament/:id",
  DELETE_TOURNAMENT_API: BASE_URL + "/tournament/delete/:id",
};

// User endpoints
export const userEndpoints = {
  GET_USER_PROFILE: BASE_URL + "/user/profile",
  UPDATE_USER_PROFILE: BASE_URL + "/user/update-profile",
  DELETE_USER_ACCOUNT: BASE_URL + "/user/delete-account",
  GET_USER_DASHBOARD: BASE_URL + "/user/dashboard",
};

export const teamEndpoints = {
  CREATE_TEAM_API: BASE_URL + "/team/create",
  JOIN_TEAM_API: BASE_URL + "/team/join",
};

export const otherEndpoints = {
  // future endpoints
};
