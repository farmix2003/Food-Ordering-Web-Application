import {
  Add,
  FilterAlt,
  FmdGood,
  LockClock,
  PlusOne,
  Star,
} from "@mui/icons-material";
import { Badge, Box, Button, Card, CardContent, Divider } from "@mui/material";
import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isVegetarian?: boolean;
  isSpicy?: boolean;
}

interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  description: string;
  cuisine: string[];
  deliveryTime: string;
  location: string;
}

const mockRestaurant: Restaurant = {
  id: "1",
  name: "Bella Vista Italiana",
  image:
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=600&fit=crop",
  rating: 4.8,
  description:
    "Authentic Italian cuisine with a modern twist, featuring fresh ingredients and traditional recipes passed down through generations.",
  cuisine: ["Italian", "Mediterranean", "Fine Dining"],
  deliveryTime: "25-35 min",
  location: "Downtown, 2.3 km away",
};

const mockMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "Margherita Pizza",
    description:
      "Fresh mozzarella, basil, and tomato sauce on our signature thin crust",
    price: 18.99,
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
    category: "Pizza",
    isVegetarian: true,
  },
  {
    id: "2",
    name: "Truffle Risotto",
    description:
      "Creamy arborio rice with black truffle, parmesan, and wild mushrooms",
    price: 28.99,
    image:
      "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop",
    category: "Main Course",
    isVegetarian: true,
  },
  {
    id: "3",
    name: "Osso Buco",
    description: "Slow-braised veal shank with saffron risotto and gremolata",
    price: 32.99,
    image:
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop",
    category: "Main Course",
  },
  {
    id: "4",
    name: "Burrata Caprese",
    description:
      "Fresh burrata cheese with heirloom tomatoes, basil oil, and balsamic reduction",
    price: 16.99,
    image:
      "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=400&h=300&fit=crop",
    category: "Appetizer",
    isVegetarian: true,
  },
  {
    id: "5",
    name: "Tiramisu",
    description: "Classic Italian dessert with mascarpone, coffee, and cocoa",
    price: 9.99,
    image:
      "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop",
    category: "Dessert",
    isVegetarian: true,
  },
  {
    id: "6",
    name: "Seafood Linguine",
    description:
      "Fresh linguine with mussels, clams, shrimp, and white wine sauce",
    price: 26.99,
    image:
      "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400&h=300&fit=crop",
    category: "Pasta",
  },
  {
    id: "7",
    name: "Prosciutto Arancini",
    description: "Crispy risotto balls stuffed with prosciutto and mozzarella",
    price: 14.99,
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop",
    category: "Appetizer",
  },
  {
    id: "8",
    name: "Chianti Classico",
    description:
      "Full-bodied red wine from Tuscany, perfect with our meat dishes",
    price: 12.99,
    image:
      "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400&h=300&fit=crop",
    category: "Drinks",
  },
];

const mockExtras: MenuItem[] = [
  {
    id: "e1",
    name: "French Fries",
    description: "Crispy golden fries with sea salt",
    price: 4.99,
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop",
    category: "Sides",
  },
  {
    id: "e2",
    name: "Garlic Bread",
    description: "Toasted bread with garlic butter and herbs",
    price: 3.99,
    image:
      "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400&h=300&fit=crop",
    category: "Sides",
  },
  {
    id: "e3",
    name: "Cola",
    description: "Refreshing cola drink, 330ml",
    price: 2.99,
    image:
      "https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400&h=300&fit=crop",
    category: "Drinks",
  },
  {
    id: "e4",
    name: "Sparkling Water",
    description: "San Pellegrino sparkling water, 500ml",
    price: 3.49,
    image:
      "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=300&fit=crop",
    category: "Drinks",
  },
  {
    id: "e5",
    name: "Side Salad",
    description: "Fresh mixed greens with balsamic vinaigrette",
    price: 5.99,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
    category: "Sides",
    isVegetarian: true,
  },
  {
    id: "e6",
    name: "Espresso",
    description: "Rich Italian espresso coffee",
    price: 2.49,
    image:
      "https://images.unsplash.com/photo-1510707577919-f5b40faa28f0?w=400&h=300&fit=crop",
    category: "Drinks",
  },
];

const RestaurantMenu = () => {
  const { id } = useParams();
  const location = useLocation();
  const restaurant1 = location.state?.restaurant;
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(true);
  console.log(restaurant1);

  const categories = [
    "All",
    ...Array.from(new Set(mockMenuItems.map((item) => item.category))),
  ];

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setRestaurant(mockRestaurant);
      setMenuItems(mockMenuItems);
      setFilteredItems(mockMenuItems);
      setIsLoading(false);
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredItems(menuItems);
    } else {
      setFilteredItems(
        menuItems.filter((item) => item.category === selectedCategory)
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
        <div className="absolute inset-0 bg-black opacity-40" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">{restaurant1.name}</h1>
            <div className="flex items-center gap-4 mb-3 flex-wrap">
              <div className="flex items-center gap-1">
                {renderStars(restaurant1.rating)}
                <span className="ml-1 font-semibold">{restaurant1.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <LockClock className="w-4 h-4" />
                <span className="text-sm">{restaurant.deliveryTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <FmdGood className="w-4 h-4" />
                <span className="text-sm">{restaurant.location}</span>
              </div>
            </div>
            <p className="text-lg mb-3 max-w-2xl">{restaurant.description}</p>
            <div className="flex gap-2">
              {restaurant1.tags.map((type, index) => (
                <Badge
                  key={index}
                  className="bg-gray-200/25 rounded-2xl px-1 text-white"
                >
                  {type}
                </Badge>
              ))}
            </div>
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
            {categories.map((category) => (
              <Button
                key={category}
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
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  {item.isVegetarian && (
                    <Badge className="bg-green-500 hover:bg-green-600">
                      Vegetarian
                    </Badge>
                  )}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {item.name}
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
        <div className="mt-16">
          <Divider className="mb-8" sx={{ mb: 5 }} />
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Extras</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockExtras.map((extra) => (
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
        </div>
      </div>
    </div>
  );
};

export default RestaurantMenu;
