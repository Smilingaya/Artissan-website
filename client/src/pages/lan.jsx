import React, { useEffect, useState, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Box, Container, Typography, Button, Grid, Card, CardContent, 
  Avatar, Paper, Divider, ThemeProvider, createTheme, 
  TextField, InputAdornment, IconButton, Chip, AppBar, Toolbar,
  useMediaQuery, Drawer, List, ListItem, ListItemIcon, 
ListItemText, Link, Collapse
} from '@mui/material';

// Material UI Icons
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckIcon from '@mui/icons-material/Check';
import EmailIcon from '@mui/icons-material/Email';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import PaletteIcon from '@mui/icons-material/Palette';
import HandshakeIcon from '@mui/icons-material/Handshake';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import GroupIcon from '@mui/icons-material/Group';
import PublicIcon from '@mui/icons-material/Public';
import SecurityIcon from '@mui/icons-material/Security';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BrushIcon from '@mui/icons-material/Brush';
import StarIcon from '@mui/icons-material/Star';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import PrecisionManufacturing from '@mui/icons-material/PrecisionManufacturing';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';


// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#6a1b9a',
      light: '#9c27b0',
      dark: '#4a148c',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff3d00',
      light: '#ff6333',
      dark: '#b22a00',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.5px',
    },
    h2: {
      fontWeight: 600,
      letterSpacing: '-0.5px',
    },
    h3: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.5px',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30,
          padding: '10px 24px',
        },
        contained: {
          boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)',
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }
      }
    }
  }
});

// Intersection Observer Hook
const useElementOnScreen = (options) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      setIsVisible(entry.isIntersecting);
    }, options);
    
    const currentRef = containerRef.current;
    if (currentRef) observer.observe(currentRef);
    
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [containerRef, options]);

  return [containerRef, isVisible];
};

// Animated Section Component
const AnimatedSection = ({ children, animation, threshold = 0.1, delay = 0, rootMargin = "0px" }) => {
  const [ref, isVisible] = useElementOnScreen({ threshold, rootMargin });
  
  const animations = {
    fadeIn: {
      opacity: isVisible ? 1 : 0,
      transition: `opacity 0.8s ease-in-out ${delay}s`,
    },
    fadeInUp: {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
      transition: `opacity 0.8s ease-out ${delay}s, transform 0.8s ease-out ${delay}s`,
    },
    fadeInDown: {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(-50px)',
      transition: `opacity 0.8s ease-out ${delay}s, transform 0.8s ease-out ${delay}s`,
    },
    fadeInLeft: {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateX(0)' : 'translateX(50px)',
      transition: `opacity 0.8s ease-out ${delay}s, transform 0.8s ease-out ${delay}s`,
    },
    fadeInRight: {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateX(0)' : 'translateX(-50px)',
      transition: `opacity 0.8s ease-out ${delay}s, transform 0.8s ease-out ${delay}s`,
    },
    zoomIn: {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'scale(1)' : 'scale(0.8)',
      transition: `opacity 0.8s ease-out ${delay}s, transform 0.8s ease-out ${delay}s`,
    },
    slideInUp: {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(100px)',
      transition: `opacity 0.8s ease-out ${delay}s, transform 0.8s ease-out ${delay}s`,
    }
  };
  
  return (
    <div ref={ref} style={animations[animation] || animations.fadeIn}>
      {children}
    </div>
  );
};

