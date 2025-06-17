import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  IconButton,
  useTheme,
  Card,
  CardContent,
  Fade,
  Grow,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  PostAdd as PostAddIcon,
  ShoppingCart as ShoppingCartIcon,
  Inventory as InventoryIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';

// Stat Card Component
const StatCard = ({ icon, title, value, trend, color }) => {
  const [isVisible, setIsVisible] = useState(false);
  const theme = useTheme();
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <Grow in={isVisible} timeout={600}>
      <Card sx={{
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Box 
              sx={{ 
                p: 1.5, 
                borderRadius: 3, 
                bgcolor: `${color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {icon}
            </Box>
            <IconButton 
              size="small"
              sx={{
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                  backgroundColor: 'rgba(0,0,0,0.04)',
                }
              }}
            >
              <MoreVertIcon />
            </IconButton>
          </Box>
          
          <Typography variant="h4" sx={{ 
            mt: 2, 
            mb: 1, 
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            {value.toLocaleString()}
            {trend && (
              <Typography 
                component="span" 
                variant="caption" 
                sx={{ 
                  color: trend >= 0 ? theme.palette.success.main : theme.palette.error.main,
                  bgcolor: trend >= 0 ? 'success.light' : 'error.light',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  fontSize: '0.75rem'
                }}
              >
                <TrendingUpIcon 
                  sx={{ 
                    fontSize: 16,
                    transform: trend >= 0 ? 'none' : 'rotate(180deg)'
                  }} 
                />
                {Math.abs(trend)}%
              </Typography>
            )}
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </CardContent>
      </Card>
    </Grow>
  );
};

// Quick Action Card Component
const QuickActionCard = ({ icon, title, description, delay }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <Grow in={isVisible} timeout={600} style={{ transitionDelay: `${delay}ms` }}>
      <Paper 
        sx={{ 
          p: 2.5, 
          cursor: 'pointer',
          height: '100%',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }
        }}
      >
        {icon}
        <Typography variant="body2" sx={{ mt: 1, fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {description}
        </Typography>
      </Paper>
    </Grow>
  );
};

// Circular Progress Component
const CircularProgress = ({ data }) => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const totalValue = data.reduce((acc, item) => acc + item.value, 0);
  let currentAngle = 0;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <Grow in={isVisible} timeout={600}>
      <Box sx={{ 
        position: 'relative', 
        width: 220, 
        height: 220, 
        margin: '0 auto',
        transition: 'all 0.3s ease',
      }}>
        <svg width="220" height="220" viewBox="0 0 220 220">
          {data.map((segment, index) => {
            const percentage = (segment.value / totalValue) * 100;
            const angle = (percentage * 360) / 100;
            const x1 = Math.cos((currentAngle * Math.PI) / 180) * 88 + 110;
            const y1 = Math.sin((currentAngle * Math.PI) / 180) * 88 + 110;
            const x2 = Math.cos(((currentAngle + angle) * Math.PI) / 180) * 88 + 110;
            const y2 = Math.sin(((currentAngle + angle) * Math.PI) / 180) * 88 + 110;
            const largeArcFlag = angle > 180 ? 1 : 0;
            const pathData = `M 110 110 L ${x1} ${y1} A 88 88 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
            const currentPath = currentAngle;
            currentAngle += angle;

            return (
              <g key={index}>
                <path
                  d={pathData}
                  fill={segment.color}
                  stroke="white"
                  strokeWidth="2"
                  style={{
                    transform: `rotate(${currentPath}deg)`,
                    transformOrigin: 'center',
                    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />
                <text
                  x={Math.cos((currentPath + angle/2) * Math.PI / 180) * 65 + 110}
                  y={Math.sin((currentPath + angle/2) * Math.PI / 180) * 65 + 110}
                  fill="white"
                  fontSize="12"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {Math.round(percentage)}%
                </text>
              </g>
            );
          })}
          <circle cx="110" cy="110" r="58" fill="white" />
          <text
            x="110"
            y="102"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="20"
            fontWeight="600"
            fill={theme.palette.text.primary}
          >
            {totalValue.toLocaleString()}
          </text>
          <text
            x="110"
            y="122"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="12"
            fill={theme.palette.text.secondary}
          >
            Total Items
          </text>
        </svg>
      </Box>
    </Grow>
  );
};

const Dashboard = () => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const platformStats = {
    users: 1243,
    posts: 3487,
    products: 872,
    orders: 546
  };

  // Data for circular diagram
  const chartData = [
    { value: platformStats.posts, color: theme.palette.secondary.main, label: 'Posts' },
    { value: platformStats.users, color: theme.palette.primary.main, label: 'Users' },
    { value: platformStats.products, color: theme.palette.warning.main, label: 'Products' },
    { value: platformStats.orders, color: theme.palette.info.main, label: 'Orders' },
  ];

  return (
    <Box sx={{ 
      p: 2, 
      mt: 8,
      height: 'calc(100vh - 88px)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <Fade in={isVisible} timeout={600}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4" sx={{ mb: 0.5 }}>
            Dashboard Overview
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's what's happening with your platform today.
          </Typography>
        </Box>
      </Fade>

      <Grid container spacing={2} sx={{ flexGrow: 1, height: 'calc(100% - 80px)' }}>
        {/* Left Column */}
        <Grid item xs={12} md={8} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Stats Grid */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<PeopleIcon sx={{ fontSize: 20, color: theme.palette.primary.main }} />}
                title="Total Users"
                value={platformStats.users}
                trend={12}
                color={theme.palette.primary.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<PostAddIcon sx={{ fontSize: 20, color: theme.palette.secondary.main }} />}
                title="Total Posts"
                value={platformStats.posts}
                trend={8}
                color={theme.palette.secondary.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<InventoryIcon sx={{ fontSize: 20, color: theme.palette.warning.main }} />}
                title="Total Products"
                value={platformStats.products}
                trend={15}
                color={theme.palette.warning.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<ShoppingCartIcon sx={{ fontSize: 20, color: theme.palette.info.main }} />}
                title="Total Orders"
                value={platformStats.orders}
                trend={-5}
                color={theme.palette.info.main}
              />
            </Grid>
          </Grid>

          {/* Quick Actions */}
          <Paper sx={{ p: 2, flexGrow: 1 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Quick Actions</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <QuickActionCard 
                  icon={<PostAddIcon sx={{ fontSize: 24, color: theme.palette.primary.main }} />}
                  title="View All Posts"
                  description="Browse and moderate all platform posts"
                  delay={200}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <QuickActionCard 
                  icon={<InventoryIcon sx={{ fontSize: 24, color: theme.palette.secondary.main }} />}
                  title="Manage Products"
                  description="View and edit all platform products"
                  delay={400}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <QuickActionCard 
                  icon={<PeopleIcon sx={{ fontSize: 24, color: theme.palette.warning.main }} />}
                  title="User Management"
                  description="Browse and manage platform users"
                  delay={600}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <QuickActionCard 
                  icon={<ShoppingCartIcon sx={{ fontSize: 24, color: theme.palette.info.main }} />}
                  title="Order Management"
                  description="View and manage all orders"
                  delay={800}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Right Column - Chart and Details */}
        <Grid item xs={12} md={4} sx={{ height: '100%' }}>
          <Paper sx={{ 
            p: 2, 
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
              Platform Distribution
            </Typography>
            <Box sx={{ flexGrow: 0 }}>
              <CircularProgress data={chartData} />
            </Box>
            <Box sx={{ mt: 2, flexGrow: 1, overflow: 'hidden' }}>
              <Grid container spacing={1}>
                {chartData.map((item, index) => (
                  <Grid item xs={12} key={index}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      p: 1,
                      borderRadius: 1,
                      bgcolor: `${item.color}15`,
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box 
                          sx={{ 
                            width: 8, 
                            height: 8, 
                            borderRadius: '50%', 
                            bgcolor: item.color 
                          }} 
                        />
                        <Typography variant="body2">{item.label}</Typography>
                      </Box>
                      <Typography variant="caption">
                        {item.value.toLocaleString()} ({Math.round((item.value / chartData.reduce((acc, curr) => acc + curr.value, 0)) * 100)}%)
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;