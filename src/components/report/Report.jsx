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

const API_BASE_URL = "https://ancient-guillema-omaradel562-327b81ec.koyeb.app/report";

const Report = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updatedReport, setUpdatedReport] = useState("");
  const [updatedStudentId, setUpdatedStudentId] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);

        // Retrieve the token from localStorage
        const userToken = localStorage.getItem("userToken");
        if (!userToken) {
          throw new Error("User is not authenticated. Please log in.");
        }

        // Make the API request with the Authorization header
        const response = await axios.get(API_BASE_URL, {
            headers: { token: userToken },        });

        setReports(response.data.data || []);
        setFilteredReports(response.data.data || []); // Initialize filtered reports
      } catch (err) {
        console.error("API Error:", err.message);
        toast.error(err.response?.data?.message || "Failed to fetch reports. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Handle search input change
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = reports.filter((report) =>
      report.report.toLowerCase().includes(value)
    );
    setFilteredReports(filtered);
  };

  // Handle delete action
  const handleDelete = async (reportId) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        throw new Error("User is not authenticated. Please log in.");
      }

      await axios.delete(`${API_BASE_URL}/${reportId}`, {
        headers: { token: userToken },      });

      // Remove the deleted report from the state
      setReports(reports.filter((report) => report._id !== reportId));
      setFilteredReports(filteredReports.filter((report) => report._id !== reportId));
      toast.success("Report deleted successfully!");
    } catch (err) {
      console.error("Failed to delete report:", err.message);
      toast.error(err.response?.data?.message || "Failed to delete report. Please try again.");
    }
  };

  // Handle update dialog open
  const handleUpdateDialogOpen = (report) => {
    setSelectedReport(report);
    setUpdatedReport(report.report);
    setUpdatedStudentId(report.studentId); // Set the studentId for the selected report
    setUpdateDialogOpen(true);
  };

  // Handle update dialog close
  const handleUpdateDialogClose = () => {
    setSelectedReport(null);
    setUpdatedReport("");
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
        `${API_BASE_URL}/${selectedReport._id}`,
        { report: updatedReport, studentId: updatedStudentId }, // Include studentId in the request body
        {
            headers: { token: userToken },        }
      );

      // Update the report in the state
      setReports(
        reports.map((report) =>
          report._id === selectedReport._id ? response.data.data : report
        )
      );
      setFilteredReports(
        filteredReports.map((report) =>
          report._id === selectedReport._id ? response.data.data : report
        )
      );

      toast.success("Report updated successfully!");
      handleUpdateDialogClose();
    } catch (err) {
      console.error("Failed to update report:", err.message);
      toast.error(err.response?.data?.message || "Failed to update report. Please try again.");
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
        Reports List
      </Typography>

      {/* Search Bar */}
      <TextField
        label="Search by Report"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearch}
        sx={{ mb: 2, width: "300px" }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Report ID</TableCell>
              <TableCell>Report</TableCell>
              <TableCell>Student ID</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReports.map((report) => (
              <TableRow key={report._id}>
                <TableCell>{report._id}</TableCell>
                <TableCell>{report.report}</TableCell>
                <TableCell>{report.studentId}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={() => handleUpdateDialogOpen(report)}
                    sx={{ mr: 1 }}
                  >
                    Update
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(report._id)}
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
      {selectedReport && (
        <Dialog open={updateDialogOpen} onClose={handleUpdateDialogClose}>
          <DialogTitle>Update Report</DialogTitle>
          <DialogContent>
            <TextField
              label="Report"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={updatedReport}
              onChange={(e) => setUpdatedReport(e.target.value)}
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

export default Report;