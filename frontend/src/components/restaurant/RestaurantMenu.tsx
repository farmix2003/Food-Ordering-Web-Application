import {
  Add,
  FilterAlt,
  FmdGood,
  Instagram,
  LocationOn,
  LockClock,
  PlusOne,
  Star,
  WhatsApp,
} from "@mui/icons-material";
import { Badge, Box, Button, Card, CardContent, Divider } from "@mui/material";
import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { getMenuItemsByRestaurantId, getRestaurantById } from "../../server/server";
import { Phone } from "lucide-react";

interface Image{
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
  foods:MenuItem[]
}

interface MenuItem {
  id: string;
  foodName: string;
  price: number;
  images: Image[];
  description: string;
  extrasList: { name: string; price: number }[];
  available:boolean;
  categoryName:string;
  restaurantId:number;

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
  console.log(restaurant1);
 
   const getAllMenuItems = async() =>{
      const data = await getMenuItemsByRestaurantId(restaurant?.id||0)
      setMenuItems(data)
      console.log(data)
    }

  const categories = [
    "All",
    ...Array.from(new Set(menuItems.map((item) => item?.categoryName))),
  ];

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      
      setIsLoading(false);
    };
    getAllMenuItems()

    fetchData();
  }, [id]);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredItems(menuItems);
    } else {
      setFilteredItems(
        (menuItems ?? []).filter((item) => item.categoryName === selectedCategory)
      );
    }
  }, [selectedCategory, menuItems]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : index < rating
            ? "fill-yellow-200 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading restaurant menu...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Restaurant not found
          </h2>
          <p className="text-gray-600">
            The restaurant you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Hero Section */}
      <div className="relative h-80 overflow-hidden">
        <Box
          component="img"
          src={restaurant.images[0].url}
          alt={restaurant?.name}
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
            <div className="flex items-center gap-4 mb-3 flex-wrap">
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                <span className="text-sm">{restaurant.contactInfo.phone}</span>
                <Instagram className="w-4 h-4" />
                <span className="text-sm">{restaurant.contactInfo.instagram}</span>
                <WhatsApp className="w-4 h-4" />
                <span className="text-sm">{restaurant.contactInfo.whatsApp}</span>
              </div>
              <div className="flex items-center gap-1">
                <FmdGood className="w-4 h-4" />
                <span className="text-sm">{restaurant.address.cityName + restaurant.address.streetName}</span>
              </div>
            </div>
            <p className="text-lg mb-3 max-w-2xl">{restaurant.description}</p>
          
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FilterAlt className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              Filter by Category
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category,i) => (
              <Button
                key={i}
                variant={
                  selectedCategory === category ? "contained" : "outlined"
                }
                sx={{
                  borderRadius: "1rem",
                  backgroundColor: "white",
                  borderColor: "gray",
                  color: selectedCategory === category ? "white" : "black",
                  fontWeight: selectedCategory === category ? "bold" : "normal",
                }}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-4xl  ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    : "hover:bg-orange-50"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <Divider sx={{ marginBottom: 5 }} />

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 rounded-2xl md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
              sx={{
                ":hover": {
                  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
                  transform: "translateY(-2px)",
                },
                borderRadius: "1rem",
                animationDuration: "0.3s",
                animationName: "fadeIn",
                animationTimingFunction: "ease-in-out",
                animationFillMode: "forwards",
              }}
            >
              <div className="relative">
               {item.images?.map(img =>(
                 <img
                 src={img.url}
                 alt={item.foodName}
                 className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
               />
               ))}
                
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {item.foodName}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {item.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-orange-600">
                    ${item.price.toFixed(2)}
                  </span>
                  <Button
                    size="small"
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-colors duration-300"
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

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No items found in this category.
            </p>
          </div>
        )}

        {/* Extras Section */}
        {/* <div className="mt-16">
          <Divider className="mb-8" sx={{ mb: 5 }} />
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Extras</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((extra) => (
              <Card
                key={extra.id}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                sx={{
                  ":hover": {
                    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
                    transform: "translateY(-2px)",
                  },
                  borderRadius: "1rem",
                  animationDuration: "0.3s",
                  animationName: "fadeIn",
                  animationTimingFunction: "ease-in-out",
                  animationFillMode: "forwards",
                }}
              >
                <div className="relative">
                  <img
                    src={extra.image}
                    alt={extra.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    {extra.isVegetarian && (
                      <Badge className="bg-green-500 hover:bg-green-600">
                        Vegetarian
                      </Badge>
                    )}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {extra.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {extra.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-orange-600">
                      ${extra.price.toFixed(2)}
                    </span>
                    <Button
                      size="small"
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-colors duration-300"
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
        </div> */}
      </div>
    </div>
  );
};

export default RestaurantMenu;
