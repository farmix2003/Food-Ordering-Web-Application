import { ChevronLeft } from "@mui/icons-material";
import { Box, Card, CardContent } from "@mui/material";
import { useState } from "react";
import OrderCard from "./OrderCard";

type OrderStatus = "Pending" | "Preparing" | "Out for Delivery" | "Delivered";

interface OrderItem {
  name: string;
  quantity: number;
}

interface Order {
  id: string;
  customerName: string;
  address: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
}

const OrderManagement = () => {

  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD-001",
      customerName: "Sarah Johnson",
      address: "123 Main St, Downtown, City 12345",
      items: [
        { name: "Margherita Pizza", quantity: 2 },
        { name: "Caesar Salad", quantity: 1 },
        { name: "Garlic Bread", quantity: 1 },
      ],
      total: 32.5,
      status: "Pending",
    },
    {
      id: "ORD-002",
      customerName: "Mike Chen",
      address: "456 Oak Ave, Midtown, City 67890",
      items: [
        { name: "Chicken Alfredo", quantity: 1 },
        { name: "Tiramisu", quantity: 2 },
      ],
      total: 28.99,
      status: "Preparing",
    },
    {
      id: "ORD-003",
      customerName: "Emily Rodriguez",
      address: "789 Pine Rd, Uptown, City 54321",
      items: [
        { name: "BBQ Burger", quantity: 1 },
        { name: "Sweet Potato Fries", quantity: 1 },
        { name: "Chocolate Shake", quantity: 1 },
      ],
      total: 24.75,
      status: "Out for Delivery",
    },
    {
      id: "ORD-004",
      customerName: "David Kim",
      address: "321 Elm St, Eastside, City 98765",
      items: [
        { name: "Vegetarian Wrap", quantity: 2 },
        { name: "Fresh Juice", quantity: 2 },
      ],
      total: 19.5,
      status: "Delivered",
    },
    {
      id: "ORD-005",
      customerName: "Lisa Thompson",
      address: "654 Maple Dr, Westside, City 13579",
      items: [
        { name: "Spaghetti Carbonara", quantity: 1 },
        { name: "Bruschetta", quantity: 1 },
        { name: "Italian Soda", quantity: 1 },
      ],
      total: 26.25,
      status: "Pending",
    },
  ]);

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const getStatusCounts = () => {
    return orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
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
                count: statusCounts.Pending || 0,
                color: "border-orange-400 bg-orange-50",
              },
              {
                status: "Preparing",
                count: statusCounts.Preparing || 0,
                color: "border-blue-400 bg-blue-50",
              },
              {
                status: "Out for Delivery",
                count: statusCounts["Out for Delivery"] || 0,
                color: "border-red-400 bg-red-50",
              },
              {
                status: "Delivered",
                count: statusCounts.Delivered || 0,
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
