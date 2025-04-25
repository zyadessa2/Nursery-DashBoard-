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
} from "@mui/material";

const API_BASE_URL = "https://ancient-guillema-omaradel562-327b81ec.koyeb.app/teacher";

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeachers = async () => {
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

        setTeachers(response.data.data || []);
        setFilteredTeachers(response.data.data || []); // Initialize filtered teachers
      } catch (err) {
        console.error("API Error:", err.message);
        setError(err.response?.data?.message || "Failed to fetch teachers. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  // Handle search input change
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = teachers.filter((teacher) =>
      teacher.userId?.name.toLowerCase().includes(value)
    );
    setFilteredTeachers(filtered);
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
        Teachers List
      </Typography>

      {/* Search Bar */}
      <TextField
        label="Search by Teacher Name"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearch}
        sx={{ mb: 2, width: "300px" }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Teacher ID</TableCell>
              <TableCell>Teacher Name</TableCell>
              <TableCell>User ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTeachers.map((teacher) => (
              <TableRow key={teacher._id}>
                <TableCell>{teacher._id}</TableCell>
                <TableCell>{teacher.userId?.name || "N/A"}</TableCell>
                <TableCell>{teacher.userId?._id || "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Teachers;