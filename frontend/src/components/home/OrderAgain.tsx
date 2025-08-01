import { RotateLeft } from "@mui/icons-material";
import { Button, Card, CardContent } from "@mui/material";
import { getUserByJwt, getUserOrders } from "../../server/server";
import { useEffect, useState } from "react";
import type { I18n } from "../../pages/Index";

interface PastOrder {
  id: string;
  restaurantName: string;
  items: string[];
  totalAmount: number;
  orderDate: string;
  image: string;
}

const fallbackOrders: PastOrder[] = [
  {
    id: "1",
    restaurantName: "Pizza Palace",
    items: ["Margherita Pizza", "Garlic Bread"],
    totalAmount: 18.5,
    orderDate: "2024-01-15",
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=300&fit=crop",
  },
  {
    id: "2",
    restaurantName: "Sushi Zen",
    items: ["California Roll", "Salmon Nigiri", "Miso Soup"],
    totalAmount: 28.75,
    orderDate: "2024-01-12",
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop",
  },
  {
    id: "3",
    restaurantName: "Burger House",
    items: ["Chicken Burger", "French Fries", "Coke"],
    totalAmount: 16.25,
    orderDate: "2024-01-10",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
  },
];

const OrderAgain = ({ t }: I18n) => {
  const [orders, setOrders] = useState<PastOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const user = await getUserByJwt();
      const data = await getUserOrders(user.id);
      console.log(data)
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(t("failedToLoadOrders") || "Failed to load orders.");
      setOrders(fallbackOrders); // fallback in case of error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleReorder = (order: PastOrder) => {
    console.log("Reordering:", order);
    // TODO: Implement reorder logic, e.g., add items to cart
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">{t("loading")}...</div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {error || t("noPreviousMessage")}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {orders.map((order) => (
        <Card
          key={order.id}
          sx={{
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            ":hover": {
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          <CardContent className="p-4">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={order.image}
                  alt={order.restaurantName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-lg mb-1">
                  {order.restaurantName}
                </h4>
                <p className="text-gray-600 text-sm mb-2 truncate">
                  {order.items.join(", ")}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-orange-600 font-bold">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                  <Button
                    onClick={() => handleReorder(order)}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderColor: "#fa7516",
                      color: "#fa7516",
                      ":hover": {
                        backgroundColor: "#fa7516",
                        color: "white",
                      },
                    }}
                    startIcon={<RotateLeft />}
                  >
                    {t("reorder")}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OrderAgain;
