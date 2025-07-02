import { useEffect, useState } from "react";
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
} from "@mui/material";
import {
  Search,
  ShoppingCart,
  Language,
  Home,
  Restaurant,
  Info,
  Phone,
} from "@mui/icons-material";
import Menu from "@mui/material/Menu";
import { useNavigate } from "react-router-dom";
import { LogOutIcon } from "lucide-react";
import { getUserByJwt, logoutUser } from "../server/server";
// import {i18n} from "i18next";
type User = {
  username: string;
  role: string;
};

type Langs = {
  code: string;
  name: string;
};

// interface I18n {
//   i18n : i18n;
//   languages: Langs[];
// }

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [language, setLanguage] = useState("EN");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLogoutModelOpen, setIsLogoutModelOpen] = useState(false);
  const open = Boolean(anchorEl);
  const [user, setUser] = useState<User | null>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (path: string) => {
    navigate(path);
    setAnchorEl(null);
  };
  const navigate = useNavigate();

  const handleLogoutModelOpen = () => {
    setIsLogoutModelOpen(true);
    setAnchorEl(null);
  };

  const handleLogout = () => {
    const response = logoutUser();
    window.localStorage.removeItem("token");
    console.log(response);
    setIsLogoutModelOpen(false);
    setAnchorEl(null);
    navigate("/");
  };

  const menuItems = [
    { text: "Home", icon: <Home /> },
    { text: "Restaurants", icon: <Restaurant /> },
    { text: "About", icon: <Info /> },
    { text: "Contact", icon: <Phone /> },
  ];
  const token = window.localStorage.getItem("token");

  const getUser = () => {
    const data = getUserByJwt();
    data.then((data) => setUser(data));
  };

  useEffect(() => {
    getUser();
  });
  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          bgcolor: "background.paper",
          color: "text.primary",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Toolbar
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Logo */}
          <Typography
            variant="h5"
            component="div"
            sx={{
              flexGrow: isMobile ? 1 : 0,
              fontWeight: "bold",
              color: "primary.main",
              mr: 4,
            }}
          >
            Eat Ease
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {!isMobile && (
              <>
                <Box>
                  {user?.role === "ROLE_ADMIN" ? (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => navigate("/admin/dashboard")}
                      sx={{ mr: 2 }}
                    >
                      Admin Panel
                    </Button>
                  ) : user?.role === "ROLE_RESTAURANT_OWNER" ? (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => navigate("/restaurant/dashboard")}
                      sx={{ mr: 2 }}
                    >
                      Restaurant Owner Panel
                    </Button>
                  ) : (
                    <></>
                  )}
                </Box>

                {/* Language Selector */}
                <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
                  <Language sx={{ mr: 1 }} />
                  <Select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    size="small"
                    sx={{ minWidth: 70 }}
                  >
                    <MenuItem value="EN">EN</MenuItem>
                    <MenuItem value="RU">RU</MenuItem>
                    <MenuItem value="UZ">UZ</MenuItem>
                  </Select>
                </Box>

                {/* Cart Icon */}
                <IconButton
                  sx={{ mr: 2 }}
                  onClick={() => navigate("/user/cart")}
                >
                  <Badge badgeContent={3} color="primary">
                    <ShoppingCart />
                  </Badge>
                </IconButton>

                {/* Profile/Login */}
                {!token ? (
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => navigate("/login")}
                    >
                      Login
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => navigate("/register")}
                    >
                      Sign Up
                    </Button>
                  </Box>
                ) : (
                  <Avatar
                    variant={"circular"}
                    sx={{ border: "1px solid black" }}
                    className="rounded-full px-2 py-1 cursor-pointer"
                    onClick={handleClick}
                  >
                    TF
                  </Avatar>
                )}
                <Menu
                  id="demo-positioned-menu"
                  aria-labelledby="demo-positioned-button"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                >
                  <MenuItem
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleClose("/user/profile")}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem
                    sx={{ cursor: "pointer", color: "red" }}
                    onClick={handleLogoutModelOpen}
                  >
                    Logout <LogOutIcon />{" "}
                  </MenuItem>
                </Menu>
                {isLogoutModelOpen && (
                  <Modal
                    open={isLogoutModelOpen}
                    onClose={() => setIsLogoutModelOpen(false)}
                    aria-labelledby="logout-modal-title"
                    aria-describedby="logout-modal-description"
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        borderRadius: 2,
                        p: 4,
                        minWidth: 300,
                        textAlign: "center",
                      }}
                    >
                      <Typography id="logout-modal-title" variant="h6" mb={2}>
                        Are you sure you want to logout?
                      </Typography>
                      <Box
                        display="flex"
                        justifyContent="center"
                        gap={2}
                        mt={2}
                      >
                        <Button
                          variant="contained"
                          color="error"
                          onClick={handleLogout}
                        >
                          Logout
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => setIsLogoutModelOpen(false)}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  </Modal>
                )}
              </>
            )}
            {isMobile && (
              <IconButton
                edge="end"
                onClick={() => setDrawerOpen(true)}
                sx={{ color: "primary.main" }}
              ></IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 250, pt: 2 }}>
          <Typography variant="h6" sx={{ px: 2, mb: 2, color: "primary.main" }}>
            Eat Ease
          </Typography>

          <TextField
            variant="outlined"
            size="small"
            placeholder="Search..."
            fullWidth
            sx={{ mx: 2, mb: 2, width: "calc(100% - 32px)" }}
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
              <ListItem component={"button"} key={item.text}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>

          <Box sx={{ p: 2 }}>
            <Button variant="outlined" fullWidth sx={{ mb: 1 }}>
              Login
            </Button>
            <Button variant="contained" fullWidth>
              Sign Up
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
