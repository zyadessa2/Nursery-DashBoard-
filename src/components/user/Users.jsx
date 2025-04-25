import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  CircularProgress,
  MenuItem,
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

// Base URL for the API
const API_BASE_URL = 'https://ancient-guillema-omaradel562-327b81ec.koyeb.app/mana';

// Validation schema for the update form
const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10,15}$/, 'Phone number must be between 10 and 15 digits')
    .required('Phone number is required'),
  age: Yup.number()
    .min(1, 'Age must be at least 1')
    .max(120, 'Age must be less than 120')
    .required('Age is required'),
  gender: Yup.string()
    .oneOf(['male', 'female', 'other'], 'Invalid gender')
    .required('Gender is required'),
  DOB: Yup.date()
    .max(new Date(), 'Date of Birth cannot be in the future')
    .required('Date of Birth is required'),
});

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://ancient-guillema-omaradel562-327b81ec.koyeb.app/mana`);
        console.log('API Response:', response.data.data);
        setUsers(Array.isArray(response.data.data) ? response.data.data : []);
      } catch (err) {
        console.error('API Error:', err.message);
        console.error('Response:', err.response);
        setError(`Failed to fetch users: ${err.message}`);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = Array.isArray(users)
    ? users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Handle delete dialog open
  const handleDeleteDialogOpen = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  // Handle delete dialog close
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  // Handle delete action
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/${selectedUser._id}`);
      setUsers(users.filter((user) => user._id !== selectedUser._id));
      handleDeleteDialogClose();
    } catch (err) {
      setError('Failed to delete user. Please try again.');
      console.error(err);
    }
  };

  // Handle update dialog open
  const handleUpdateDialogOpen = (user) => {
    setSelectedUser(user);
    setUpdateDialogOpen(true);
  };

  // Handle update dialog close
  const handleUpdateDialogClose = () => {
    setUpdateDialogOpen(false);
    setSelectedUser(null);
  };

  // Handle update submission
  const handleUpdate = async (values) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${selectedUser._id}`, values);
      setUsers(
        users.map((user) =>
          user._id === selectedUser._id ? response.data.data : user
        )
      );
      handleUpdateDialogClose();
    } catch (err) {
      setError('Failed to update user. Please try again.');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
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
        Users List
      </Typography>

      {/* Search Input */}
      <TextField
        label="Search by Name"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2, width: '300px' }}
      />

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>DOB</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.age}</TableCell>
                <TableCell>{user.gander || user.gender}</TableCell>
                <TableCell>{user.DOB}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={() => handleUpdateDialogOpen(user)}
                    sx={{ mr: 1 }}
                  >
                    Update
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteDialogOpen(user)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the user "{selectedUser?.name}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Dialog */}
      {selectedUser && (
        <Dialog open={updateDialogOpen} onClose={handleUpdateDialogClose}>
          <DialogTitle>Update User</DialogTitle>
          <DialogContent>
            <Formik
              initialValues={{
                name: selectedUser.name,
                email: selectedUser.email,
                phone: selectedUser.phone,
                age: selectedUser.age,
                gender: selectedUser.gander || selectedUser.gender || '', // Handle "gander" typo
                DOB: selectedUser.DOB.split('T')[0], // Format date for input
              }}
              validationSchema={validationSchema}
              onSubmit={handleUpdate}
            >
              {({ errors, touched }) => (
                <Form>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                    <Field
                      as={TextField}
                      name="name"
                      label="Name"
                      variant="outlined"
                      fullWidth
                      error={touched.name && !!errors.name}
                      helperText={touched.name && errors.name}
                    />
                    <Field
                      as={TextField}
                      name="email"
                      label="Email"
                      type="email"
                      variant="outlined"
                      fullWidth
                      error={touched.email && !!errors.email}
                      helperText={touched.email && errors.email}
                    />
                    <Field
                      as={TextField}
                      name="phone"
                      label="Phone Number"
                      variant="outlined"
                      fullWidth
                      error={touched.phone && !!errors.phone}
                      helperText={touched.phone && errors.phone}
                    />
                    <Field
                      as={TextField}
                      name="age"
                      label="Age"
                      type="number"
                      variant="outlined"
                      fullWidth
                      error={touched.age && !!errors.age}
                      helperText={touched.age && errors.age}
                    />
                    <Field
                      as={TextField}
                      name="gender"
                      label="Gender"
                      select
                      variant="outlined"
                      fullWidth
                      error={touched.gender && !!errors.gender}
                      helperText={touched.gender && errors.gender}
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Field>
                    <Field
                      as={TextField}
                      name="DOB"
                      label="Date of Birth"
                      type="date"
                      variant="outlined"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      error={touched.DOB && !!errors.DOB}
                      helperText={touched.DOB && errors.DOB}
                    />
                  </Box>
                  <DialogActions sx={{ mt: 2 }}>
                    <Button onClick={handleUpdateDialogClose} color="primary">
                      Cancel
                    </Button>
                    <Button type="submit" color="primary" variant="contained">
                      Save
                    </Button>
                  </DialogActions>
                </Form>
              )}
            </Formik>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
};

export default Users;


