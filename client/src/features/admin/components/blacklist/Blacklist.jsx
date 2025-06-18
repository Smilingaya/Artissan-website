import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import {
  fetchBlacklistedUsers,
  addBlacklistedUser,
  deleteBlacklistedUser,
} from "./list"; // ✅ Adjust the path if needed

const Blacklist = () => {
  const [blacklistedUsers, setBlacklistedUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    reason: "",
  });

  // Fetch blacklisted users on component mount
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchBlacklistedUsers(); // e.g. [{ _id, name, email, reason, createdAt }]
        const rows = data.map((u, i) => ({
          id: u._id || i + 1,
          name: u.name,
          email: u.email,
          reason: u.reason,
          date: u.createdAt?.slice(0, 10), // Format: YYYY-MM-DD
        }));
        setBlacklistedUsers(rows);
      } catch (err) {
        console.error("Failed to load blacklist:", err.message);
      }
    })();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value,
    });
  };

  const handleAddToBlacklist = async () => {
    if (!newUser.name || !newUser.email || !newUser.reason) {
      alert("Please fill in all fields");
      return;
    }

    try {
      // 1. Call the backend to add the user
      await addBlacklistedUser(newUser);

      // 2. Refresh the list from backend (optional but better)
      const data = await fetchBlacklistedUsers();
      const rows = data.map((u, i) => ({
        id: u._id || i + 1,
        name: u.name,
        email: u.email,
        reason: u.reason,
        date: u.createdAt?.slice(0, 10),
      }));

      setBlacklistedUsers(rows);
      setNewUser({ name: "", email: "", reason: "" });
    } catch (err) {
      alert(err.message || "Failed to add user to blacklist");
    }
  };

  const handleRemoveFromBlacklist = async (id) => {
    try {
      await deleteBlacklistedUser(id);
      setBlacklistedUsers(blacklistedUsers.filter((user) => user.id !== id));
    } catch (err) {
      alert(err.message || "Failed to remove user from blacklist");
    }
  };

  return (
    <Box sx={{ p: 3, mt: 8 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 500, color: "#333" }}>
        User Blacklist Management
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 2, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 500 }}>
          Add User to Blacklist
        </Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={newUser.name}
              onChange={handleInputChange}
              placeholder="Enter name"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={newUser.email}
              onChange={handleInputChange}
              placeholder="Enter email"
              variant="outlined"
            />
          </Grid>
        </Grid>

        <TextField
          fullWidth
          label="Reason"
          name="reason"
          multiline
          rows={4}
          value={newUser.reason}
          onChange={handleInputChange}
          placeholder="Enter reason for blacklisting"
          variant="outlined"
          sx={{ mb: 3 }}
        />

        <Button
          variant="contained"
          onClick={handleAddToBlacklist}
          sx={{
            bgcolor: "#2E8B57",
            "&:hover": { bgcolor: "#236b43" },
          }}
        >
          Add to Blacklist
        </Button>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 500 }}>
          Blacklisted Users
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f9f9f9" }}>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Date Added</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {blacklistedUsers.length > 0 ? (
                blacklistedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.reason}</TableCell>
                    <TableCell>{user.date}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        color="error"
                        onClick={() => handleRemoveFromBlacklist(user.id)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{ py: 4, color: "#999" }}
                  >
                    No users in blacklist
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Blacklist;
