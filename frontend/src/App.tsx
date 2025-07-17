import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { TooltipProvider } from "./components/ui/ToolTipProivder";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import Restaurants from "./components/restaurant/Restaurants";
import RestaurantMenu from "./components/restaurant/RestaurantMenu";
import RestaurantManagement from "./components/restaurant/RestaurantManagement";
import OrderManagement from "./components/restaurant/OrderManagement";
import UserProfile from "./components/user/EditUser";
import UserOverview from "./components/user/Profile";
import Cart from "./pages/CartPage";
import AdminDashboard from "./components/admin/AdminDashboard";
import PrivateRoute from "./pages/routes/PrivateRoute";
import PublicRoute from "./pages/routes/PublicRoute";
import { useEffect } from "react";
import { checkTokenExpiry } from "./server/server";
import RestaurantSidebar from "./components/restaurant/RestaurantSidebar";
import Orders from "./components/user/Orders";
import { useTranslation } from "react-i18next";

const queryClient = new QueryClient();


const App = () => {

  const {t, i18n} = useTranslation()

  const languages =[
    {code:"en", name:"En"},
    {code:"tr", name:"Tr"}
  ]


  useEffect(() => {
    checkTokenExpiry();
  });
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Navbar i18n={i18n} languages={languages} />
          <Routes>
            <Route path="/" element={<PublicRoute element={<Index t={t} />} />} />
            <Route
              path="/login"
              element={<PublicRoute element={<Login t={t} />} />}
            />
            <Route
              path="/register"
              element={<PublicRoute element={<Register t={t} />} />}
            />
            <Route
              path="/home"
              element={<PrivateRoute element={<HomePage t={t} />} />}
            />
            <Route
              path="/restaurants"
              element={<PrivateRoute element={<Restaurants t={t} />} />}
            />
            <Route
              path="/restaurants/:id"
              element={<PrivateRoute element={<RestaurantMenu t={t} />} />}
            />
            <Route
              path="/owner/restaurant"
              element={<PrivateRoute element={<RestaurantManagement />} />}
            />
            <Route
              path="/owner/order"
              element={<PrivateRoute element={<OrderManagement />} />}
            />
            <Route
              path="/user/profile"
              element={<PrivateRoute element={<UserOverview />} />}
            />
            <Route
              path="/user/edit"
              element={<PrivateRoute element={<UserProfile />} />}
            />
            <Route
              path="/user/cart/:id"
              element={<PrivateRoute element={<Cart />} />}
            />
            <Route path="/user/orders/:id" element={<PrivateRoute element={<Orders />} />} />
            <Route
              path="/admin/dashboard"
              element={<PrivateRoute element={<AdminDashboard />} />}
            />
            <Route path="/restaurant/dashboard" element={<PrivateRoute element={<RestaurantSidebar />} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          {/* <Footer /> */}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
