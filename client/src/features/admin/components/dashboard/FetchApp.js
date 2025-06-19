export const fetchUserCount = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/user/length_user", {
      method: "GET",
      credentials: "include", // keep if you rely on cookies / sessions
      headers: {
        Accept: "application/json",
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch user count");
    }

    // data = { success: true, count: 42 }
    return data.count;
  } catch (err) {
    console.error("Error fetching user count:", err.message);
    throw err; // bubble up so caller can react
  }
};
