import { useState } from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Button,
} from "@mui/material";
import {
  Menu as MenuIcon,
  People as PeopleIcon,
  Restaurant as RestaurantIcon,
  ShoppingCart as OrdersIcon,
  ArrowBack,
} from "@mui/icons-material";
import UsersTab from "./UsersTab";
import RestaurantsTab from "./RestaurantsTab";
import OrdersTab from "./OrdersTab";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const drawerWidth = 240;

const AdminDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("users");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const {t} = useTranslation()
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { id: "users", label: t('users'), icon: <PeopleIcon /> },
    { id: "restaurants", label: t('restaurants'), icon: <RestaurantIcon /> },
    { id: "orders", label: t('orders'), icon: <OrdersIcon /> },
  ];

  const drawer = (
    <div>
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ fontWeight: "bold" }}
        >
          {t("adminDashboard")}
        </Typography>
      </Toolbar>
        <Box sx={{ px: 2, mb: 1 }}>
      <Button
        component={Link}
        to="/home"
        variant="outlined"
        color="primary"
        startIcon={<ArrowBack />}
        fullWidth
        sx={{ mb: 2 }}
      >
        {t("backHome")}
      </Button>
    </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={selectedTab === item.id}
              onClick={() => {
                setSelectedTab(item.id);
                if (isMobile) {
                  setMobileOpen(false);
                }
              }}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: theme.palette.primary.light,
                  color: theme.palette.primary.contrastText,
                  "& .MuiListItemIcon-root": {
                    color: theme.palette.primary.contrastText,
                  },
                },
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const renderContent = () => {
    switch (selectedTab) {
      case "users":
        return <UsersTab />;
      case "restaurants":
        return <RestaurantsTab />;
      case "orders":
        return <OrdersTab />;
      default:
        return <UsersTab />;
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {menuItems.find((item) => item.id === selectedTab)?.label ||
              "Dashboard"}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {renderContent()}
      </Box>
    </Box>
  );
};

export default AdminDashboard;
