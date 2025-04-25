import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = "https://ancient-guillema-omaradel562-327b81ec.koyeb.app/schedule";

const Schedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updatedUserId, setUpdatedUserId] = useState("");
  const [updatedImage, setUpdatedImage] = useState(null);
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState("");

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);

        // Retrieve the token from localStorage
        const userToken = localStorage.getItem("userToken");
        if (!userToken) {
          throw new Error("User is not authenticated. Please log in.");
        }

        // Make the API request with the Authorization header
        const response = await axios.get(API_BASE_URL, {
            headers: { token: userToken },
        });

        setSchedules(response.data.data || []);
        setFilteredSchedules(response.data.data || []); // Initialize filtered schedules
      } catch (err) {
        console.error("API Error:", err.message);
        toast.error(err.response?.data?.message || "Failed to fetch schedules. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  // Handle search input change
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = schedules.filter((schedule) =>
      schedule.userId.toLowerCase().includes(value)
    );
    setFilteredSchedules(filtered);
  };

  // Handle image preview
  const handleImagePreview = (imageUrl) => {
    setPreviewImageUrl(imageUrl);
    setImagePreviewOpen(true);
  };

  const handleImagePreviewClose = () => {
    setPreviewImageUrl("");
    setImagePreviewOpen(false);
  };

  // Handle delete action
  const handleDelete = async (scheduleId) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        throw new Error("User is not authenticated. Please log in.");
      }

      await axios.delete(`${API_BASE_URL}/${scheduleId}`, {
        headers: { token: userToken },
      });

      // Remove the deleted schedule from the state
      setSchedules(schedules.filter((schedule) => schedule._id !== scheduleId));
      setFilteredSchedules(filteredSchedules.filter((schedule) => schedule._id !== scheduleId));
      toast.success("Schedule deleted successfully!");
    } catch (err) {
      console.error("Failed to delete schedule:", err.message);
      toast.error(err.response?.data?.message || "Failed to delete schedule. Please try again.");
    }
  };

  // Handle update dialog open
  const handleUpdateDialogOpen = (schedule) => {
    setSelectedSchedule(schedule);
    setUpdatedUserId(schedule.userId);
    setUpdateDialogOpen(true);
  };

  // Handle update dialog close
  const handleUpdateDialogClose = () => {
    setSelectedSchedule(null);
    setUpdatedUserId("");
    setUpdatedImage(null);
    setUpdateDialogOpen(false);
  };

  // Handle update action
  const handleUpdate = async () => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        throw new Error("User is not authenticated. Please log in.");
      }

      const formData = new FormData();
      formData.append("userId", updatedUserId);
      if (updatedImage) {
        formData.append("image", updatedImage);
      }

      const response = await axios.put(
        `${API_BASE_URL}/${selectedSchedule._id}`,
        formData,
        {
          headers: {
            token: userToken,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update the schedule in the state
      setSchedules(
        schedules.map((schedule) =>
          schedule._id === selectedSchedule._id ? response.data.data : schedule
        )
      );
      setFilteredSchedules(
        filteredSchedules.map((schedule) =>
          schedule._id === selectedSchedule._id ? response.data.data : schedule
        )
      );

      toast.success("Schedule updated successfully!");
      handleUpdateDialogClose();
    } catch (err) {
      console.error("Failed to update schedule:", err.message);
      toast.error(err.response?.data?.message || "Failed to update schedule. Please try again.");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <ToastContainer />
      <Typography variant="h4" gutterBottom>
        Schedules List
      </Typography>

      {/* Search Bar */}
      <TextField
        label="Search by User ID"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearch}
        sx={{ mb: 2, width: "300px" }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Schedule ID</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSchedules.map((schedule) => (
              <TableRow key={schedule._id}>
                <TableCell>{schedule._id}</TableCell>
                <TableCell>{schedule.userId}</TableCell>
                <TableCell>
                  <img
                    src={schedule.image.secure_url}
                    alt="Schedule"
                    style={{ width: "100px", height: "auto", cursor: "pointer" }}
                    onClick={() => handleImagePreview(schedule.image.secure_url)}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={() => handleUpdateDialogOpen(schedule)}
                    sx={{ mr: 1 }}
                  >
                    Update
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(schedule._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Image Preview Dialog */}
      <Dialog open={imagePreviewOpen} onClose={handleImagePreviewClose}>
        <DialogContent>
          <img
            src={previewImageUrl}
            alt="Preview"
            style={{ width: "100%", height: "auto" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleImagePreviewClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Dialog */}
      {selectedSchedule && (
        <Dialog open={updateDialogOpen} onClose={handleUpdateDialogClose}>
          <DialogTitle>Update Schedule</DialogTitle>
          <DialogContent>
            <TextField
              label="User ID"
              variant="outlined"
              fullWidth
              value={updatedUserId}
              onChange={(e) => setUpdatedUserId(e.target.value)}
              sx={{ mt: 2 }}
            />
            <Button
              variant="contained"
              component="label"
              fullWidth
              sx={{ mt: 2 }}
            >
              Upload New Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => setUpdatedImage(e.target.files[0])}
              />
            </Button>
            {updatedImage && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected File: {updatedImage.name}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleUpdateDialogClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUpdate} color="primary" variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default Schedule;