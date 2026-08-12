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

  // if (!user) {
  //   // Show SweetAlert prompting login or signup
  //   import('sweetalert2').then(SwalModule => {
  //     const Swal = SwalModule.default;
  //     Swal.fire({
  //       title: 'Access Denied',
  //       text: 'You need to be logged in to view this page.',
  //       icon: 'warning',
  //       showCancelButton: true,
  //       confirmButtonText: 'Login',
  //       cancelButtonText: 'Signup',
  //       reverseButtons: true,
  //     }).then(result => {
  //       if (result.isConfirmed) {
  //         // Navigate to login
  //         window.location.href = '/login';
  //       } else if (result.dismiss === Swal.DismissReason.cancel) {
  //         // Navigate to signup
  //         window.location.href = '/signup';
  //       }
  //     });
  //   });
  //   // Render nothing while alert is shown
  //   return null;
  // }
  return children;
};

export default PrivateRoutes;
