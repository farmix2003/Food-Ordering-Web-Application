import { CurrencyLira, LocationOn, Person, Receipt } from "@mui/icons-material";
import { Badge, Box, Card, CardContent, MenuItem, Select } from "@mui/material";

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

interface OrderCardProps {
  order: Order;
  onStatusUpdate: (orderId: string, newStatus: OrderStatus) => void;
}

const OrderCard = ({ order, onStatusUpdate }: OrderCardProps) => {
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "Pending":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Preparing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Out for Delivery":
        return "bg-red-100 text-red-800 border-red-200";
      case "Delivered":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getAvailableStatuses = (currentStatus: OrderStatus): OrderStatus[] => {
    const allStatuses: OrderStatus[] = [
      "Pending",
      "Preparing",
      "Out for Delivery",
      "Delivered",
    ];
    const currentIndex = allStatuses.indexOf(currentStatus);

    // Allow current status and any status that comes after it
    return allStatuses.slice(currentIndex);
  };

  const handleStatusChange = (newStatus: string) => {
    onStatusUpdate(order.id, newStatus as OrderStatus);
  };

  return (
    <Card
      className="h-full hover:shadow-lg transition-shadow duration-200"
      sx={{
        ":hover": {
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          transform: "translateY(-2px)",
          duration: "0.3s",
        },
      }}
    >
      <Box className="pb-4 p-4">
        {/* Order Header */}
        <div className="flex justify-between items-center">
          <Box component={"h6"} className="text-lg font-bold text-orange-600">
            {order.id}
          </Box>
          <Badge
            className={`${getStatusColor(
              order.status
            )} rounded-full px-3 py-1 text-sm font-medium`}
          >
            {order.status}
          </Badge>
        </div>
      </Box>

      <CardContent className="space-y-4">
        {/* Customer Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Person className="h-4 w-4 text-gray-500" />
            <span className="font-medium text-gray-900">
              {order.customerName}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <LocationOn className="h-4 w-4 text-gray-500 mt-0.5" />
            <span className="text-sm text-gray-600 leading-relaxed">
              {order.address}
            </span>
          </div>
        </div>

        <div className="border-t pt-4">
          {/* Order Items */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Receipt className="h-4 w-4 text-gray-500" />
              <span className="font-medium text-gray-900">Order Items</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 space-y-1">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="font-medium text-gray-900">{item.name}</span>
                  <span className="text-gray-600">x{item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          {/* Total */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CurrencyLira className="h-4 w-4 text-green-600" />
              <span className="text-xl font-bold text-green-600">
                ${order.total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Status Update Dropdown */}
          <div className="space-y-2">
            <label className="text-sm flex flex-col font-medium text-gray-900">
              Update Status
            </label>
            <Select
              value={order.status}
              onChange={(event) => handleStatusChange(event.target.value)}
              fullWidth
              sx={{
                "& .MuiSelect-select": {
                  padding: "8px 12px",
                },
              }}
            >
              {getAvailableStatuses(order.status).map((status) => (
                <MenuItem key={status} value={status}>
                  <Badge
                    className={`${getStatusColor(
                      status
                    )} rounded-full px-3 py-1 text-sm font-medium`}
                  >
                    {status}
                  </Badge>
                </MenuItem>
              ))}
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
