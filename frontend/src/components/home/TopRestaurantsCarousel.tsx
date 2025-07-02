import { Star } from "@mui/icons-material";
import { Button, Card, CardContent } from "@mui/material";

interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  cuisine: string;
  deliveryTime: string;
}

const mockRestaurants: Restaurant[] = [
  {
    id: "1",
    name: "Pizza Palace",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
    rating: 4.5,
    cuisine: "Italian",
    deliveryTime: "25-35 min",
  },
  {
    id: "2",
    name: "Burger House",
    image:
      "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
    rating: 4.2,
    cuisine: "American",
    deliveryTime: "20-30 min",
  },
  {
    id: "3",
    name: "Sushi Zen",
    image:
      "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop",
    rating: 4.8,
    cuisine: "Japanese",
    deliveryTime: "30-40 min",
  },
  {
    id: "4",
    name: "Thai Garden",
    image:
      "https://plus.unsplash.com/premium_photo-1661610605309-77feabcc8772?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dGhhaSUyMGZvb2R8ZW58MHx8MHx8fDA%3D",
    rating: 4.3,
    cuisine: "Thai",
    deliveryTime: "25-35 min",
  },
  {
    id: "5",
    name: "Taco Express",
    image:
      "https://plus.unsplash.com/premium_photo-1681406995031-fe952f1e0858?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHRhY28lMjBleHByZXNzfGVufDB8fDB8fHww",
    rating: 4.1,
    cuisine: "Mexican",
    deliveryTime: "15-25 min",
  },
  {
    id: "6",
    name: "Pasta Corner",
    image:
      "https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGFzdGF8ZW58MHx8MHx8fDA%3D",
    rating: 4.4,
    cuisine: "Italian",
    deliveryTime: "20-30 min",
  },
];

const TopRestaurantsGrid = () => {
  const handleViewMenu = (restaurant: Restaurant) => {
    console.log("Viewing menu for:", restaurant.name);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockRestaurants.map((restaurant) => (
        <Card
          key={restaurant.id}
          className="hover:shadow-lg transition-shadow duration-300"
          sx={{
            ":hover": {
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              duration: 300,
            },
          }}
        >
          <CardContent className="p-0">
            <div className="aspect-[4/3] relative overflow-hidden rounded-t-lg">
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
            </div>
          </CardContent>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">{restaurant.name}</h3>
              <div className="flex items-center">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="text-sm font-medium">{restaurant.rating}</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">{restaurant.cuisine}</p>
            <p className="text-gray-500 text-sm mb-3">
              {restaurant.deliveryTime}
            </p>
            <Button
              onClick={() => handleViewMenu(restaurant)}
              variant="contained"
              sx={{
                width: "100%",
                backgroundColor: "#f97316",
                color: "#fff",
                ":hover": { backgroundColor: "#ea580c" },
              }}
            >
              View Menu
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TopRestaurantsGrid;
