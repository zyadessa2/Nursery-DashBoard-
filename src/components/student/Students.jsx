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
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = "https://ancient-guillema-omaradel562-327b81ec.koyeb.app/student";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
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

        setStudents(response.data.data || []);
        setFilteredStudents(response.data.data || []); // Initialize filtered students
      } catch (err) {
        console.error("API Error:", err.message);
        setError(err.response?.data?.message || "Failed to fetch students. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Handle search input change
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = students.filter((student) =>
      student.userId?.name.toLowerCase().includes(value)
    );
    setFilteredStudents(filtered);
  };

  // Handle delete action
  const handleDelete = async (studentId) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        throw new Error("User is not authenticated. Please log in.");
      }

      // Make the delete request
      await axios.delete(`${API_BASE_URL}/${studentId}`, {
        headers: { token: userToken },
      });

      // Update the state after deletion
      setStudents(students.filter((student) => student._id !== studentId));
      setFilteredStudents(filteredStudents.filter((student) => student._id !== studentId));

      toast.success("Student deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Delete Error:", err.message);
      toast.error(err.response?.data?.message || "Failed to delete student. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
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
        Students List
      </Typography>

      {/* Search Bar */}
      <TextField
        label="Search by Student Name"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearch}
        sx={{ mb: 2, width: "300px" }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student Name</TableCell>
              <TableCell>Class Name</TableCell>
              <TableCell>Subjects</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student._id}>
                <TableCell>{student.userId?.name || "N/A"}</TableCell>
                <TableCell>{student.classId?.name || "N/A"}</TableCell>
                <TableCell>
                  {student.subjectes.map((subject) => subject.name).join(", ")}
                </TableCell>
                <TableCell>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(student._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Students;


