import React, { useContext } from "react";
import { LoadingContext } from "../context/LoadingContext.jsx";

const Loader = () => {
  const { loading } = useContext(LoadingContext);
  if (!loading) return null;
  return (
    <div className="loader-overlay">
      <div className="loader-spinner"></div>
    </div>
  );
};

export default Loader;
