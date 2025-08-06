import React, { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  IconButton,
  Badge,
  Button,
  Box,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Modal,
  Menu,
  type SelectChangeEvent,
} from "@mui/material";
import {
  Search,
  ShoppingCart,
  Language,
  Home,
  Restaurant,
} from "@mui/icons-material";
import { ListOrdered, LogOutIcon, MenuIcon, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCartByUserId, getUserByJwt, logoutUser } from "../server/server";
import type { i18n } from "i18next";

type User = {
  id: number;
  username: string;
  role: string;
};

interface Language {
  code:string;
  name:string
}
interface I18n{
  i18n:i18n
  languages:Language[]
}
interface Image {
  id: number;
  fileName: string;
  url: string;
}

interface Extra {
  id: number;
  name: string;
  price: string;
}

interface CartItem {
  id: number;
  foodName: string;
  pricePerUnit: number;
  quantity: number;
  image?: Image;
  totalPrice: number;
  extras: Extra[];
}

interface CartProps {
  id: number;
  items: CartItem[];
  total: number;
}

const Navbar:React.FC<I18n> = ({i18n, languages}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLogoutModelOpen, setIsLogoutModelOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartProps>();
  const [user, setUser] = useState<User | null>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const token = window.localStorage.getItem("token")
  const getUser = async () => {
    const data = await getUserByJwt();
    setUser(data);
  };
  

  const handleLanguageChange = (event:SelectChangeEvent<string>) =>{
    const selectedLanguage = event.target.value;
    i18n.changeLanguage(selectedLanguage)
  }

  useEffect(() => {
    getUser();
  }, [token]);

  const getUserCart = async () => {
    if (user) {
      const data = await getCartByUserId(user.id);
      setCartItems(data);
    }
  };
  useEffect(() => {
    getUserCart();
  }, []);

  useMemo(() =>{getUserCart()},[])

  const getInitials = (fullName?: string) => {
    if (!fullName) return "";
    const names = fullName.trim().split(" ");
    return names.length === 1
      ? names[0][0].toUpperCase()
      : names[0][0].toUpperCase() + names[names.length - 1][0].toUpperCase();
  };

  const handleClickAvatar = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleNavigateAndClose = (path: string) => {
    navigate(path);
    handleCloseMenu();
  };

  const handleLogoutModelOpen = () => {
    setIsLogoutModelOpen(true);
    handleCloseMenu();
  };

  const handleLogout = () => {
    logoutUser();
    window.localStorage.removeItem("token");
    setIsLogoutModelOpen(false);
    getUser()
    window.localStorage.removeItem('token')
    navigate("/");

  };

  const initials = getInitials(user?.username);

  const menuItems = [
    { text: "Home", icon: <Home /> },
    {text:"Profile", customNavigate:'/user/profile', icon: <User />},
    {text: "Cart", customNavigate: `/user/cart/${user?.id}`, icon: <ShoppingCart />},
    {text:"Orders", customNavigate:`/user/orders/${user?.id}`, icon:<ListOrdered />},
    { text: "Restaurants", icon: <Restaurant /> },

  ];
  const jwt = window.localStorage.getItem("token");
  return (
    <>
      <AppBar position="sticky" sx={{ bgcolor: "background.paper", color: "text.primary" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "#FF6B35", cursor: "pointer" }}
            onClick={() => navigate(`${jwt ? "/home" : "/"}`)}
          >
            Eat Ease
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            {!isMobile && (
              <>
                {/* Role-based Panel Button */}
                { token && user?.role === "ROLE_ADMIN" && (
                  <Button variant="contained" onClick={() => navigate("/admin/dashboard")} sx={{ mr: 2, bgcolor: "#FF6B35" }}>
                    Admin Panel
                  </Button>
                )}
                {token && user?.role === "ROLE_RESTAURANT_OWNER" && (
                  <Button variant="contained" onClick={() => navigate("/restaurant/dashboard")} sx={{ mr: 2, bgcolor: "#FF6B35" }}>
                    Restaurant Panel
                  </Button>
                )}

                {/* Language Select */}
                <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
                  <Language sx={{ mr: 1 }} />
                  <Select
                    value={i18n.language}
                    onChange={handleLanguageChange}
                    size="small"
                    sx={{ minWidth: 70 }}
                    >
                  {languages.map((lang,i)=>(
                    <MenuItem key={i} value={lang.code}>{lang.name}</MenuItem>
                  ))}
                  </Select>
                </Box>

                {/* Cart */}
                <IconButton sx={{ mr: 2 }} onClick={() => navigate(`/user/cart/${user?.id}`)}>
                  <Badge badgeContent={cartItems?.items.length} color="primary">
                    <ShoppingCart />
                  </Badge>
                </IconButton>

                {/* Auth Buttons or Avatar */}
                {!token ? (
                  <>
                    <Button variant="outlined" onClick={() => navigate("/login")} sx={{ mr: 1, color: "#FF6B35" }}>
                      Login
                    </Button>
                    <Button variant="contained" onClick={() => navigate("/register")} sx={{ bgcolor: "#FF6B35" }}>
                      Sign Up
                    </Button>
                  </>
                ) : (
                  <Avatar
                    onClick={handleClickAvatar}
                    sx={{ border: "1px solid black", cursor: "pointer" }}
                  >
                    {token && initials}
                  </Avatar>
                )}
              </>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton edge="end" onClick={() => setDrawerOpen(true)} sx={{ color: "primary.main" }}>
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Avatar Dropdown */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={() => handleNavigateAndClose("/user/profile")}>Profile</MenuItem>
        <MenuItem onClick={() =>navigate(`/user/orders/${user?.id}`)}>Orders</MenuItem>
        <MenuItem onClick={handleLogoutModelOpen} sx={{ color: "red" }}>
          Logout <LogOutIcon className="ml-2" />
        </MenuItem>
      </Menu>

      {/* Logout Modal */}
      <Modal open={isLogoutModelOpen} onClose={() => setIsLogoutModelOpen(false)}>
        <Box sx={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          textAlign: "center"
        }}>
          <Typography variant="h6" mb={2}>Are you sure you want to logout?</Typography>
          <Box display="flex" justifyContent="center" gap={2}>
            <Button variant="contained" color="error" onClick={handleLogout}>Logout</Button>
            <Button variant="outlined" onClick={() => setIsLogoutModelOpen(false)}>Cancel</Button>
          </Box>
        </Box>
      </Modal>

      {/* Drawer for Mobile */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250, pt: 2 }}>
          <Typography variant="h6" sx={{ px: 2, mb: 2, color: "primary.main" }}>
            Eat Ease
          </Typography>

          <TextField
            variant="outlined"
            size="small"
            placeholder="Search..."
            fullWidth
            sx={{ mx: 2, mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />

          <List>
            {menuItems.map((item) => (
              <ListItem
                key={item.text}
                component="button"
                
                onClick={() => {
                  setDrawerOpen(false);
                  item.customNavigate ? navigate(item.customNavigate) :  navigate(`/${item.text.toLowerCase()}`);
                }}
                sx={{ width: "100%", textAlign: "left", cursor:'pointer', ":hover":{backgroundColor:'lightgray'} }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
             
          </List>

          <Box sx={{ p: 2 }}>
            {!token ? (
              <>
                <Button fullWidth variant="outlined" sx={{ mb: 1 }} onClick={() => {
                  setDrawerOpen(false);
                  navigate("/login");
                }}>
                  Login
                </Button>
                <Button fullWidth variant="contained" onClick={() => {
                  setDrawerOpen(false);
                  navigate("/register");
                }}>
                  Sign Up
                </Button>
              </>
            ) : (
              <Button fullWidth variant="contained" color="error" onClick={() => {
                setDrawerOpen(false);
                handleLogout();
              }}>
                Logout
              </Button>
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
