export const fetchUserData = async () => {
  try {
    const response = await fetch('/api/user'); // Adjust URL based on your API
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    return null;
  }
};
