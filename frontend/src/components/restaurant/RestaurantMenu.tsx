import {
  Add,
  FilterAlt,
  FmdGood,
  Instagram,
  WhatsApp,
  Star,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { useState, useEffect, use } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { addItemToCart, getMenuItemsByRestaurantId, getUserByJwt } from "../../server/server";
import { Phone } from "lucide-react";

interface Image {
  id: number;
  url: string;
  fileName: string;
}

interface MenuItem {
  id: string;
  foodName: string;
  price: number;
  images: Image[];
  description: string;
  extrasList: {id:number; name: string; price: number }[];
  available: boolean;
  categoryName: string;
  restaurantId: number;
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
  foods: MenuItem[];
}

interface User{
  id:number
}

const RestaurantMenu = () => {
  const { id } = useParams();
  const location = useLocation();
  const restaurant1 = location.state?.restaurant;
  const [restaurant, setRestaurant] = useState<Restaurant | null>(restaurant1);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedExtrasMap, setSelectedExtrasMap] = useState<{ [key: string]: { name: string; price: number }[] }>({});
  const [user, setUser] = useState<User|null>(null)
  const navigate = useNavigate()
  useEffect(() => {
    const getAllMenuItems = async () => {
      if (restaurant?.id) {
        const data = await getMenuItemsByRestaurantId(restaurant.id);
        setMenuItems(data);
        setIsLoading(false);
      }
    };
    getAllMenuItems();
  }, [id]);

  useEffect(() => {
    setFilteredItems(
      selectedCategory === "All"
        ? menuItems
        : menuItems.filter((item) => item.categoryName === selectedCategory)
    );
  }, [selectedCategory, menuItems]);

  const handleExtraToggle = (itemId: string, extra: { name: string; price: number }) => {
    setSelectedExtrasMap((prev) => {
      const selected = prev[itemId] || [];
      const exists = selected.find((e) => e.name === extra.name);
      return {
        ...prev,  
        [itemId]: exists
          ? selected.filter((e) => e.name !== extra.name)
          : [...selected, extra],
      };
    });
  };

  useEffect(() =>{
    const getUser = async()=>{
      const data = await getUserByJwt();
      setUser(data)
    }
    getUser()
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading restaurant menu...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Restaurant not found</h2>
          <p className="text-gray-600">The restaurant you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }


  const categories = [
    "All",
    ...Array.from(new Set(menuItems.map((item) => item.categoryName))),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="relative h-80 overflow-hidden">
        <Box
          component="img"
          src={restaurant.images[0]?.url}
          alt={restaurant.name}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.3s",
            "&:hover": { transform: "scale(1.05)" },
          }}
        />
        <div className="absolute inset-0 bg-black opacity-40" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">{restaurant.name}</h1>
            <div className="flex flex-col gap-2 mb-3">
              <div className="flex flex-wrap gap-3 text-sm">
                <Phone className="w-4 h-4" /> {restaurant.contactInfo.phone}
                <Instagram className="w-4 h-4" /> {restaurant.contactInfo.instagram}
                <WhatsApp className="w-4 h-4" /> {restaurant.contactInfo.whatsApp}
              </div>
              <div className="flex items-center gap-1 text-sm">
                <FmdGood className="w-4 h-4" />
                {restaurant.address.cityName}, {restaurant.address.streetName}
              </div>
            </div>
            <p className="max-w-2xl text-lg">{restaurant.description}</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FilterAlt className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-800">Filter by Category</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category, i) => (
              <Button
                key={i}
                variant={selectedCategory === category ? "contained" : "outlined"}
                onClick={() => setSelectedCategory(category)}
                sx={{
                  borderRadius: "1rem",
                  color: selectedCategory === category ? "white" : "black",
                  background: selectedCategory === category
                    ? "linear-gradient(to right, #f97316, #ef4444)"
                    : "white",
                }}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <Divider sx={{ marginBottom: 5 }} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="group rounded-2xl overflow-hidden">
              {item.images[0] && (
                <img
                  src={item.images[0].url}
                  alt={item.foodName}
                  className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                />
              )}
              <CardContent>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.foodName}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-3">{item.description}</p>

                {item.extrasList.length > 0 && (
                  <div className="mb-3">
                    <p className="font-medium text-gray-800 mb-1">Extras:</p>
                    <div className="space-y-1">
                      {item.extrasList.map((extra, idx) => (
                        <label key={idx} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={selectedExtrasMap[item.id]?.some((e) => e.name === extra.name) || false}
                            onChange={() => handleExtraToggle(item.id, extra)}
                          />
                          {extra.name} <span className="text-orange-600">+${extra.price.toFixed(2)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-orange-600">
                    ${item.price.toFixed(2)}
                  </span>
                  <Button
                    size="small"
                    onClick={async () => {
                      const extras = selectedExtrasMap[item.id] || [];
                      
                      try {
                        await addItemToCart({
                          foodId: Number(item.id),
                          quantity: 1,
                          extrasIds: extras.map((e) => {
                            const match = item.extrasList.find((x) => x.name === e.name);
                            return match ? match.id : 0; 
                          }).filter((id) => id !== 0)
                        });
                        if (user) {
                          navigate(`/user/cart/${user.id}`);
                        }
                        alert("Item added to cart!");
                      } catch (err) {
                        alert("Failed to add item to cart.");
                        console.error(err);
                      }
                    }}
                    
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    sx={{
                      borderRadius: "1rem",
                      px: 1,
                      color: "white",
                      fontWeight: "bold",
                      textTransform: "none",
                    }}
                  >
                    <Add className="w-4 h-4 mr-1" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No items found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantMenu;
