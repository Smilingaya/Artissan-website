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
    <Grow in={isVisible} timeout={600} style={{ height: "150px" }}>
      <Card
        sx={{
          height: "100%",
          transition: "all 0.3s ease",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          alignItems: "center",
          p: 2,
        }}
      >
        <Box
          sx={{
            bgcolor: `${color}15`,
            p: 2,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "50px",
            marginLeft: "25px",
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            {value.toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
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
    <Grow in={isVisible} timeout={600} style={{ margin:'0 30px' }}>
      <Paper
        sx={{
          p: 2.5,
          height: "100%",
          cursor: "pointer",
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
    <Box sx={{ p: 3 }}>
      {/* Title */}
      <Typography variant="h4" sx={{ mb: 2 }}>
        Dashboard Overview
      </Typography>

      {/* Stats + Chart */}
      <Grid container spacing={2} sx={{ mb: 3 ,display:"grid" , gridTemplateColumns: "repeat(2,1fr)" }}>
        {/* Stat Cards */}
        <Grid item xs={12} md={8}  >
          <Grid container spacing={2 } width={"40vw"} sx={{ display:"grid" , gridTemplateColumns: "repeat(2,1fr)" }}>
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
        </Grid>

        {/* Chart */}
        <Grid item xs={12} md={4} sx={{ width: "35vw", height: "50vh" }}>
          <Paper sx={{ p: 1,width: "100%", height: "100%" }}>
            <Typography variant="h6" align="center" mb={2}>
              Platform Distribution
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              {stats === null ? (
                <Skeleton variant="circular" width={220} height={220} />
              ) : stats === "error" ? (
                <Typography color="error">Failed to load chart</Typography>
              ) : (
                <Chart
                  options={chartOptions}
                  series={chartData.series}
                  type="donut"
                  width={260}
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
                        p: 0.5,
                        borderRadius: 1,
                        bgcolor: `${item.color}15`,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: item.color,
                          }}
                        />
                        <Typography variant="body2">
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

      {/* Quick Actions */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <QuickActionCard
              icon={<PostAddIcon sx={{ fontSize: 24, color: theme.palette.primary.main }} />}
              title="View All Posts"
              description="Browse and moderate all posts"
              delay={100}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <QuickActionCard
              icon={<InventoryIcon sx={{ fontSize: 24, color: theme.palette.secondary.main }} />}
              title="Manage Products"
              description="Edit and track platform products"
              delay={200}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <QuickActionCard
              icon={<PeopleIcon sx={{ fontSize: 24, color: theme.palette.warning.main }} />}
              title="User Management"
              description="Manage all registered users"
              delay={300}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <QuickActionCard
              icon={<ShoppingCartIcon sx={{ fontSize: 24, color: theme.palette.info.main }} />}
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
