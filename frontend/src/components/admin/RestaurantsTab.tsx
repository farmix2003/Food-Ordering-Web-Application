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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getAllRestaurants } from "../../server/server";

interface Restaurant {
  id: number;
  name: string;
  cuisineType: string;
  ownerUsername: string;
  contactInfo: { email: string, phone: string, whatsApp: string, instagram: string };
  address: {
    streetName: string;
    cityName: string;
  };
  openingHours: string;
  closingHours: string;

}

const RestaurantsTab = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

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
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Cuisine</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Owner</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Contact</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {restaurants.map((restaurant) => (
              <TableRow
                key={restaurant.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { backgroundColor: "action.hover" },
                }}
              >
                <TableCell>{restaurant.id}</TableCell>
                <TableCell sx={{ fontWeight: "medium" }}>{restaurant.name}</TableCell>
                <TableCell>{restaurant.cuisineType}</TableCell>
                <TableCell>{restaurant.ownerUsername}</TableCell>
                <TableCell>{restaurant.contactInfo.email}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setSelectedRestaurant(restaurant)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
        Total restaurants: {restaurants.length}
      </Typography>

      {/* Modal for Restaurant Details */}
      <Dialog
        open={!!selectedRestaurant}
        onClose={() => setSelectedRestaurant(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Restaurant Details</DialogTitle>
        <DialogContent dividers>
          {selectedRestaurant && (
            <>
              <Typography><strong>ID:</strong> {selectedRestaurant.id}</Typography>
              <Typography><strong>Name:</strong> {selectedRestaurant.name}</Typography>
              <Typography><strong>Cuisine:</strong> {selectedRestaurant.cuisineType}</Typography>
              <Typography><strong>Owner:</strong> {selectedRestaurant.ownerUsername}</Typography>
              <Typography><strong>Email:</strong> {selectedRestaurant.contactInfo.email}</Typography>
              <Typography><strong>Phone:</strong> {selectedRestaurant.contactInfo.phone}</Typography>
              <Typography><strong>WhatsApp:</strong> {selectedRestaurant.contactInfo.whatsApp}</Typography>
              <Typography><strong>Instagram:</strong> {selectedRestaurant.contactInfo.instagram}</Typography>
              <Typography>
                <strong>Address:</strong> {selectedRestaurant.address.streetName}, {selectedRestaurant.address.cityName}  
              </Typography>
              {/* Add more fields here if needed */}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedRestaurant(null)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RestaurantsTab;
