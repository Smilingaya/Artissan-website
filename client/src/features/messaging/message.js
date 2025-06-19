export const fetchContacts = async (userId) => {
  const res = await fetch(`http://localhost:3000/api/user/${userId}/contacts`, {
    credentials: "include", // if you're using cookies/session
    headers: {
      Accept: "application/json",
      // Uncomment below if you use JWT auth
      // Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) {
    const msg = await res.text(); // tries to extract error message from body
    throw new Error(`Unable to fetch contacts: ${msg || res.statusText}`);
  }

  return res.json(); // expected to return contacts as an array of user objects
};
