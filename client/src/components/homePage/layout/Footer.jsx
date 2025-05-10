import React from 'react';
import { 
  Box, Container, Grid, Typography, TextField, Button 
} from '@mui/material';

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', p: 6, mt: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              About Us
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Artisan connects talented creators with people who appreciate handmade crafts. 
              Our platform celebrates creativity, craftsmanship, and sustainable production.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Useful Links
            </Typography>
            <Typography variant="body2" color="text.secondary" display="block" gutterBottom>
              Help Center
            </Typography>
            <Typography variant="body2" color="text.secondary" display="block" gutterBottom>
              Seller Registration
            </Typography>
            <Typography variant="body2" color="text.secondary" display="block" gutterBottom>
              Become an Affiliate
            </Typography>
            <Typography variant="body2" color="text.secondary" display="block">
              Report an Issue
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: support@artisan.com
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Phone: +1 (555) 123-4567
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Subscribe to our newsletter:
            </Typography>
            <Box sx={{ display: 'flex', mt: 1 }}>
              <TextField
                size="small"
                placeholder="Your email"
                sx={{ mr: 1 }}
              />
              <Button variant="contained" size="small">
                Subscribe
              </Button>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ mt: 5 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            © 2025 Artisan. All rights reserved.
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
            <a href="/privacy-policy" style={{ marginRight: 10 }}>Privacy Policy</a>
            <a href="/terms-of-service" style={{ marginRight: 10 }}>Terms of Service</a>
            <a href="/accessibility">Accessibility</a>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

