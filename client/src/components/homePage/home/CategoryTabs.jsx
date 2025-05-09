import React from 'react';
import { Box, Tabs, Tab } from '@mui/material';

const CategoryTabs = ({ categories, categoryTab, handleCategoryChange }) => {
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
      <Tabs 
        value={categoryTab} 
        onChange={handleCategoryChange}
        variant="scrollable"
        scrollButtons="auto"
      >
        {categories.map((category) => (
          <Tab key={category} label={category} />
        ))}
      </Tabs>
    </Box>
  );
};

export default CategoryTabs;