export async function fetchSettings() {
  const res = await fetch("http://localhost:3001/api/settings", {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch settings");
  }

  return res.json();
}

export async function saveSettings(payload) {
  const res = await fetch("http://localhost:3001/api/settings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to save settings");
  }

  return res.json();
}

export async function fetchUsers() {
  const res = await fetch("http://localhost:3001/api/users", {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  return res.json();
}

export async function createUser(payload) {
  console.log("Creating user with payload:", payload);
  const res = await fetch("http://localhost:3001/api/users/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to create user");
  }

  return res.json();
}

export async function disableUser(id) {
  const res = await fetch(`http://localhost:3001/api/users/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to disable user");
  }

  return res.json();
}
