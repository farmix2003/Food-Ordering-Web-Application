import type React from "react";
import { Navigate } from "react-router-dom";

type PrivateRouteProps = {
  element: React.ReactElement;
};

const PrivateRoute = ({ element }: PrivateRouteProps) => {
  const isAuthenticated = !!localStorage.getItem("token");

  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

export default PrivateRoute;
