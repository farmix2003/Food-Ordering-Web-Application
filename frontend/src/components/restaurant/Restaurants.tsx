import { Search, Star } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  InputAdornment,
  OutlinedInput,
  MenuItem,
  Select,
  Typography,
  Box,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Container,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Restaurant {
  id: string;
  name: string;
  image: string;
  cuisine: string;
  rating: number;
  tags: string[];
  description: string;
}

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const navigate = useNavigate();

  const mockRestaurants: Restaurant[] = [
    {
      id: "1",
      name: "Bella Italia",
      image:
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
      cuisine: "Italian",
      rating: 4.5,
      tags: ["Italian", "Pizza", "Pasta", "Fine Dining"],
      description: "Authentic Italian cuisine with fresh ingredients",
    },
    {
      id: "2",
      name: "Sakura Sushi",
      image:
        "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop",
      cuisine: "Japanese",
      rating: 4.8,
      tags: ["Japanese", "Sushi", "Fresh Fish", "Traditional"],
      description: "Fresh sushi and traditional Japanese dishes",
    },
    {
      id: "3",
      name: "Spice Garden",
      image:
        "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop",
      cuisine: "Indian",
      rating: 4.3,
      tags: ["Indian", "Spicy", "Vegetarian", "Curry"],
      description: "Aromatic spices and authentic Indian flavors",
    },
    {
      id: "4",
      name: "Le Petit Bistro",
      image:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
      cuisine: "French",
      rating: 4.6,
      tags: ["French", "Fine Dining", "Wine", "Romantic"],
      description: "Classic French cuisine in an elegant setting",
    },
    {
      id: "5",
      name: "Taco Fiesta",
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
      cuisine: "Mexican",
      rating: 4.2,
      tags: ["Mexican", "Tacos", "Spicy", "Casual"],
      description: "Vibrant Mexican flavors and fresh ingredients",
    },
    {
      id: "6",
      name: "Dragon Palace",
      image:
        "https://images.unsplash.com/photo-1576458088443-04a19b4a37d6?w=400&h=300&fit=crop",
      cuisine: "Chinese",
      rating: 4.4,
      tags: ["Chinese", "Dim Sum", "Noodles", "Traditional"],
      description: "Traditional Chinese dishes with modern presentation",
    },
  ];

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        setTimeout(() => {
          setRestaurants(mockRestaurants);
          setFilteredRestaurants(mockRestaurants);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError("Failed to load restaurants" + err);
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  useEffect(() => {
    let filtered = restaurants;

    if (searchTerm) {
      filtered = filtered.filter(
        (restaurant) =>
          restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
          restaurant.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    if (cuisineFilter && cuisineFilter !== "all") {
      filtered = filtered.filter(
        (restaurant) => restaurant.cuisine === cuisineFilter
      );
    }

    if (ratingFilter && ratingFilter !== "all") {
      const minRating = parseFloat(ratingFilter);
      filtered = filtered.filter(
        (restaurant) => restaurant.rating >= minRating
      );
    }

    setFilteredRestaurants(filtered);
  }, [searchTerm, cuisineFilter, ratingFilter, restaurants]);

  const uniqueCuisines = [...new Set(restaurants.map((r) => r.cuisine))];

  const handleViewMenu = (restaurantId: string) => {
    navigate(`/restaurants/${restaurantId}`, {
      state: { restaurant: mockRestaurants.find((r) => r.id === restaurantId) },
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        sx={{
          color:
            index < Math.floor(rating)
              ? "#FFD700"
              : index < rating
              ? "rgba(255,215,0,0.5)"
              : "#e0e0e0",
        }}
        fontSize="small"
      />
    ));
  };

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" py={8}>
        <CircularProgress color="primary" sx={{ mb: 2 }} />
        <Typography variant="h6">Loading delicious restaurants...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box py={8}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Header */}
      <Box textAlign="center" mb={8}>
        <Typography
          variant="h3"
          fontWeight="bold"
          sx={{
            background: "linear-gradient(to right, #ef4444, #14b8a6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 2,
          }}
        >
          All Restaurants
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Discover amazing dining experiences near you
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Grid container width={"100%"} spacing={2} mb={4}>
        <Grid>
          <OutlinedInput
            sx={{ width: { xs: 380, sm: 400, md: 400, lg: 500 } }}
            placeholder="Search restaurants, cuisines, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            }
          />
        </Grid>
        <Grid>
          <Select
            sx={{ width: { sx: 190, sm: 180, md: 240, lg: 306 } }}
            displayEmpty
            value={cuisineFilter}
            onChange={(e) => setCuisineFilter(e.target.value)}
          >
            <MenuItem value="">All Cuisines</MenuItem>
            {uniqueCuisines.map((cuisine) => (
              <MenuItem key={cuisine} value={cuisine}>
                {cuisine}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid>
          <Select
            sx={{ width: { sx: 190, sm: 180, md: 240, lg: 306 } }}
            displayEmpty
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
          >
            <MenuItem value="">Any Rating</MenuItem>
            <MenuItem value="4.5">4.5+ Stars</MenuItem>
            <MenuItem value="4.0">4.0+ Stars</MenuItem>
            <MenuItem value="3.5">3.5+ Stars</MenuItem>
            <MenuItem value="3.0">3.0+ Stars</MenuItem>
          </Select>
        </Grid>
      </Grid>

      {/* Results Count */}
      <Typography color="text.secondary" mb={3}>
        Showing {filteredRestaurants.length} restaurant
        {filteredRestaurants.length !== 1 ? "s" : ""}
      </Typography>

      {/* Restaurant Grid */}
      <Grid
        container
        spacing={4}
        alignItems={{
          xs: "center",
          sm: "center",
          md: "center",
          lg: "center",
          xl: "center",
        }}
        justifyContent={{
          xs: "center",
          sm: "center",
          md: "center",
          lg: "center",
          xl: "center",
        }}
        sx={{ mb: 4 }}
        // columns={{ xs: 4, sm: 4, md: 12, lg: 12, xl: 12 }}
      >
        {filteredRestaurants.map((restaurant) => (
          <Grid sx={{ display: "flex", flexWrap: "wrap" }} key={restaurant.id}>
            <Card
              sx={{
                height: "100%",
                width: { sm: "100%", md: 360, lg: 360, xl: 360 },
                display: "flex",
                flexDirection: "column",
                transition: "box-shadow 0.3s",
                "&:hover": { boxShadow: 6 },
              }}
            >
              <Box
                sx={{ aspectRatio: "16/9", overflow: "hidden", width: "100%" }}
              >
                <Box
                  component="img"
                  src={restaurant.image}
                  alt={restaurant.name}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.3s",
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                />
              </Box>
              <CardHeader
                title={<Typography variant="h6">{restaurant.name}</Typography>}
                subheader={
                  <Box display="flex" alignItems="center" gap={1}>
                    {renderStars(restaurant.rating)}
                    <Typography variant="body2" color="text.secondary">
                      {restaurant.rating} stars
                    </Typography>
                  </Box>
                }
                sx={{ pb: 0 }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  {restaurant.description}
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {restaurant.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      color="secondary"
                      size="small"
                    />
                  ))}
                </Box>
              </CardContent>
              <CardActions sx={{ mt: "auto", p: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    background: "linear-gradient(to right, #ef4444, #14b8a6)",
                    color: "#fff",
                    fontWeight: "bold",
                    "&:hover": {
                      background: "linear-gradient(to right, #dc2626, #0d9488)",
                    },
                  }}
                  onClick={() => handleViewMenu(restaurant.id)}
                >
                  View Menu
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* No Results */}
      {filteredRestaurants.length === 0 && (
        <Box textAlign="center" py={8}>
          <Typography variant="h2" mb={2}>
            🍽️
          </Typography>
          <Typography variant="h5" fontWeight="bold" mb={1}>
            No restaurants found
          </Typography>
          <Typography color="text.secondary">
            Try adjusting your search or filters to find more options
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Restaurants;
