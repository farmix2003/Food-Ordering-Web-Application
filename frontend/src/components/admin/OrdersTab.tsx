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
import { getAllOrders } from "../../server/server";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface Order {
  id: number;
  user: {id:number, username:string};
  restaurant: {id:number, name:string};
  totalPrice: number;
  orderStatus: "PENDING" | "PREPARING" | "ON_WAY" | "DELIVERED" | "CANCELED";
  createdAt: string;
}

const OrdersTab = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const {t} = useTranslation()
  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "success";
      case "PREPARING":
        return "info";
      case "ON_WAY":
        return "primary";
      case "PENDING":
        return "warning";
      case "CANCELED":
        return "error";
      default:
        return "default";
    }
  };

  const getOrders = async() =>{
   const data = await getAllOrders();
   console.log(data);
   setOrders(data)
  }
  useEffect(()=>{
    getOrders()
  },[])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "TRY",
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
        {t("ordersManagement")}
      </Typography>

      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table sx={{ minWidth: 650 }} aria-label="orders table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.main" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                {t("id")}
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                {t('customer')}
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                {t('restaurant')}
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                {'total'}
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Status
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                {t('orderDate')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
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
                <TableCell>{order.user.username}</TableCell>
                <TableCell sx={{ fontWeight: "medium" }}>
                  {order.restaurant.name}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "success.main" }}>
                  {formatCurrency(order.totalPrice)}
                </TableCell>
                <TableCell>
                  <Chip
                    label={order.orderStatus}
                    color={getStatusColor(order.orderStatus)}
                    variant="outlined"
                    sx={{ fontWeight: "medium", textTransform: "capitalize" }}
                  />
                </TableCell>
                <TableCell sx={{ color: "text.secondary" }}>
                  {formatDate(order.createdAt)}
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
          {t("totalOrders",{orderLength:orders.length})}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", fontWeight: "medium" }}
        >
          {t("totalRevenue")}
          {formatCurrency(
            orders.reduce((sum, order) => sum + order.totalPrice, 0)
          )}
        </Typography>
      </Box>
    </Box>
  );
};

export default OrdersTab;
