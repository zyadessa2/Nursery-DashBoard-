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

const API_BASE_URL = "https://ancient-guillema-omaradel562-327b81ec.koyeb.app/parent";

const Parent = () => {
  const [parents, setParents] = useState([]);
  const [filteredParents, setFilteredParents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParents = async () => {
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

        setParents(response.data.data || []);
        setFilteredParents(response.data.data || []); // Initialize filtered parents
      } catch (err) {
        console.error("API Error:", err.message);
        setError(err.response?.data?.message || "Failed to fetch parents. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchParents();
  }, []);

  // Handle search input change
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = parents.filter((parent) =>
      parent.userId?.name.toLowerCase().includes(value)
    );
    setFilteredParents(filtered);
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
        Parents List
      </Typography>

      {/* Search Bar */}
      <TextField
        label="Search by Parent Name"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearch}
        sx={{ mb: 2, width: "300px" }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Parent ID</TableCell>
              <TableCell>Parent Name</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>Student ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredParents.map((parent) => (
              <TableRow key={parent._id}>
                <TableCell>{parent._id}</TableCell>
                <TableCell>{parent.userId?.name || "N/A"}</TableCell>
                <TableCell>{parent.userId?._id || "N/A"}</TableCell>
                <TableCell>{parent.studentId?._id || "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Parent;