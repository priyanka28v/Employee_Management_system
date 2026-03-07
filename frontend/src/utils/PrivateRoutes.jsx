// import React from "react";
// import { useAuth } from "../context/authContext";
// import { Navigate } from "react-router-dom";

// const PrivateRoutes = ({ children }) => {
//   const { user, loading } = useAuth();
//   if (loading) {
//     return <div>Loading....</div>;
//   }
//   return user ? children : <Navigate to="/login" />;
// };

// export default PrivateRoutes;
import React from "react";
import { useAuth } from "../context/authContext";
import { Navigate } from "react-router-dom";

const PrivateRoutes = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoutes;
