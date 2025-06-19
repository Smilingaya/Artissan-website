import React, { useEffect, useState, useMemo } from "react";
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
  Skeleton,
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
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          },
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                p: 1.5,
                borderRadius: 3,
                bgcolor: `${color}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {icon}
            </Box>
            <IconButton
              size="small"
              sx={{
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.1)",
                  backgroundColor: "rgba(0,0,0,0.04)",
                },
              }}
            >
              <MoreVertIcon />
            </IconButton>
          </Box>

          <Typography
            variant="h4"
            sx={{
              mt: 2,
              mb: 1,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {value.toLocaleString()}
            {trend && (
              <Typography
                component="span"
                variant="caption"
                sx={{
                  color:
                    trend >= 0
                      ? theme.palette.success.main
                      : theme.palette.error.main,
                  bgcolor: trend >= 0 ? "success.light" : "error.light",
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  fontSize: "0.75rem",
                }}
              >
                <TrendingUpIcon
                  sx={{
                    fontSize: 16,
                    transform: trend >= 0 ? "none" : "rotate(180deg)",
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
    <Grow
      in={isVisible}
      timeout={600}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <Paper
        sx={{
          p: 2.5,
          cursor: "pointer",
          height: "100%",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          },
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

const Dashboard = () => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [platformStats, setPlatformStats] = useState({
    users: 0,
    posts: 0,
    products: 0,
    orders: 0,
  });
  const [stats, setStats] = useState(null);

  useEffect(() => {
    setIsVisible(true);

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

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setPlatformStats(data);
        setStats("loaded");
      } catch (err) {
        console.error("Failed to fetch platform stats:", err.message);
        setStats("error");
      }
    };

    fetchStats();
  }, []);

  // Memoized calculations to ensure consistency
  const chartCalculations = useMemo(() => {
    const chartData = [
      {
        value: platformStats.posts,
        color: theme.palette.secondary.main,
        label: "Posts",
      },
      {
        value: platformStats.users,
        color: theme.palette.primary.main,
        label: "Users",
      },
      {
        value: platformStats.products,
        color: theme.palette.warning.main,
        label: "Products",
      },
      {
        value: platformStats.orders,
        color: theme.palette.info.main,
        label: "Orders",
      },
    ];

    const total = chartData.reduce((sum, item) => sum + item.value, 0);
    const series = chartData.map((item) => item.value);

    // Calculate percentages for each item
    const dataWithPercentages = chartData.map((item) => ({
      ...item,
      percentage: total > 0 ? Math.round((item.value / total) * 100) : 0,
    }));

    return { chartData: dataWithPercentages, total, series };
  }, [platformStats, theme]);

  const options = useMemo(() => {
    const { total } = chartCalculations;

    return {
      chart: {
        type: "donut",
        animations: { speed: 400 },
        toolbar: { show: false },
      },
      labels: chartCalculations.chartData.map((item) => item.label),
      colors: chartCalculations.chartData.map((item) => item.color),
      legend: { show: false },
      stroke: { width: 0 },
      plotOptions: {
        pie: {
          donut: {
            size: "70%",
            labels: {
              show: true,
              name: { show: false },
              value: { show: false },
              total: {
                show: true,
                showAlways: true,
                label: "Total Items",
                fontSize: "14px",
                fontWeight: 400,
                formatter: () => total.toLocaleString(),
              },
            },
          },
          expandOnClick: true,
        },
      },
      dataLabels: { enabled: false },
      tooltip: {
        y: {
          formatter: (val) => {
            const percent = total > 0 ? Math.round((val / total) * 100) : 0;
            return `${val.toLocaleString()} (${percent}%)`;
          },
        },
      },
      responsive: [
        {
          breakpoint: 600,
          options: { chart: { width: "100%" } },
        },
      ],
    };
  }, [chartCalculations]);

  return (
    <Box
      sx={{
        p: 2,
        mt: 8,
        height: "calc(100vh - 88px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
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

      <Grid
        container
        spacing={2}
        sx={{ flexGrow: 1, height: "calc(100% - 80px)" }}
      >
        {/* Left Column */}
        <Grid
          item
          xs={12}
          md={8}
          sx={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
          {/* Stats Grid */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={
                  <PeopleIcon
                    sx={{ fontSize: 20, color: theme.palette.primary.main }}
                  />
                }
                title="Total Users"
                value={platformStats.users}
                trend={12}
                color={theme.palette.primary.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={
                  <PostAddIcon
                    sx={{ fontSize: 20, color: theme.palette.secondary.main }}
                  />
                }
                title="Total Posts"
                value={platformStats.posts}
                trend={8}
                color={theme.palette.secondary.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={
                  <InventoryIcon
                    sx={{ fontSize: 20, color: theme.palette.warning.main }}
                  />
                }
                title="Total Products"
                value={platformStats.products}
                trend={15}
                color={theme.palette.warning.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={
                  <ShoppingCartIcon
                    sx={{ fontSize: 20, color: theme.palette.info.main }}
                  />
                }
                title="Total Orders"
                value={platformStats.orders}
                trend={-5}
                color={theme.palette.info.main}
              />
            </Grid>
          </Grid>

          {/* Quick Actions */}
          <Paper sx={{ p: 2, flexGrow: 1 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <QuickActionCard
                  icon={
                    <PostAddIcon
                      sx={{ fontSize: 24, color: theme.palette.primary.main }}
                    />
                  }
                  title="View All Posts"
                  description="Browse and moderate all platform posts"
                  delay={200}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <QuickActionCard
                  icon={
                    <InventoryIcon
                      sx={{ fontSize: 24, color: theme.palette.secondary.main }}
                    />
                  }
                  title="Manage Products"
                  description="View and edit all platform products"
                  delay={400}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <QuickActionCard
                  icon={
                    <PeopleIcon
                      sx={{ fontSize: 24, color: theme.palette.warning.main }}
                    />
                  }
                  title="User Management"
                  description="Browse and manage platform users"
                  delay={600}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <QuickActionCard
                  icon={
                    <ShoppingCartIcon
                      sx={{ fontSize: 24, color: theme.palette.info.main }}
                    />
                  }
                  title="Order Management"
                  description="View and manage all orders"
                  delay={800}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Right Column - Chart and Details */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6" align="center" mb={2}>
              Platform Distribution
            </Typography>

            {/* Chart or Loading Skeleton */}
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              {stats === null ? (
                <Skeleton variant="circular" width={220} height={220} />
              ) : stats === "error" ? (
                <Typography color="error">Failed to load chart</Typography>
              ) : (
                <Chart
                  options={options}
                  series={chartCalculations.series}
                  type="donut"
                  width={260}
                />
              )}
            </Box>

            {/* Legend blocks */}
            {stats && stats !== "error" && chartCalculations.total > 0 && (
              <Grid container spacing={1}>
                {chartCalculations.chartData.map((item, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 1,
                        bgcolor: `${item.color}15`,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: item.color,
                          }}
                        />
                        <Typography variant="body2">
                          {item.label} {item.value.toLocaleString()} (
                          {item.percentage}%)
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
    </Box>
  );
};

export default Dashboard;
