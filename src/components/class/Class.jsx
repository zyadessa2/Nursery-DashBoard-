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

const API_BASE_URL = "https://ancient-guillema-omaradel562-327b81ec.koyeb.app/class";

const Class = () => {
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updatedClassName, setUpdatedClassName] = useState("");

  useEffect(() => {
    const fetchClasses = async () => {
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

        setClasses(response.data.data || []);
        setFilteredClasses(response.data.data || []); // Initialize filtered classes
      } catch (err) {
        console.error("API Error:", err.message);
        setError(err.response?.data?.message || "Failed to fetch classes. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  // Handle search input change
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = classes.filter((classItem) =>
      classItem.name.toLowerCase().includes(value)
    );
    setFilteredClasses(filtered);
  };

  // Handle delete action
  const handleDelete = async (classId) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        throw new Error("User is not authenticated. Please log in.");
      }

      await axios.delete(`${API_BASE_URL}/${classId}`, {
        headers: { token: userToken },
      });

      // Remove the deleted class from the state
      setClasses(classes.filter((classItem) => classItem._id !== classId));
      setFilteredClasses(filteredClasses.filter((classItem) => classItem._id !== classId));
    } catch (err) {
      console.error("Failed to delete class:", err.message);
      setError(err.response?.data?.message || "Failed to delete class. Please try again.");
    }
  };

  // Handle update dialog open
  const handleUpdateDialogOpen = (classItem) => {
    setSelectedClass(classItem);
    setUpdatedClassName(classItem.name);
    setUpdateDialogOpen(true);
  };

  // Handle update dialog close
  const handleUpdateDialogClose = () => {
    setSelectedClass(null);
    setUpdatedClassName("");
    setUpdateDialogOpen(false);
  };

  // Handle update action
  const handleUpdate = async () => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        throw new Error("User is not authenticated. Please log in.");
      }

      const response = await axios.put(
        `${API_BASE_URL}/${selectedClass._id}`,
        { name: updatedClassName },
        {
            headers: { token: userToken },
        }
      );

      // Update the class in the state
      setClasses(
        classes.map((classItem) =>
          classItem._id === selectedClass._id ? response.data.data : classItem
        )
      );
      setFilteredClasses(
        filteredClasses.map((classItem) =>
          classItem._id === selectedClass._id ? response.data.data : classItem
        )
      );

      handleUpdateDialogClose();
    } catch (err) {
      console.error("Failed to update class:", err.message);
      setError(err.response?.data?.message || "Failed to update class. Please try again.");
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
      <Typography variant="h4" gutterBottom>
        Classes List
      </Typography>

      {/* Search Bar */}
      <TextField
        label="Search by Class Name"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearch}
        sx={{ mb: 2, width: "300px" }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Class ID</TableCell>
              <TableCell>Class Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredClasses.map((classItem) => (
              <TableRow key={classItem._id}>
                <TableCell>{classItem._id}</TableCell>
                <TableCell>{classItem.name}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={() => handleUpdateDialogOpen(classItem)}
                    sx={{ mr: 1 }}
                  >
                    Update
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(classItem._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Update Dialog */}
      {selectedClass && (
        <Dialog open={updateDialogOpen} onClose={handleUpdateDialogClose}>
          <DialogTitle>Update Class</DialogTitle>
          <DialogContent>
            <TextField
              label="Class Name"
              variant="outlined"
              fullWidth
              value={updatedClassName}
              onChange={(e) => setUpdatedClassName(e.target.value)}
              sx={{ mt: 2 }}
            />
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

export default Class;