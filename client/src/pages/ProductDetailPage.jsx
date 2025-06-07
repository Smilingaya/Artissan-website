import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Breadcrumbs, 
  Divider,
  Tab,
  Tabs,
  Grid,
  Paper
} from '@mui/material';
import ProductDetail from '../components/ec/components/ProductDetail';
import { ProductContext } from '../components/ec/contexts/ProductContext';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ProductDetailPage = () => {
  const { id } = useParams();
  const { getProductById } = useContext(ProductContext);
  const [product, setProduct] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchedProduct = getProductById(id);
    setProduct(fetchedProduct);
  }, [id, getProductById]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h5">Product not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
          Home
        </Link>
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
          {product.category}
        </Link>
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>
      
      <ProductDetail product={product} />
      
      <Box sx={{ mt: 6 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Description" />
          <Tab label="Reviews" />
          <Tab label="Shipping & Returns" />
        </Tabs>
        
        <TabPanel value={tabValue} index={0}>
          <Paper elevation={0} sx={{ p: 3 }}>
            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>
            <Typography variant="body1">
              Our premium quality clothing is designed for comfort and style. Made from high-quality materials that are built to last.
            </Typography>
          </Paper>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Paper elevation={0} sx={{ p: 3 }}>
            <Typography variant="body1" paragraph>
              This product has {product.reviews} reviews with an average rating of {product.rating} out of 5.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Reviews feature coming soon.
            </Typography>
          </Paper>
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <Paper elevation={0} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Shipping</Typography>
            <Typography variant="body1" paragraph>
              We offer free shipping on all orders over $50. Standard shipping takes 3-5 business days.
            </Typography>
            
            <Typography variant="h6" gutterBottom>Returns</Typography>
            <Typography variant="body1">
              You can return any unused items within 30 days of receiving your order. Please note that the item must be unused and in its original packaging.
            </Typography>
          </Paper>
        </TabPanel>
      </Box>
    </Container>
  );
};

export default ProductDetailPage;