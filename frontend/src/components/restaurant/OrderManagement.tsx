import { ChevronLeft } from "@mui/icons-material";
import { Box, Card, CardContent } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import OrderCard from "./OrderCard";
import { changeOrderStatus, getRestaurantByUserId, getRestaurantOrders } from "../../server/server";

type OrderStatus = "PENDING" | "PREPARING" | "COMPLETED" | "ON_WAY" | "DELIVERED" | "CANCELED";

interface OrderItem {
  name: string;
  quantity: number;
}
interface Extras{
  id:number,

}
interface Image{
  id:number;
  url:string;
}

interface Food{
  id:number;
  extrasList:Extras[],
   foodName:string,
   imagesList:Image[]
   price:number
}
interface Address{
  id:number;
  apartment:string;
  cityName:string;
  streetName:string;
}

interface User{
  id:number;
  username:string;
  phoneNumber:string;
  whatsAppNumber:string;
}

interface Order {
  id: number;
  customerName: string;
  shippingAddress: Address;
  items: OrderItem[];
  totalOfOrder: number;
  orderStatus: OrderStatus;
  orderedFoodList:{id:number, quantity:number, totalPrice:number, food:Food}[]
  user:User;
  totalPrice:number
}
interface Restaurant{
  id:number
}

const OrderManagement = () => {

  const [orders, setOrders] = useState<Order[]>([]);
  const [restaurant,setRestaurant] = useState<Restaurant>()

  const getRestaurant = async () =>{
      const data = await getRestaurantByUserId();
      setRestaurant(data)
  }

  
  const getRestaurantOrder = async() =>{
    if(restaurant?.id){
      const data = await getRestaurantOrders(restaurant?.id)
      console.log(data)
      setOrders(data)
    }
  }
  useEffect(() =>{
   getRestaurant()
  },[])
 useEffect(() => {
  if (restaurant?.id) {
    getRestaurantOrder();
  }
}, [restaurant]);


  const updateOrderStatus = async(orderId: number, newStatus: OrderStatus) => {
    await changeOrderStatus(orderId, newStatus)
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    getRestaurantOrder()
  };
 useMemo(()=>{
  getRestaurantOrder()
 },[])

  const getStatusCounts = () => {
    return orders.reduce((acc, order) => {
      acc[order.orderStatus] = (acc[order.orderStatus] || 0) + 1;
      return acc;
    }, {} as Record<OrderStatus, number>);
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Restaurant Orders
          </h2>
          <p className="text-gray-600 mb-6">
            Manage incoming orders and update delivery status
          </p>

          {/* Status Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                status: "Pending",
                count: statusCounts.PENDING || 0,
                color: "border-orange-400 bg-orange-50",
              },
              {
                status:"Preparing",
                count: statusCounts.PREPARING || 0,
                color: "border-gray-400 bg-gray-200"
              },
              {
                status: "On Way",
                count: statusCounts["ON_WAY"] || 0,
                color: "border-red-400 bg-red-50",
              },
              {
                status: "Delivered",
                count: statusCounts.DELIVERED || 0,
                color: "border-green-400 bg-green-50",
              },
            ].map(({ status, count, color }) => (
              <Card key={status} className={`${color} border-l-4`}>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {count}
                    </div>
                    <div className="text-sm text-gray-600">{status}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <ChevronLeft className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <Box component={"h6"} className="text-xl text-gray-600 mb-2">
                No orders yet
              </Box>
              <Box component={"p"} className="text-gray-500 mb-4">
                New orders will appear here when customers place them.
              </Box>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onStatusUpdate={updateOrderStatus}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
