import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export const LoadingContext = createContext({ loading: false });

export const LoadingProvider = ({ children }) => {
  const [loadingCount, setLoadingCount] = useState(0);
  const loading = loadingCount > 0;

  useEffect(() => {
    // Request interceptor – increment loader counter
    const reqInterceptor = axios.interceptors.request.use((config) => {
      setLoadingCount((c) => c + 1);
      return config;
    });

    // Response interceptor – decrement counter and handle success / error alerts
    const resInterceptor = axios.interceptors.response.use(
      (response) => {
        setLoadingCount((c) => Math.max(c - 1, 0));
        // If a request explicitly provided a success toast message, show it
        if (response.config && response.config.showSuccessMessage) {
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: response.config.showSuccessMessage,
            timer: 1500,
            showConfirmButton: false,
          });
        }
        return response;
      },
      (error) => {
        setLoadingCount((c) => Math.max(c - 1, 0));
        const msg =
          (error.response && error.response.data && error.response.data.error) ||
          error.message ||
          "An error occurred";
        Swal.fire({
          icon: "error",
          title: "Error",
          text: msg,
        });
        return Promise.reject(error);
      }
    );

    // Cleanup interceptors on unmount
    return () => {
      axios.interceptors.request.eject(reqInterceptor);
      axios.interceptors.response.eject(resInterceptor);
    };
  }, []);

  return (
    <LoadingContext.Provider value={{ loading }}>
      {children}
    </LoadingContext.Provider>
  );
};
