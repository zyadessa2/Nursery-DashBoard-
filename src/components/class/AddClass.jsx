import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = "https://ancient-guillema-omaradel562-327b81ec.koyeb.app/class/addclass";

const AddClass = () => {
  const [className, setClassName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!className.trim()) {
      toast.error("Class name is required!");
      return;
    }

    try {
      setLoading(true);

      // Retrieve the token from localStorage
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        throw new Error("User is not authenticated. Please log in.");
      }

      // Make the API request
      await axios.post(
        API_BASE_URL,
        { name: className },
        {
            headers: { token: userToken },
        }
      );

      toast.success("Class added successfully!");
      setClassName(""); // Clear the input field
    } catch (err) {
      console.error("API Error:", err.message);
      toast.error(err.response?.data?.message || "Failed to add class. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: "400px", mx: "auto" }}>
      <ToastContainer />
      <Typography variant="h4" gutterBottom>
        Add Class
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Class Name"
          variant="outlined"
          fullWidth
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ py: 1.5 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Add Class"}
        </Button>
      </form>
    </Box>
  );
};

export default AddClass;