import React from 'react';
import { Container } from '@mui/material';
import AppHeader from './AppHeader';
import SideDrawer from './SideDrawer';
import Footer from './Footer';

const MainLayout = ({ children, searchQuery, setSearchQuery, categories, categoryTab, setCategoryTab }) => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <>
      <AppHeader 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        toggleDrawer={toggleDrawer}
      />
      
      <SideDrawer 
        categories={categories}
        categoryTab={categoryTab}
        setCategoryTab={setCategoryTab}
        drawerOpen={drawerOpen}
        toggleDrawer={toggleDrawer}
      />
      
      <Container maxWidth="xl" sx={{ mt: 10, mb: 3 }}>
        {children}
      </Container>
      
      <Footer />
    </>
  );
};

export default MainLayout; 