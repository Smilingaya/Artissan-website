export const fetchBlacklistedUsers = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/admin/blacklist", {
      method: "GET",
      credentials: "include", // if you're using cookies for auth
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch blacklisted users");
    }

    return data;
  } catch (error) {
    console.error("Error fetching blacklisted users:", error.message);
    return [];
  }
};
export const addBlacklistedUser = async ({ name, email, reason }) => {
  try {
    const res = await fetch("http://localhost:3000/api/admin/addBlackList", {
      method: "POST",
      credentials: "include", // keep if you rely on cookies
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ name, email, reason }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to add user to blacklist");
    }

    return data; // e.g. { message: "User blacklisted successfully" }
  } catch (err) {
    console.error("Error adding blacklisted user:", err.message);
    throw err; // bubble up so the UI can show an alert
  }
};
export const deleteBlacklistedUser = async (id) => {
  try {
    const res = await fetch("http://localhost:3000/api/admin/delete", {
      method: "DELETE", // or "POST" if you use that
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to delete blacklisted user");
    }

    return data;
  } catch (error) {
    console.error("Error deleting blacklisted user:", error.message);
    throw error;
  }
};
