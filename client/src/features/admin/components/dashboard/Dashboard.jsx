import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  IconButton,
  CardContent,
  useTheme,
  Grow,
  Skeleton,
  useMediaQuery,
} from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  PostAdd as PostAddIcon,
  ShoppingCart as ShoppingCartIcon,
  Inventory as InventoryIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import Chart from "react-apexcharts";

// Stat Card Component
const StatCard = ({ icon, title, value, trend, color }) => {
  const [isVisible, setIsVisible] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <Grow in={isVisible} timeout={600}>
      <Card
        sx={{
          height: "100%",
          minHeight: "120px",
          transition: "all 0.3s ease",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          p: 2,
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          },
        }}
      >
        <Box
          sx={{
            bgcolor: `${color}15`,
            p: 1.5,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: { xs: 1, sm: 0 },
            mr: { sm: 2 },
            minWidth: "50px",
          }}
        >
          {icon}
        </Box>
        <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
          <Typography variant="h4" sx={{ fontWeight: 600, fontSize: { xs: "1.5rem", sm: "2rem" } }}>
            {value.toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
            {title}
          </Typography>
        </Box>
      </Card>
    </Grow>
  );
};

// Quick Action Card Component
const QuickActionCard = ({ icon, title, description, delay }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Grow in={isVisible} timeout={600}>
      <Paper
        sx={{
          p: 2,
          height: "100%",
          minHeight: "120px",
          cursor: "pointer",
          transition: "all 0.3s ease",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          },
        }}
      >
        <Box sx={{ mb: 1 }}>
          {icon}
        </Box>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
          {description}
        </Typography>
      </Paper>
    </Grow>
  );
};

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [platformStats, setPlatformStats] = useState({
    users: 0,
    posts: 0,
    products: 0,
    orders: 0,
  });
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/api/admin/stat", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Error fetching stats");

        const data = await res.json();
        setPlatformStats(data);
        setStats("loaded");
      } catch (err) {
        console.error(err);
        setStats("error");
      }
    };

    fetchStats();
  }, []);

  const chartData = useMemo(() => {
    const items = [
      { label: "Posts", value: platformStats.posts, color: theme.palette.secondary.main },
      { label: "Users", value: platformStats.users, color: theme.palette.primary.main },
      { label: "Products", value: platformStats.products, color: theme.palette.warning.main },
      { label: "Orders", value: platformStats.orders, color: theme.palette.info.main },
    ];

    const total = items.reduce((acc, cur) => acc + cur.value, 0);
    return {
      total,
      chartData: items.map((i) => ({
        ...i,
        percentage: total ? Math.round((i.value / total) * 100) : 0,
      })),
      series: items.map((i) => i.value),
      labels: items.map((i) => i.label),
      colors: items.map((i) => i.color),
    };
  }, [platformStats, theme]);

  const chartOptions = {
    chart: {
      type: "donut",
      animations: { speed: 400 },
      toolbar: { show: false },
    },
    labels: chartData.labels,
    colors: chartData.colors,
    legend: { show: false },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            total: {
              showAlways: true,
              label: "Total",
              formatter: () => chartData.total.toLocaleString(),
            },
          },
        },
      },
    },
    stroke: { width: 0 },
    dataLabels: { enabled: false },
    tooltip: {
      y: {
        formatter: (val) =>
          `${val.toLocaleString()} (${chartData.total > 0 ? Math.round((val / chartData.total) * 100) : 0}%)`,
      },
    },
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      {/* Title */}
      <Typography variant="h4" sx={{ mb: 2, fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" } }}>
        Dashboard Overview
      </Typography>

      {/* Stats + Chart */}
      <Grid container spacing={2} sx={{ mb: 3, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
        {/* Stat Cards 2x2 Grid */}
        <Grid item xs={12} md={7}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <StatCard
                icon={<PeopleIcon sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, color: theme.palette.primary.main }} />}
                title="Total Users"
                value={platformStats.users}
                trend={12}
                color={theme.palette.primary.main}
              />
            </Grid>
            <Grid item xs={6}>
              <StatCard
                icon={<PostAddIcon sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, color: theme.palette.secondary.main }} />}
                title="Total Posts"
                value={platformStats.posts}
                trend={8}
                color={theme.palette.secondary.main}
              />
            </Grid>
            <Grid item xs={6}>
              <StatCard
                icon={<InventoryIcon sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, color: theme.palette.warning.main }} />}
                title="Total Products"
                value={platformStats.products}
                trend={15}
                color={theme.palette.warning.main}
              />
            </Grid>
            <Grid item xs={6}>
              <StatCard
                icon={<ShoppingCartIcon sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, color: theme.palette.info.main }} />}
                title="Total Orders"
                value={platformStats.orders}
                trend={-5}
                color={theme.palette.info.main}
              />
            </Grid>
          </Grid>
        </Grid>
        {/* Chart beside Stat Cards on md+, below on xs/sm */}
        <Grid item xs={12} md={5} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Paper sx={{ p: { xs: 1, sm: 2 }, width: '100%', maxWidth: '32rem', minHeight: '18rem', mx: 'auto' }}>
            <Typography variant="h6" align="center" sx={{ mb: 2, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              Platform Distribution
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              {stats === null ? (
                <Skeleton variant="circular" width="60vw" height="60vw" sx={{ maxWidth: '14rem', maxHeight: '14rem' }} />
              ) : stats === "error" ? (
                <Typography color="error">Failed to load chart</Typography>
              ) : (
                <Chart
                  options={chartOptions}
                  series={chartData.series}
                  type="donut"
                  width="100%"
                />
              )}
            </Box>
            {/* Chart Legend */}
            {stats && stats !== "error" && chartData.total > 0 && (
              <Grid container spacing={1}>
                {chartData.chartData.map((item, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 1,
                        bgcolor: `${item.color}15`,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                        <Box
                          sx={{
                            width: '0.5rem',
                            height: '0.5rem',
                            borderRadius: '50%',
                            bgcolor: item.color,
                            flexShrink: 0,
                          }}
                        />
                        <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          {item.label} {item.value.toLocaleString()} ({item.percentage}%)
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>
      {/* Quick Actions at the bottom */}
      <Paper sx={{ p: { xs: 2, sm: 3 }, mt: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontSize: { xs: '1.125rem', sm: '1.25rem' } }}>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <QuickActionCard
              icon={<PostAddIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' }, color: theme.palette.primary.main }} />}
              title="View All Posts"
              description="Browse and moderate all posts"
              delay={100}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <QuickActionCard
              icon={<InventoryIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' }, color: theme.palette.secondary.main }} />}
              title="Manage Products"
              description="Edit and track platform products"
              delay={200}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <QuickActionCard
              icon={<PeopleIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' }, color: theme.palette.warning.main }} />}
              title="User Management"
              description="Manage all registered users"
              delay={300}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <QuickActionCard
              icon={<ShoppingCartIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' }, color: theme.palette.info.main }} />}
              title="Order Management"
              description="View and process orders"
              delay={400}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Dashboard;
