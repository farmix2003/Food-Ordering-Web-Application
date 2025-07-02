import React from "react";

import { Navigate } from "react-router-dom";
type PublicRouteProps = {
  element: React.ReactElement;
};

const PublicRoute = ({ element }: PublicRouteProps) => {
  const isAuthenticated = !!localStorage.getItem("token");

  return !isAuthenticated ? element : <Navigate to="/home" replace />;
};

export default PublicRoute;
