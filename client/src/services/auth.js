import API from "./api";

export async function login(username, password) {
  const res = await API.post("/auth/login", { username, password });
  return res.data; // { token, user }
}

export async function register(username, password) {
  const res = await API.post("/auth/register", { username, password });
  return res.data;
}

export function setAuth(token, user) {
  localStorage.setItem("token", token);
  if (user) localStorage.setItem("user", JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function getUser() {
  const u = localStorage.getItem("user");
  return u ? JSON.parse(u) : null;
}

