import React, { useState, useEffect } from "react";
import {
  fetchCategories,
  addCategory,
  fetchCategoryCounts,
} from "../../../profile/utils/api";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

const Categories = () => {
  /* --------------------------- State ---------------------------- */
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  /* --------------------- Fetch on Mount ------------------------- */
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        /* 1️⃣  load category rows ⬌ 2️⃣  load product totals          */
        const [rawCats, prodCounts] = await Promise.all([
          fetchCategories(), // [{ id OR _id, name, status }]
          fetchCategoryCounts(), // [{ _id, total }]
        ]);

        /* normalise each category so we always have `id` field        */
        const cats = rawCats.map((c) => ({
          ...c,
          id: c.id || c._id, // keep compatibility
        }));

        /* merge the totals in by *id*                                 */
        const merged = cats.map((cat) => {
          const match = prodCounts.find((p) => p._id === cat.id);
          return { ...cat, count: match ? match.total : 0 };
        });

        setCategories(merged);
      } catch (err) {
        console.error(err);
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /* ------------------- Add Category Handler --------------------- */
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    setSaving(true);
    try {
      // backend returns: { id OR _id, name, status }
      const created = await addCategory(newCategory);
      const newCat = {
        ...created,
        id: created.id || created._id,
        count: 0,
      };
      setCategories((prev) => [...prev, newCat]);
      setNewCategory("");
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  /* ---------------------- Toggle Status ------------------------- */
  const toggleStatus = (id) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === id
          ? { ...cat, status: cat.status === "active" ? "inactive" : "active" }
          : cat
      )
    );
  };

  /* ---------------------------- UI ------------------------------ */
  return (
    <Box sx={{ p: 3, mt: 8 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 500, color: "#333" }}>
        Categories Management
      </Typography>

      {/* Add Category */}
      <Box sx={{ mb: 4, display: "flex", gap: 2 }}>
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          placeholder="New category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={handleAddCategory}
          disabled={saving}
          sx={{
            bgcolor: "#2E8B57",
            "&:hover": { bgcolor: "#236b43" },
            opacity: saving ? 0.6 : 1,
          }}
        >
          {saving ? "Saving…" : "Add Category"}
        </Button>
      </Box>

      {/* Categories Table */}
      <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f9f9f9" }}>
                <TableCell>ID</TableCell>
                <TableCell>Category Name</TableCell>
                <TableCell>Products</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Loading…
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{ color: "error.main" }}
                  >
                    {error}
                  </TableCell>
                </TableRow>
              ) : categories.length ? (
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.id}</TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.count}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          py: 0.5,
                          px: 1.5,
                          borderRadius: 10,
                          width: "fit-content",
                          bgcolor:
                            category.status === "active"
                              ? "rgba(76, 175, 80, 0.1)"
                              : "rgba(158, 158, 158, 0.1)",
                          color:
                            category.status === "active"
                              ? "#4CAF50"
                              : "#9E9E9E",
                          textTransform: "capitalize",
                          fontSize: "0.85rem",
                        }}
                      >
                        {category.status}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => toggleStatus(category.id)}
                        sx={{
                          color:
                            category.status === "active"
                              ? "#F44336"
                              : "#4CAF50",
                          borderColor: "rgba(0, 0, 0, 0.12)",
                        }}
                      >
                        {category.status === "active"
                          ? "Deactivate"
                          : "Activate"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No categories found
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

export default Categories;
