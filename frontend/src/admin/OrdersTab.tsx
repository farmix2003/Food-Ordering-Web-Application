import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Box,
} from "@mui/material";

interface Order {
  id: number;
  userName: string;
  restaurant: string;
  total: number;
  status: "pending" | "confirmed" | "preparing" | "delivered" | "cancelled";
  orderDate: string;
}

const mockOrders: Order[] = [
  {
    id: 1001,
    userName: "John Doe",
    restaurant: "Pizza Palace",
    total: 25.99,
    status: "delivered",
    orderDate: "2024-06-20",
  },
  {
    id: 1002,
    userName: "Jane Smith",
    restaurant: "Sushi Express",
    total: 45.5,
    status: "preparing",
    orderDate: "2024-06-21",
  },
  {
    id: 1003,
    userName: "Bob Johnson",
    restaurant: "Burger Barn",
    total: 18.75,
    status: "confirmed",
    orderDate: "2024-06-21",
  },
  {
    id: 1004,
    userName: "Alice Brown",
    restaurant: "Taco Time",
    total: 32.25,
    status: "pending",
    orderDate: "2024-06-22",
  },
  {
    id: 1005,
    userName: "Charlie Wilson",
    restaurant: "Curry House",
    total: 28.9,
    status: "delivered",
    orderDate: "2024-06-20",
  },
  {
    id: 1006,
    userName: "Diana Davis",
    restaurant: "Greek Garden",
    total: 41.3,
    status: "cancelled",
    orderDate: "2024-06-21",
  },
  {
    id: 1007,
    userName: "Eva Martinez",
    restaurant: "BBQ Central",
    total: 55.8,
    status: "preparing",
    orderDate: "2024-06-22",
  },
  {
    id: 1008,
    userName: "Frank Garcia",
    restaurant: "Pizza Palace",
    total: 22.45,
    status: "confirmed",
    orderDate: "2024-06-22",
  },
];

const OrdersTab = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "success";
      case "preparing":
        return "info";
      case "confirmed":
        return "primary";
      case "pending":
        return "warning";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        Orders Management
      </Typography>

      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table sx={{ minWidth: 650 }} aria-label="orders table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.main" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Order ID
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Customer
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Restaurant
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Total
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Status
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Order Date
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockOrders.map((order) => (
              <TableRow
                key={order.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { backgroundColor: "action.hover" },
                }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ fontWeight: "medium" }}
                >
                  #{order.id}
                </TableCell>
                <TableCell>{order.userName}</TableCell>
                <TableCell sx={{ fontWeight: "medium" }}>
                  {order.restaurant}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "success.main" }}>
                  {formatCurrency(order.total)}
                </TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status)}
                    variant="outlined"
                    sx={{ fontWeight: "medium", textTransform: "capitalize" }}
                  />
                </TableCell>
                <TableCell sx={{ color: "text.secondary" }}>
                  {formatDate(order.orderDate)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          mt: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Total orders: {mockOrders.length}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", fontWeight: "medium" }}
        >
          Total revenue:{" "}
          {formatCurrency(
            mockOrders.reduce((sum, order) => sum + order.total, 0)
          )}
        </Typography>
      </Box>
    </Box>
  );
};

export default OrdersTab;
