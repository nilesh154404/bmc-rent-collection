import axios from "axios";

const API_URL = "https://dev.authentication.payplatter.in/auth";

export const LOGIN_URL = `${API_URL}/sign-in`;
export const VERIFY_TOKEN_URL = `${API_URL}/verify_token`;

export const loginUser = (username: string, password: string) => {
  return axios.post(LOGIN_URL, {
    username,
    password,
  });
};
export const verifyToken = (token: string) => {
  return axios.post(VERIFY_TOKEN_URL, { token });
};