// Stats Counter Animation
const CounterAnimation = ({ end, duration = 2000, start = 0, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(start);
  const [ref, isVisible] = useElementOnScreen({ threshold: 0.1 });
  const countRef = useRef(start);
  const previouslyVisible = useRef(false);

  useEffect(() => {
    if (isVisible && !previouslyVisible.current) {
      previouslyVisible.current = true;
      const startTime = Date.now();
      const interval = setInterval(() => {
        const timePassed = Date.now() - startTime;
        const progress = Math.min(timePassed / duration, 1);
        const currentCount = Math.floor(progress * (end - start) + start);
        
        if (progress === 1) {
          clearInterval(interval);
        }
        
        if (countRef.current !== currentCount) {
          countRef.current = currentCount;
          setCount(currentCount);
        }
      }, 16);
      
      return () => clearInterval(interval);
    }
  }, [isVisible, end, duration, start]);

  return (
    <div ref={ref}>
      <Typography variant="h3" component="span" fontWeight="bold">
        {prefix}{count}{suffix}
      </Typography>
    </div>
  );
};

// Testimonial Card Component
const TestimonialCard = ({ quote, name, title, avatar, rating }) => {
  return (
    <Card elevation={0} sx={{ 
      height: '100%',
      border: '1px solid rgba(0,0,0,0.08)',
      transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
      '&:hover': {
        transform: 'translateY(-10px)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }
    }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ display: 'flex', mb: 2 }}>
          {[...Array(rating)].map((_, i) => (
            <StarIcon key={i} fontSize="small" sx={{ color: '#FFD700' }} />
          ))}
        </Box>
        
        <Box sx={{ position: 'relative', mb: 2 }}>
          <FormatQuoteIcon 
            sx={{ 
              fontSize: 40, 
              color: theme.palette.primary.light,
              opacity: 0.2,
              position: 'absolute',
              left: -5,
              top: -5,
              transform: 'rotate(180deg)'
            }} 
          />
          <Typography variant="body1" sx={{ fontStyle: 'italic', position: 'relative', pl: 3 }}>
            {quote}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
          <Avatar src={avatar} alt={name} sx={{ width: 50, height: 50, mr: 2 }} />
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">{name}</Typography>
            <Typography variant="body2" color="text.secondary">{title}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }) => {
  return (
    <Card 
      elevation={0}
      sx={{ 
        height: '100%',
        border: '1px solid rgba(0,0,0,0.08)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
        }
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: 4 }}>
        <Box
          sx={{
            backgroundColor: 'rgba(106, 27, 154, 0.1)',
            borderRadius: '50%',
            width: 80,
            height: 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2
          }}
        >
          {icon}
        </Box>
        <Typography variant="h5" component="h3" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

// How It Works Step Component
const StepCard = ({ number, title, description, delay }) => {
  return (
    <AnimatedSection animation="fadeInUp" delay={delay}>
      <Box sx={{ position: 'relative', p: 4 }}>
        <Box 
          sx={{ 
            position: 'absolute',
            top: 0,
            left: { xs: '50%', md: 0 },
            transform: { xs: 'translateX(-50%)', md: 'none' },
            width: 50,
            height: 50,
            borderRadius: '50%',
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: 20,
            zIndex: 10
          }}
        >
          {number}
        </Box>
        
        <Paper 
          elevation={0}
          sx={{ 
            py: 4, 
            px: 3, 
            ml: { xs: 0, md: 3 }, 
            mt: { xs: 3, md: 0 },
            borderRadius: 2,
            border: '1px solid rgba(0,0,0,0.08)',
            position: 'relative'
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {description}
          </Typography>
        </Paper>
      </Box>
    </AnimatedSection>
  );
};

// Main Landing Page Component
const LandingPage = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Sample testimonial data
  const testimonials = [
    {
      quote: "This platform gave me the visibility I never had before. My small handcrafted jewelry business is growing exponentially since I joined!",
      name: "Fatima Akram",
      title: "Jewelry Designer",
      avatar: "/api/placeholder/60/60",
      rating: 5
    },
    {
      quote: "It's more than a selling space—it's a community. I found people who inspire me every day and customers who truly appreciate craftsmanship.",
      name: "Lina Gomez",
      title: "Painter & Illustrator",
      avatar: "/api/placeholder/60/60",
      rating: 5
    },
    {
      quote: "The tools provided helped me turn my hobby into a sustainable business. The platform is intuitive and the support team is always helpful.",
      name: "Marco Chen",
      title: "Wood Craftsman",
      avatar: "/api/placeholder/60/60",
      rating: 4
    },
    {
      quote: "I've tried many platforms, but this is the one where I feel my work is truly valued. The community feedback has helped me grow as an artist.",
      name: "Sarah Johnson",
      title: "Textile Artist",
      avatar: "/api/placeholder/60/60",
      rating: 5
    }
  ];

  // Handle mobile drawer toggle
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

  // Navigation menu items
  const menuItems = [
    { text: 'Home', section: 'hero' },
    { text: 'About', section: 'about' },
    { text: 'Features', section: 'features' },
    { text: 'How It Works', section: 'how-it-works' },
    { text: 'Testimonials', section: 'testimonials' }
  ];

  // Mobile drawer content
  const drawer = (
    <Box sx={{ textAlign: 'center' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
          <PaletteIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
          Artisan
        </Typography>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text}
            onClick={() => scrollToSection(item.section)}
          >
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <ListItem>
          <Button 
            variant="contained" 
            color="primary" 
            fullWidth
            component={RouterLink}
            to="/login"
          >
            Sign In
          </Button>
        </ListItem>
        <ListItem>
          <Button 
            variant="outlined" 
            color="primary" 
            fullWidth
            component={RouterLink}
            to="/register"
          >
            Get Started
          </Button>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* Navigation */}
        <AppBar 
  position="fixed" 
  color={scrolled ? 'primary' : 'transparent'} 
  elevation={scrolled ? 4 : 0}
  sx={{ 
    transition: 'all 0.3s ease',
    bgcolor: scrolled ? 'primary.main' : 'transparent',
    boxShadow: scrolled ? 4 : 'none'
  }}
>
  <Container maxWidth="lg">
    <Toolbar>
      <Typography variant="h6" component="div" sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        alignItems: 'center',
        color: scrolled ? 'white' : 'primary.main' 
      }}>
        <PaletteIcon sx={{ mr: 1 }} />
        Artisan
      </Typography>

      {isSmallScreen ? (
        <IconButton 
          color="inherit" 
          aria-label="open drawer" 
          edge="start" 
          onClick={handleDrawerToggle}
          sx={{ color: scrolled ? 'white' : 'primary.main' }}
        >
          <MenuIcon />
        </IconButton>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {menuItems.map((item) => (
            <Button 
              key={item.text}
              color="inherit"
              sx={{ mx: 1, color: scrolled ? 'white' : 'text.primary' }}
              onClick={() => scrollToSection(item.section)}
            >
              {item.text}
            </Button>
          ))}
          <Button 
            variant="text" 
            sx={{ 
              ml: 1, 
              color: scrolled ? 'white' : 'primary.main'
            }}
            component={RouterLink}
            to="/login"
          >
            Sign In
          </Button>
          <Button 
            variant="contained" 
            color="secondary" 
            sx={{ ml: 2 }}
            component={RouterLink}
            to="/register"
          >
            Get Started
          </Button>
        </Box>
      )}
    </Toolbar>
  </Container>
</AppBar>

{/* Mobile Drawer */}
{isSmallScreen && (
  <Drawer
    variant="temporary"
    anchor="right"
    open={mobileOpen}
    onClose={handleDrawerToggle}
    ModalProps={{ keepMounted: true }}
    sx={{
      '& .MuiDrawer-paper': { width: '80%', boxSizing: 'border-box' },
    }}
  >
    {drawer}
  </Drawer>
)}


        {/* Hero Section */}
        <Box
          id="hero"
          sx={{
            position: 'relative',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            background: `linear-gradient(135deg, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.8) 100%), url(/api/placeholder/1920/1080)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            pt: 8
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <AnimatedSection animation="fadeInRight">
                  <Typography 
                    variant="overline" 
                    component="div" 
                    sx={{ 
                      color: 'primary.main', 
                      fontWeight: 'bold',
                      letterSpacing: 2,
                      mb: 2 
                    }}
                  >
                    WELCOME TO ARTISAN
                  </Typography>
                  <Typography variant="h1" component="h1" gutterBottom>
                    Discover <Box component="span" sx={{ color: 'primary.main' }}>Handmade</Box> Artistry
                  </Typography>
                  <Typography variant="h5" component="p" color="text.secondary" sx={{ mb: 4 }}>
                    Join a vibrant community of artisans and craft lovers. Showcase your work, connect with others, and sell your unique creations.
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      size="large"
                      endIcon={<ArrowForwardIcon />}
                      component={RouterLink}
                      to="/register"
                    >
                      Get Started
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      size="large"
                      component={RouterLink}
                      to="/explore"
                    >
                      Explore Crafts
                    </Button>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
                    <Box sx={{ display: 'flex', mr: 3 }}>
                      <Avatar sx={{ width: 24, height: 24, border: '2px solid white' }}>A</Avatar>
                      <Avatar sx={{ width: 24, height: 24, ml: -1, border: '2px solid white' }}>B</Avatar>
                      <Avatar sx={{ width: 24, height: 24, ml: -1, border: '2px solid white' }}>C</Avatar>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Joined by <b>10,000+</b> artisans worldwide
                    </Typography>
                  </Box>
                </AnimatedSection>
              </Grid>
              <Grid item xs={12} md={6}>
                <AnimatedSection animation="fadeInLeft" delay={0.2}>
                  <Box
                    sx={{
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        width: '80%',
                        height: '80%',
                        borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                        backgroundColor: 'primary.light',
                        opacity: 0.1,
                        top: -20,
                        right: -20,
                        zIndex: -1,
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        width: '60%',
                        height: '60%',
                        borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                        backgroundColor: 'secondary.light',
                        opacity: 0.1,
                        bottom: -20,
                        left: -20,
                        zIndex: -1,
                      }
                    }}
                  >
                    <img 
                      src="/api/placeholder/600/500" 
                      alt="Handmade crafts collection" 
                      style={{ 
                        width: '100%', 
                        borderRadius: '20px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                      }} 
                    />
                  </Box>
                </AnimatedSection>
              </Grid>
            </Grid>
            
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mt: 8 
              }}
            >
              <IconButton 
                onClick={() => scrollToSection('about')}
                sx={{
                  backgroundColor: 'white',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'white'
                  },
                  animation: 'bounce 2s infinite'
                }}
              >
                <KeyboardArrowDownIcon />
              </IconButton>
            </Box>
          </Container>
        </Box>

        {/* About Section */}
        <Box 
          id="about" 
          sx={{ 
            py: { xs: 8, md: 12 },
            bgcolor: 'background.paper' 
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6}>
                <AnimatedSection animation="fadeInRight">
                  <Box sx={{ position: 'relative' }}>
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -15,
                        left: -15,
                        width: '100%',
                        height: '100%',
                        borderRadius: 4,
                        backgroundColor: 'primary.main',
                        opacity: 0.1,
                        zIndex: 0
                      }}
                    />
                    <Box
                      component="img"
                      src="/api/placeholder/600/400"
                      alt="About Artisan Platform"
                      sx={{
                        width: '100%',
                        borderRadius: 4,
                        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                        position: 'relative',
                        zIndex: 1
                      }}
                    />
                  </Box>
                </AnimatedSection>
              </Grid>
              <Grid item xs={12} md={6}>
                <AnimatedSection animation="fadeInLeft">
                  <Typography 
                    variant="overline" 
                    sx={{ 
                      color: 'primary.main', 
                      fontWeight: 'bold',
                      letterSpacing: 2,
                      mb: 1 
                    }}
                  >
                    ABOUT US
                  </Typography>
                  <Typography variant="h2" component="h2" gutterBottom>
                    A Digital Home for Creators
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    Artisan is a digital home for creators, crafters, and handmade goods enthusiasts. Whether you're a professional artisan or a passionate hobbyist, our platform gives you the tools and exposure to thrive.
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    We believe in the power of human creativity and the value of handmade items in a world of mass production. Our mission is to connect talented creators with people who appreciate the time, skill, and heart that goes into every handcrafted piece.
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CheckIcon sx={{ color: 'primary.main', mr: 1 }} />
                        <Typography variant="body1" fontWeight="medium">
                          Global Community
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CheckIcon sx={{ color: 'primary.main', mr: 1 }} />
                        <Typography variant="body1" fontWeight="medium">
                          Quality Assurance
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CheckIcon sx={{ color: 'primary.main', mr: 1 }} />
                        <Typography variant="body1" fontWeight="medium">
                          Direct Sales
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CheckIcon sx={{ color: 'primary.main', mr: 1 }} />
                        <Typography variant="body1" fontWeight="medium">
                          Creator Support
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </AnimatedSection>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Stats Section */}
        <Box sx={{ 
          py: { xs: 6, md: 8 },
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white'
        }}>
          <Container maxWidth="lg">
            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={6} md={3} sx={{ textAlign: 'center' }}>
                <AnimatedSection animation="fadeIn">
                  <CounterAnimation end={10000} suffix="+" />
                  <Typography variant="h6">Artisans</Typography>
                </AnimatedSection>
              </Grid>
              <Grid item xs={6} md={3} sx={{ textAlign: 'center' }}>
                <AnimatedSection animation="fadeIn" delay={0.2}>
                  <CounterAnimation end={50000} suffix="+" />
                  <Typography variant="subtitle1">Active Users</Typography>
                </AnimatedSection>
              </Grid>
              <Grid item xs={6} md={3} sx={{ textAlign: 'center' }}>
                <AnimatedSection animation="fadeIn" delay={0.4}>
                  <CounterAnimation end={1200} suffix="+" />
                  <Typography variant="subtitle1">Products</Typography>
                </AnimatedSection>
              </Grid>
              <Grid item xs={6} md={3} sx={{ textAlign: 'center' }}>
                <AnimatedSection animation="fadeIn" delay={0.6}>
                  <CounterAnimation end={300} suffix="+" />
                  <Typography variant="subtitle1">Artisans</Typography>
                </AnimatedSection>
              </Grid>
              <Grid item xs={6} md={3} sx={{ textAlign: 'center' }}>
                <AnimatedSection animation="fadeIn" delay={0.8}>
                  <CounterAnimation end={100} suffix="+" />
                  <Typography variant="subtitle1">Cities Served</Typography>
                </AnimatedSection>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Features Section */}
        <Box py={10} bgcolor="#f9f9f9">
          <Container>
            <Typography variant="h4" align="center" gutterBottom>
              Why Choose Us?
            </Typography>
          <Typography variant="subtitle1" align="center" paragraph>
            Our platform offers everything artisans and customers need to connect and grow.
          </Typography>
          <Grid container spacing={4} mt={4}>
            <Grid item xs={12} md={4}>
              <AnimatedSection animation="fadeInUp" delay={0.2}>
                <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                  <SupportAgentIcon sx={{ fontSize: 50, color: '#1976d2' }} />
                  <Typography variant="h6" gutterBottom>Dedicated Support</Typography>
                  <Typography variant="body2">
                    We’re always here to help our artisans and customers.
                  </Typography>
                </Paper>
              </AnimatedSection>
            </Grid>
            <Grid item xs={12} md={4}>
              <AnimatedSection animation="fadeInUp" delay={0.4}>
                <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                  <PrecisionManufacturing sx={{ fontSize: 50, color: '#1976d2' }} />
                  <Typography variant="h6" gutterBottom>Authentic Products</Typography>
                  <Typography variant="body2">
                    Handcrafted goods made with passion and skill.
                  </Typography>
                </Paper>
              </AnimatedSection>
            </Grid>
            <Grid item xs={12} md={4}>
              <AnimatedSection animation="fadeInUp" delay={0.6}>
                <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                  <EmojiPeopleIcon sx={{ fontSize: 50, color: '#1976d2' }} />
                  <Typography variant="h6" gutterBottom>Community Driven</Typography>
                  <Typography variant="body2">
                    Empowering artisans and uplifting local economies.
                  </Typography>
                </Paper>
              </AnimatedSection>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
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
    </Box>
  </ThemeProvider>
  );
};


export default LandingPage;