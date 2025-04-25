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
import EditIcon from "@mui/icons-material/Edit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = "https://ancient-guillema-omaradel562-327b81ec.koyeb.app/subject";

const Subject = () => {
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updatedSubjectName, setUpdatedSubjectName] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");

  useEffect(() => {
    const fetchSubjects = async () => {
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

        setSubjects(response.data.data || []);
        setFilteredSubjects(response.data.data || []); // Initialize filtered subjects
      } catch (err) {
        console.error("API Error:", err.message);
        toast.error(err.response?.data?.message || "Failed to fetch subjects. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  // Handle search input change
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = subjects.filter((subject) =>
      subject.name.toLowerCase().includes(value)
    );
    setFilteredSubjects(filtered);
  };

  // Handle delete action
  const handleDelete = async (subjectId) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        throw new Error("User is not authenticated. Please log in.");
      }

      await axios.delete(`${API_BASE_URL}/${subjectId}`, {
        headers: { token: userToken },
      });

      // Remove the deleted subject from the state
      setSubjects(subjects.filter((subject) => subject._id !== subjectId));
      setFilteredSubjects(filteredSubjects.filter((subject) => subject._id !== subjectId));
      toast.success("Subject deleted successfully!");
    } catch (err) {
      console.error("Failed to delete subject:", err.message);
      toast.error(err.response?.data?.message || "Failed to delete subject. Please try again.");
    }
  };

  // Handle update dialog open
  const handleUpdateDialogOpen = (subject) => {
    setSelectedSubject(subject);
    setUpdatedSubjectName(subject.name);
    setUpdatedDescription(subject.description);
    setUpdateDialogOpen(true);
  };

  // Handle update dialog close
  const handleUpdateDialogClose = () => {
    setSelectedSubject(null);
    setUpdatedSubjectName("");
    setUpdatedDescription("");
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
        `${API_BASE_URL}/${selectedSubject._id}`,
        { name: updatedSubjectName, description: updatedDescription },
        {
            headers: { token: userToken },
                }
      );

      // Update the subject in the state
      setSubjects(
        subjects.map((subject) =>
          subject._id === selectedSubject._id ? response.data.data : subject
        )
      );
      setFilteredSubjects(
        filteredSubjects.map((subject) =>
          subject._id === selectedSubject._id ? response.data.data : subject
        )
      );

      toast.success("Subject updated successfully!");
      handleUpdateDialogClose();
    } catch (err) {
      console.error("Failed to update subject:", err.message);
      toast.error(err.response?.data?.message || "Failed to update subject. Please try again.");
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
        Subjects List
      </Typography>

      {/* Search Bar */}
      <TextField
        label="Search by Subject Name"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearch}
        sx={{ mb: 2, width: "300px" }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Subject ID</TableCell>
              <TableCell>Subject Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSubjects.map((subject) => (
              <TableRow key={subject._id}>
                <TableCell>{subject._id}</TableCell>
                <TableCell>{subject.name}</TableCell>
                <TableCell>{subject.description}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={() => handleUpdateDialogOpen(subject)}
                    sx={{ mr: 1 }}
                  >
                    Update
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(subject._id)}
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
      {selectedSubject && (
        <Dialog open={updateDialogOpen} onClose={handleUpdateDialogClose}>
          <DialogTitle>Update Subject</DialogTitle>
          <DialogContent>
            <TextField
              label="Subject Name"
              variant="outlined"
              fullWidth
              value={updatedSubjectName}
              onChange={(e) => setUpdatedSubjectName(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              value={updatedDescription}
              onChange={(e) => setUpdatedDescription(e.target.value)}
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

export default Subject;