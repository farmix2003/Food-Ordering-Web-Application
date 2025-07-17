import { useEffect, useState } from "react";
import {
  Box,
  Container,
  TextField,
  InputAdornment,
  Paper,
  Typography,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { searchMenu, searchRestaurants } from "../../server/server";
import type { I18n } from "../../pages/Index";

interface ImageResponse {
  id: number;
  url: string;
  fileName: string;
}

interface ExtrasDto {
  id: number;
  name: string;
  price: number;
}

interface MenuDto {
  id: number;
  foodName: string;
  description: string;
  price: number;
  available: boolean;
  categoryName: string | null;
  images: ImageResponse[];
  extras: ExtrasDto[];
  restaurantId: number;
}

interface Restaurant {
  id: number;
  name: string;
  cuisineType: string;
  open: boolean;
  images: ImageResponse[];
}

const SearchSection = ({t}:I18n) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [menus, setMenus] = useState<MenuDto[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [showResults, setShowResults] = useState(false);

  const navigate = useNavigate();


  const isRestaurantOpen = (restaurantId: number): boolean => {
    const restaurant = restaurants.find((r) => r.id === restaurantId);
    return restaurant?.open ?? false;
  };

  const searchMenusAndRestaurants = async () => {
    if (searchTerm.trim() === "") {
      setMenus([]);
      setRestaurants([]);
      setShowResults(false);
      return;
    }

    try {
      const [menuData, restaurantData] = await Promise.all([
        searchMenu(searchTerm),
        searchRestaurants(searchTerm),
      ]);
      setMenus(menuData);
      setRestaurants(restaurantData);
      setShowResults(true);
    } catch (error) {
      console.error("Search failed:", error);
      setMenus([]);
      setRestaurants([]);
      setShowResults(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim()) {
        searchMenusAndRestaurants();
      } else {
        setShowResults(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  return (
    <Box sx={{ py: 6, backgroundColor: "background.paper", borderRadius: 2 }}>
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ mb: 4, color: "text.primary" }}
          >
            {t("heroSearchMessage")}
          </Typography>

          <Paper elevation={3} sx={{ p: 2, borderRadius: 4, mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder={t("searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "primary.main" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontSize: "1.1rem",
                },
              }}
            />
          </Paper>

          {showResults && (
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mt: 2 }}>
              {menus.length > 0 && (
                <>
                  <Typography variant="h6" gutterBottom>
                    {t("dishes")}
                  </Typography>
                  <List>
                    {menus.map((menu) => {
                      const open = isRestaurantOpen(menu.restaurantId);
                      return (
                        <ListItem
                          key={menu.id}
                          alignItems="flex-start"
                          sx={{
                            mb: 2,
                            bgcolor: open ? "grey.100" : "grey.200",
                            borderRadius: 2,
                            opacity: open ? 1 : 0.5,
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar
                              variant="rounded"
                              src={menu.images[0]?.url || ""}
                              alt={menu.foodName}
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle1">
                                {menu.foodName}
                              </Typography>
                            }
                            secondary={
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  {menu.description}
                                </Typography>
                                <Typography variant="body2" color="text.primary">
                                  ${menu.price.toFixed(2)} —{" "}
                                  {menu.available ? "Available" : "Unavailable"}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color={open ? "green" : "error"}
                                >
                                  {open ? "Restaurant Open" : "Restaurant Closed"}
                                </Typography>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  sx={{ mt: 1 }}
                                  disabled={!open}
                                  onClick={() =>
                                    navigate(`/restaurants/${menu.restaurantId}`, {
                                      state: {
                                        restaurant: restaurants.find(
                                          (r) => r.id === menu.restaurantId
                                        ),
                                      },
                                    })
                                  }
                                >
                                  {t("goToRestaurant")}
                                </Button>
                              </Box>
                            }
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                </>
              )}

              {menus.length > 0 && restaurants.length > 0 && (
                <Divider sx={{ my: 2 }} />
              )}

              {restaurants.length > 0 && (
                <>
                  <Typography variant="h6" gutterBottom>
                    {t("restaurants")}
                  </Typography>
                  <List>
                    {restaurants.map((restaurant) => (
                      <ListItem
                        key={restaurant.id}
                        alignItems="flex-start"
                        sx={{
                          mb: 2,
                          bgcolor: restaurant.open ? "grey.100" : "grey.200",
                          borderRadius: 2,
                          opacity: restaurant.open ? 1 : 0.5,
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            variant="rounded"
                            src={restaurant.images[0]?.url || ""}
                            alt={restaurant.name}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1">
                              {restaurant.name}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {restaurant.cuisineType}
                              </Typography>
                              <Box sx={{display: 'flex', alignItems: 'center'}}>
                              <Typography
                                variant="caption"
                                sx={{fontSize: 14}}
                                color={restaurant.open ? "green" : "error"}
                                >
                                {restaurant.open ? "Open" : "Closed"}
                              </Typography>
                              <Button
                                size="small"
                                variant="outlined"
                                sx={{ mt: 1, ml:1}}
                                disabled={!restaurant.open}
                                onClick={() =>
                                  navigate(`/restaurants/${restaurant.id}`, {
                                    state: { restaurant },
                                  })
                                }
                                >
                                {t("goToRestaurant")}
                              </Button>
                                </Box>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}

              {menus.length === 0 && restaurants.length === 0 && (
                <Typography variant="body1" color="text.secondary">
                 {t("noResultFound")}
                </Typography>
              )}
            </Paper>
          )}
        </motion.div>
      </Container>
    </Box>
  );
};

export default SearchSection;
