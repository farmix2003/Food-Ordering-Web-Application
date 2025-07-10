import { useEffect, useMemo, useState } from "react";
import { cancelOrder, getUserByJwt, getUserOrders } from "../../server/server";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/seperator";
import { CurrencyLira } from "@mui/icons-material";
import { Button } from "../ui/button";
import { Box } from "@mui/material";

interface Extras {
  id: number;
  name: string;
  price: string;
}

interface Menu {
  id: number;
  foodName: string;
  price: number;
  imagesList?: {
    url: string;
  }[];
}

interface OrderedFood {
  id: number;
  food: Menu;
  quantity: number;
  totalPrice: number;
  extras: Extras[];
}

interface Address {
  streetName: string;
  apartment: string;
  cityName: string;
}

interface Order {
  id: number;
  createdAt: string;
  totalPrice: number;
  totalOfOrder: number;
  orderStatus: string;
  orderedFoodList: OrderedFood[];
  user:{addressList: Address[]};
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    try {
      const user = await getUserByJwt();
      const data = await getUserOrders(user.id);
      setOrders(data);
      console.log(data)
    } catch (error) {
      toast.error("Failed to fetch orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);


  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "text-yellow-600 bg-yellow-100";
      case "COMPLETED":
        return "text-green-600 bg-green-100";
      case "CANCELLED":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const handleCancelOrder = (orderId: number) => {
     cancelOrder(orderId)
     fetchOrders()
    toast.info(`Cancel requested for order #${orderId}`);
  };
 
  useMemo(() =>{
    fetchOrders()
  },[])

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center mt-16">
        <h2 className="text-2xl font-bold">No Orders Found</h2>
        <p className="text-gray-600 mt-2">Place your first order to see it here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
      {orders.map((order) => (
        <Card key={order.id} className="mb-6 shadow-sm">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <div>
                <span className="text-xl font-semibold">Order #{order.id}</span>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  order.orderStatus
                )}`}
              >
                {order.orderStatus}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
          { order.user &&
              <div className="mb-2 text-sm text-gray-700">
              {order.user.addressList.map((item, idx) => (
                <div key={idx}>
                  <strong>Address:</strong> {item.apartment},{" "}
                  {item.streetName},{" "}
                  {item.cityName}
                </div>
              ))}
              </div>
}  
          

            <Separator className="my-3" />

            {order.orderedFoodList.map((item) => (
              <div key={item.id} className="flex items-start gap-4 mb-4">
                {item.food.imagesList && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden">
                    <Box
                      component="img"
                      src={item.food.imagesList[0].url}
                      alt={item.food.foodName}
                      width="100%"
                      height="100%"
                      sx={{ objectFit: "cover" }}
                    />
                  </div>
                )}
                <div className="flex-1 text-sm">
                  <div className="font-semibold">{item.food.foodName}</div>
                  <div className="text-gray-600">
                    Quantity: {item.quantity} × <CurrencyLira fontSize="small" />
                    {item.totalPrice.toFixed(2)}
                  </div>
                  {item.extras?.length > 0 && (
                    <p className="text-xs text-gray-500">
                      + Extras: {item.extras.map((e) => e.name).join(", ")}
                    </p>
                  )}
                </div>
                <p>{}</p>
              </div>
            ))}

            <Separator className="my-3" />

            <div className="flex justify-between text-sm font-semibold">
              <span>Total Items: {order.totalOfOrder}</span>
              <span>
                Total: <CurrencyLira fontSize="small" />{" "}
                {order.totalPrice.toFixed(2)}
              </span>
            </div>

            {order.orderStatus === "PENDING" && (
              <div className="mt-4 text-right">
                <Button
                  variant="destructive"
                  className="border-red-500 border-2 rounded-4xl text-red-500 hover:bg-red-500 hover:text-white font-bolder"
                  onClick={() => handleCancelOrder(order.id)}
                >
                  Cancel Order
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Orders;
