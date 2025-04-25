import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Box, Typography } from "@mui/material";

const API_LOGOUT_URL = "https://ancient-guillema-omaradel562-327b81ec.koyeb.app/mana/logout";

const LogOut = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Retrieve the token from localStorage
        const userToken = localStorage.getItem("userToken");
        if (!userToken) {
          throw new Error("User is not authenticated.");
        }

        // Make the logout API request
        await axios.post(
          API_LOGOUT_URL,
          {},
          {
            headers: { token: userToken },

          }
        );

        // Clear the token from localStorage
        localStorage.removeItem("userToken");

        // Redirect to login page after logout
        navigate("/login");
      } catch (err) {
        console.error("Logout failed:", err.message);
        // Redirect to login page even if logout fails
        navigate("/login");
      }
    };

    performLogout();
  }, [navigate]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 4 }}>
      <CircularProgress />
      <Typography variant="body1" sx={{ mt: 2 }}>
        Logging out...
      </Typography>
    </Box>
  );
};

export default LogOut;