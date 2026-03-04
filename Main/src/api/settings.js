import api from "api/client";

export async function fetchSettings() {
  const { data } = await api.get("/api/settings");
  return data;
}

export async function saveSettings(payload) {
  const { data } = await api.post("/api/settings", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
}

export async function fetchUsers() {
  const { data } = await api.get("/api/users");
  return data;
}

export async function createUser(payload) {
  console.log("Creating user with payload:", payload);
  const { data } = await api.post("/api/users/create", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
}

export async function disableUser(id) {
  const { data } = await api.delete(`/api/users/${id}`);
  return data;
}
