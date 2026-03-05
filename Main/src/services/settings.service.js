import api from "api/client";
import ENDPOINTS from "api/endpoints";

export async function getSettings() {
  const { data } = await api.get(ENDPOINTS.SETTINGS.app);
  return data;
}

export async function saveSettings(payload) {
  const { data } = await api.post(ENDPOINTS.SETTINGS.app, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
}

export async function getUsers() {
  const { data } = await api.get(ENDPOINTS.USERS.list);
  return data;
}

export async function createUser(payload) {
  const { data } = await api.post(ENDPOINTS.USERS.create, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
}

export async function disableUser(id) {
  const { data } = await api.delete(ENDPOINTS.USERS.detail(id));
  return data;
}
