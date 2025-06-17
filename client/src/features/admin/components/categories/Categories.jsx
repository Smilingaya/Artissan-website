import React, { useState } from 'react';
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
  TableCell
} from '@mui/material';

const Categories = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Electronics', count: 245, status: 'active' },
    { id: 2, name: 'Clothing', count: 189, status: 'active' },
    { id: 3, name: 'Books', count: 132, status: 'active' },
    { id: 4, name: 'Home & Kitchen', count: 98, status: 'active' },
    { id: 5, name: 'Sports', count: 76, status: 'inactive' },
  ]);

  const [newCategory, setNewCategory] = useState('');

  const handleAddCategory = () => {
    if (newCategory.trim() === '') return;
    
    const newId = Math.max(...categories.map(c => c.id)) + 1;
    const categoryToAdd = {
      id: newId,
      name: newCategory,
      count: 0,
      status: 'active'
    };
    
    setCategories([...categories, categoryToAdd]);
    setNewCategory('');
  };

  const toggleStatus = (id) => {
    setCategories(categories.map(category => 
      category.id === id 
        ? { ...category, status: category.status === 'active' ? 'inactive' : 'active' } 
        : category
    ));
  };

  return (
    <Box sx={{ p: 3 ,mt:8 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 500, color: '#333' }}>
        Categories Management
      </Typography>
      
      <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="New category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          size="small"
        />
        <Button 
          variant="contained" 
          onClick={handleAddCategory}
          sx={{ 
            bgcolor: '#2E8B57', 
            '&:hover': { bgcolor: '#236b43' },
            whiteSpace: 'nowrap'
          }}
        >
          Add Category
        </Button>
      </Box>
      
      <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f9f9f9' }}>
                <TableCell>ID</TableCell>
                <TableCell>Category Name</TableCell>
                <TableCell>Products</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
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
                        width: 'fit-content',
                        bgcolor: category.status === 'active' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(158, 158, 158, 0.1)',
                        color: category.status === 'active' ? '#4CAF50' : '#9E9E9E',
                        textTransform: 'capitalize',
                        fontSize: '0.85rem'
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
                        color: category.status === 'active' ? '#F44336' : '#4CAF50',
                        borderColor: 'rgba(0, 0, 0, 0.12)'
                      }}
                    >
                      {category.status === 'active' ? 'Deactivate' : 'Activate'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Categories;