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
import { addImageToRestaurant, deleteImageFromRestaurant, deleteRestaurant, getAllRestaurants, getRestaurantById, updateRestaurant } from "../../server/server";
import { Edit, Eye } from "lucide-react";
import RestaurantForm from "../restaurant/RestaurantForm";
import { ArrowBack } from "@mui/icons-material";

interface Image {
  id: number;
  url: string;
  fileName: string;
}

interface Restaurant {
  id: number;
  name: string;
  images: Image[];
  cuisineType: string;
  description: string;
  address: {
    streetName: string;
    cityName: string;
  };
  contactInfo: {
    email: string;
    phone: string;
    whatsApp: string;
    instagram: string;
  };
  openingHours: string;
  closingHours: string;
  open: boolean;
  ownerUsername?:string;
}

const RestaurantsTab = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [restaurant, setRestaurant] = useState<Restaurant & { newImages?: File[] } | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const getRestaurants = async () => {
    try {
      const data = await getAllRestaurants();
      setRestaurants(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };
  useEffect(() => {
    getRestaurants();
  }, []);

const handleDeleteRestaurant = async () => {
    if (!restaurant) return;

    try {
      await deleteRestaurant(restaurant.id);
      setRestaurant(null);
      setIsDeleteConfirmOpen(false);
    } catch (error) {
     
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    try {
      await deleteImageFromRestaurant(restaurant?.id || 0, imageId);
      setRestaurant((prev) =>
        prev
          ? { ...prev, images: prev.images.filter((img) => img.id !== imageId) }
          : prev
      );
    } catch (error) {
     
    }
  };
  const handleEditRestaurantOpenModal = async(id:number) =>{
    setIsEditModalOpen(true);
    const data = await getRestaurantById(id)
   setRestaurant(data)
  }


  const handleSaveRestaurant = async () => {
    if (!restaurant) return;

    try {
      await updateRestaurant(
        restaurant.id,
        restaurant.name,
        restaurant.description,
        restaurant.address,
        restaurant.openingHours,
        restaurant.closingHours,
        restaurant.cuisineType,
        restaurant.contactInfo
      );

      if (restaurant.newImages?.length) {
        for (const image of restaurant.newImages) {
          await addImageToRestaurant(restaurant.id, image);
        }
      }


      setRestaurant((prev) => (prev ? { ...prev, newImages: [] } : prev));
     getRestaurants()
    } catch (error) {
      console.error(error)
    }
  };


  return (
    <Box>
     {
      !isEditModalOpen && (
        <>
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
                    variant={"text"}
                    size="small"
                    title="Veiw details"
                    onClick={() => setSelectedRestaurant(restaurant)}
                    >
                    <Eye className="text-green-600" />
                  </Button>
                  <Button 
                   size="small"
                   title="Edit details"
                   onClick={()=>handleEditRestaurantOpenModal(restaurant.id)}
                   ><Edit  /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
     </>
      )
     }
 
     {/* Modal for edting Restaurant Details for Admin */}
    
 {
   isEditModalOpen && (
     <div>
      <Button onClick={()=>setIsEditModalOpen(false)} ><ArrowBack /> Back</Button>
        <RestaurantForm
            onSave={handleSaveRestaurant}
            onDelete={handleDeleteRestaurant}
            handleDeleteImage={handleDeleteImage}
            isOpen={isDeleteConfirmOpen}
            setIsOpen={setIsDeleteConfirmOpen}
            restaurant={restaurant}
            setRestaurant={setRestaurant}
            />
            </div>
      )
     }
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
