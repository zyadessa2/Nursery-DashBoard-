import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  TextField,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Webcam from "react-webcam";

const CREATE_API = "https://ancient-guillema-omaradel562-327b81ec.koyeb.app/attendance/createattendance";
const LEAVE_API = "https://ancient-guillema-omaradel562-327b81ec.koyeb.app/attendance/leaveattendance";

const Attendance = () => {
  const [mode, setMode] = useState("create"); // Default mode is "create"
  const [image, setImage] = useState(null);
  const [userId, setUserId] = useState(""); // New state for userId
  const [loading, setLoading] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const webcamRef = useRef(null);

  // Handle mode change
  const handleModeChange = (event, newMode) => {
    if (newMode !== null) {
      setMode(newMode);
      setImage(null); // Reset image when mode changes
    }
  };

  // Handle capture from webcam
  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setImage(imageSrc);
      setCameraOpen(false); // Close the camera after capturing
      toast.info("Image captured successfully!");
    }
  };

  // Handle send action
  const handleSend = async () => {
    if (!image) {
      toast.error("Please capture an image first!");
      return;
    }

    if (!userId.trim()) {
      toast.error("Please enter a User ID!");
      return;
    }

    try {
      setLoading(true);

      // Retrieve the token from localStorage
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        throw new Error("User is not authenticated. Please log in.");
      }

      // Convert base64 image to a Blob
      const blob = await fetch(image).then((res) => res.blob());
      const formData = new FormData();
      formData.append("uploadedImage", blob, "attendance.jpg");
      formData.append("userId", userId); // Include userId in the request

      // Determine the API endpoint based on the mode
      const apiUrl = mode === "create" ? CREATE_API : LEAVE_API;

      // Make the API request
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
            headers: { token: userToken },
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to send attendance. Please try again.");
      }

      toast.success(`Attendance ${mode === "create" ? "created" : "left"} successfully!`);
      setImage(null); // Reset image after successful submission
      setUserId(""); // Reset userId after successful submission
    } catch (err) {
      console.error("Error:", err.message);
      toast.error(err.message || "Failed to send attendance. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: "400px", mx: "auto", textAlign: "center" }}>
      <ToastContainer />
      <Typography variant="h4" gutterBottom>
        Attendance
      </Typography>

      {/* Mode Toggle */}
      <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={handleModeChange}
        sx={{ mb: 3 }}
      >
        <ToggleButton value="create">Create</ToggleButton>
        <ToggleButton value="leave">Leave</ToggleButton>
      </ToggleButtonGroup>

      {/* User ID Input */}
      <TextField
        label="User ID"
        variant="outlined"
        fullWidth
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        sx={{ mb: 2 }}
      />

      {/* Open Camera */}
      {!cameraOpen && (
        <Button
          variant="contained"
          onClick={() => setCameraOpen(true)}
          fullWidth
          sx={{ mb: 2 }}
        >
          Open Camera
        </Button>
      )}

      {/* Webcam */}
      {cameraOpen && (
        <Box sx={{ mb: 2 }}>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width="100%"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCapture}
            sx={{ mt: 2 }}
          >
            Capture Photo
          </Button>
        </Box>
      )}

      {/* Display Captured Image */}
      {image && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Captured Image:
          </Typography>
          <img
            src={image}
            alt="Captured"
            style={{ width: "100%", height: "auto", borderRadius: "8px" }}
          />
        </Box>
      )}

      {/* Send Button */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSend}
        disabled={loading}
        sx={{ py: 1.5 }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Send"}
      </Button>
    </Box>
  );
};

export default Attendance;