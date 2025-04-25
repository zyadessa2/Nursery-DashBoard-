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

const API_BASE_URL = "https://ancient-guillema-omaradel562-327b81ec.koyeb.app/schedule/addschedule";

const AddSchedule = () => {
  const [userId, setUserId] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!userId.trim() || !image) {
      toast.error("Both User ID and Image are required!");
      return;
    }

    try {
      setLoading(true);

      // Retrieve the token from localStorage
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        throw new Error("User is not authenticated. Please log in.");
      }

      // Create form data
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("image", image);

      // Make the API request
      await axios.post(API_BASE_URL, formData, {
        headers: {
             token: userToken ,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Schedule added successfully!");
      setUserId(""); // Clear the input fields
      setImage(null);
    } catch (err) {
      console.error("API Error:", err.message);
      toast.error(err.response?.data?.message || "Failed to add schedule. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: "400px", mx: "auto" }}>
      <ToastContainer />
      <Typography variant="h4" gutterBottom>
        Add Schedule
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="User ID"
          variant="outlined"
          fullWidth
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          component="label"
          fullWidth
          sx={{ mb: 2 }}
        >
          Upload Image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </Button>
        {image && (
          <Typography variant="body2" sx={{ mb: 2 }}>
            Selected File: {image.name}
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ py: 1.5 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Add Schedule"}
        </Button>
      </form>
    </Box>
  );
};

export default AddSchedule;