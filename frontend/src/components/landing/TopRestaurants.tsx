import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Rating,
  Chip,
} from "@mui/material";
import { Restaurant } from "@mui/icons-material";
import { motion } from "framer-motion";

const restaurants = [
  {
    id: 1,
    name: "Italian Bistro",
    cuisines: ["Italian", "Pizza", "Pasta"],
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=400&h=250&fit=crop",
    deliveryTime: "25-35 min",
  },
  {
    id: 2,
    name: "Sushi Palace",
    cuisines: ["Japanese", "Sushi", "Asian"],
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1579027989054-b11a9b6d01f9?w=400&h=250&fit=crop",
    deliveryTime: "30-40 min",
  },
  {
    id: 3,
    name: "Burger House",
    cuisines: ["American", "Burgers", "Fast Food"],
    rating: 4.4,
    image:
      "https://images.unsplash.com/photo-1552566588-bf594736da85?w=400&h=250&fit=crop",
    deliveryTime: "20-30 min",
  },
  {
    id: 4,
    name: "Spice Garden",
    cuisines: ["Indian", "Curry", "Spicy"],
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=250&fit=crop",
    deliveryTime: "35-45 min",
  },
  {
    id: 5,
    name: "Green Salads",
    cuisines: ["Healthy", "Salads", "Vegetarian"],
    rating: 4.3,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=250&fit=crop",
    deliveryTime: "15-25 min",
  },
  {
    id: 6,
    name: "Dragon Wok",
    cuisines: ["Chinese", "Asian", "Noodles"],
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1563379091339-03246efb27d7?w=400&h=250&fit=crop",
    deliveryTime: "25-35 min",
  },
];

const TopRestaurants = () => {
  return (
    <Box sx={{ py: 8, backgroundColor: "white" }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{ mb: 6, color: "text.primary" }}
          >
            🏆 Top Restaurants
          </Typography>
        </motion.div>

        <Grid container spacing={4}>
          {restaurants.map((restaurant, index) => (
            <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  sx={{
                    height: "100%",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "translateY(-8px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={restaurant.image}
                    alt={restaurant.name}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {restaurant.name}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Rating
                        value={restaurant.rating}
                        precision={0.1}
                        size="small"
                        readOnly
                      />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {restaurant.rating} • {restaurant.deliveryTime}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.5,
                        mb: 2,
                      }}
                    >
                      {restaurant.cuisines.map((cuisine) => (
                        <Chip
                          key={cuisine}
                          label={cuisine}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>

                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<Restaurant />}
                      sx={{ borderRadius: 2 }}
                    >
                      View Menu
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default TopRestaurants;
