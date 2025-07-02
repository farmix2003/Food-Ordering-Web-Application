import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Button,
  Box,
} from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import { useState } from "react";

interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  status: "approved" | "pending" | "rejected";
}

const mockRestaurants: Restaurant[] = [
  { id: 1, name: "Pizza Palace", cuisine: "Italian", status: "approved" },
  { id: 2, name: "Sushi Express", cuisine: "Japanese", status: "pending" },
  { id: 3, name: "Burger Barn", cuisine: "American", status: "approved" },
  { id: 4, name: "Taco Time", cuisine: "Mexican", status: "pending" },
  { id: 5, name: "Curry House", cuisine: "Indian", status: "approved" },
  { id: 6, name: "Noodle Box", cuisine: "Chinese", status: "rejected" },
  { id: 7, name: "Greek Garden", cuisine: "Greek", status: "pending" },
  { id: 8, name: "BBQ Central", cuisine: "American", status: "approved" },
];

const RestaurantsTab = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(mockRestaurants);

  const handleApprove = (id: number) => {
    setRestaurants((prev) =>
      prev.map((restaurant) =>
        restaurant.id === id
          ? { ...restaurant, status: "approved" as const }
          : restaurant
      )
    );
  };

  const handleReject = (id: number) => {
    setRestaurants((prev) =>
      prev.map((restaurant) =>
        restaurant.id === id
          ? { ...restaurant, status: "rejected" as const }
          : restaurant
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "success";
      case "pending":
        return "warning";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

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
                Status
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Actions
              </TableCell>
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
                <TableCell component="th" scope="row">
                  {restaurant.id}
                </TableCell>
                <TableCell sx={{ fontWeight: "medium" }}>
                  {restaurant.name}
                </TableCell>
                <TableCell>{restaurant.cuisine}</TableCell>
                <TableCell>
                  <Chip
                    label={restaurant.status}
                    color={getStatusColor(restaurant.status)}
                    variant="outlined"
                    sx={{ fontWeight: "medium", textTransform: "capitalize" }}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {restaurant.status === "pending" && (
                      <>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={<CheckCircle />}
                          onClick={() => handleApprove(restaurant.id)}
                          sx={{ minWidth: "auto" }}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          startIcon={<Cancel />}
                          onClick={() => handleReject(restaurant.id)}
                          sx={{ minWidth: "auto" }}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    {restaurant.status === "rejected" && (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={<CheckCircle />}
                        onClick={() => handleApprove(restaurant.id)}
                        sx={{ minWidth: "auto" }}
                      >
                        Approve
                      </Button>
                    )}
                    {restaurant.status === "approved" && (
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        startIcon={<Cancel />}
                        onClick={() => handleReject(restaurant.id)}
                        sx={{ minWidth: "auto" }}
                      >
                        Reject
                      </Button>
                    )}
                  </Box>
                </TableCell>
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
