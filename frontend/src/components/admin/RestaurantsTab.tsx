import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";

interface Restaurant {
  id: number;
  name: string;
  cuisineType: string;
  owner: { email: string };
  contactInfo: { email: string };
}
import {getAllRestaurants} from '../../server/server'
const RestaurantsTab = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    const getRestaurants = async () => {
      try {
        const data = await getAllRestaurants();
        setRestaurants(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };
    getRestaurants();
  }, []);
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        Restaurants Management
      </Typography>

      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table sx={{ minWidth: 650 }} aria-label="restaurants table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.main" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                ID
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Name
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Cuisine
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Owner
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Contact
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {restaurants?.map((restaurant) => (
              <TableRow
                key={restaurant.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { backgroundColor: "action.hover" },
                }}
              >
                <TableCell component="th" scope="row">
                  {restaurant.id}
                </TableCell>
                <TableCell sx={{ fontWeight: "medium" }}>
                  {restaurant.name}
                </TableCell>
                <TableCell>{restaurant.cuisineType}</TableCell>
                <TableCell>{restaurant.owner.email}</TableCell>
                <TableCell>{restaurant.contactInfo.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
        Total restaurants: {restaurants.length}
      </Typography>
    </Box>
  );
};

export default RestaurantsTab;