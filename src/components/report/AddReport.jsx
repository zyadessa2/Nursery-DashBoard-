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

const API_BASE_URL = "https://ancient-guillema-omaradel562-327b81ec.koyeb.app/report/addreport";

const AddReport = () => {
  const [report, setReport] = useState("");
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!report.trim() || !studentId.trim()) {
      toast.error("Both Report and Student ID are required!");
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
        { report, studentId },
        {
            headers: { token: userToken },
        }
      );

      toast.success("Report added successfully!");
      setReport(""); // Clear the input fields
      setStudentId("");
    } catch (err) {
      console.error("API Error:", err.message);
      toast.error(err.response?.data?.message || "Failed to add report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: "400px", mx: "auto" }}>
      <ToastContainer />
      <Typography variant="h4" gutterBottom>
        Add Report
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Report"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={report}
          onChange={(e) => setReport(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Student ID"
          variant="outlined"
          fullWidth
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
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
          {loading ? <CircularProgress size={24} color="inherit" /> : "Add Report"}
        </Button>
      </form>
    </Box>
  );
};

export default AddReport;