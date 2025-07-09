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
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllRestaurants } from "../../server/server";

interface Image {
  id:number;
  url:string;
}
interface Order {
  id:number;
  shippingAddress:{
    apartment:string;
    cityName:string;
    streetName:string;
  },
  numberOfOrders:number;
}
interface Restaurant {
  id:number;
  contactInfo:{phone:string};
  name:string;
  open:boolean;
  cuisineType:string;
  images: Image[]
  orders: Order[]
  description:string;
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


  const getRestaurants = async() =>{
    const data = await getAllRestaurants();
   console.log(data);
   setRestaurants(data)
   setLoading(false)
  }
 useEffect(() =>{
  getRestaurants()
 },[])


  useMemo(() => {
    let filtered = restaurants;

    if (searchTerm) {
      filtered = filtered.filter(
        (restaurant) =>
          restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          restaurant.cuisineType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  

    if (cuisineFilter && cuisineFilter !== "all") {
      filtered = filtered.filter(
        (restaurant) => restaurant.cuisineType === cuisineFilter
      );
    }


    setFilteredRestaurants(filtered);
  }, [searchTerm, cuisineFilter, restaurants]);

  const uniqueCuisines = [...new Set(restaurants.map((r) => r.cuisineType))];

  const handleViewMenu = (restaurantId: number) => {
    navigate(`/restaurants/${restaurantId}`, {
      state: { restaurant: restaurants.find((r) => r.id === restaurantId) },
    });
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
               <Box sx={{ aspectRatio: "16/9", overflow: "hidden", width: "100%" }}>
    <Box
      component="img"
      src={restaurant.images[0].url}
      alt={restaurant.name}
      sx={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        filter: restaurant.open ? "none" : "grayscale(100%)",
        opacity: restaurant.open ? 1 : 0.6,
        transition: "transform 0.3s",
        "&:hover": { transform: "scale(1.05)" },
      }}
    />
  </Box>
  <CardHeader
    title={
      <Typography variant="h6" color={restaurant.open ? "initial" : "text.disabled"}>
        {restaurant.name} {!restaurant.open && "(Closed)"}
      </Typography>
    }
    sx={{ pb: 0 }}
  />
  <CardContent sx={{ flexGrow: 1 }}>
    <Typography variant="body2" color="text.secondary" mb={2}>
      {restaurant.description}
    </Typography>
    <Box display="flex" flexWrap="wrap" gap={1}>
      {restaurant.cuisineType}
    </Box>
  </CardContent>
  <CardActions sx={{ mt: "auto", p: 2 }}>
    <Button
      fullWidth
      variant="contained"
      disabled={!restaurant.open}
      sx={{
        background: restaurant.open
          ? "linear-gradient(to right, #ef4444, #14b8a6)"
          : "gray",
        color: "#fff",
        fontWeight: "bold",
        "&:hover": {
          background: restaurant.open
            ? "linear-gradient(to right, #dc2626, #0d9488)"
            : "gray",
        },
      }}
      onClick={() => {
        if (restaurant.open) handleViewMenu(restaurant.id);
      }}
    >
      {restaurant.open ? "View Menu" : "Closed"}
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
