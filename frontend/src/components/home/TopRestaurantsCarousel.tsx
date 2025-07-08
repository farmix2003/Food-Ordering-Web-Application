
import { Button, Card, CardContent } from "@mui/material";
import { getAllRestaurants } from "../../server/server";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
}
interface RestaurantProps{
  restaurants: Restaurant[]|undefined
}



const TopRestaurantsGrid = ({restaurants}:RestaurantProps) => {

  const navigate = useNavigate()

 
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {
      restaurants?.filter((restaurant) => 
        restaurant.orders?.reduce((sum, order) => sum + (order.numberOfOrders || 0), 0) ==0
      )
      .map((restaurant) => (
        <Card
        key={restaurant.id}
      className={`relative transition-shadow duration-300 ${
        !restaurant.open ? "opacity-50 pointer-events-none" : "hover:shadow-lg"
      }`}
      sx={{
        ":hover": {
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          duration: 300,
        },
      }}
    >
      {/* Open/Closed Badge */}
      <div className="absolute top-2 left-2 z-10">
        <span
          className={`px-2 py-1 z-50 text-xs font-semibold rounded ${
            restaurant.open ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {restaurant.open ? "Open" : "Closed"}
        </span>
      </div>
    
      <CardContent className="p-0">
        <div className="aspect-[4/3] relative overflow-hidden rounded-t-lg">
          {restaurant.images.length > 0 ? (
            <img
              src={restaurant.images[0].url}
              alt={restaurant.name}
              className="w-full h-full object-cover"
              />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
        </div>
      </CardContent>
    
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{restaurant.name}</h3>
        </div>
        <p className="text-gray-600 text-sm mb-1">{restaurant.cuisineType}</p>
        <p className="text-gray-500 text-sm mb-3">{restaurant.contactInfo.phone}</p>
    
        <Button
          variant="contained"
          sx={{
            width: "100%",
            backgroundColor: "#f97316",
            color: "#fff",
            ":hover": { backgroundColor: "#ea580c" },
          }}
          onClick={() =>navigate(`/restaurants/${restaurant.id}`, {state: { restaurant: restaurants.find((r) => r.id === restaurant.id)}})}
          disabled={!restaurant.open}
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
