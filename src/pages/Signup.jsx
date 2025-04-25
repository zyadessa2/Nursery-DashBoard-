import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Validation schema using Yup
const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .matches(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      'Password must be at least 8 characters long, and contain at least one uppercase letter, one lowercase letter, one number, and one special character (#?!@$%^&*-)'
    )
    .required('Password is required'),
  cpassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
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
  role: Yup.string()
    .oneOf(['parent', 'student', 'teacher', 'managment'], 'Invalid Role')
    .required('Role is required'),
  DOB: Yup.date()
    .max(new Date(), 'Date of Birth cannot be in the future')
    .required('Date of Birth is required'),
  profilePic: Yup.mixed()
    .required('Profile picture is required')
    .test('fileSize', 'File size is too large', (value) => {
      return value && value.size <= 2 * 1024 * 1024; // 2MB limit
    })
    .test('fileType', 'Unsupported file type', (value) => {
      return value && ['image/jpeg', 'image/png', 'image/gif'].includes(value.type);
    }),
});

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const navigate = useNavigate();

  const initialValues = {
    name: '',
    email: '',
    password: '',
    cpassword: '',
    profilePic: null,
    phone: '',
    age: '',
    gender: '',
    role: '',
    DOB: '',
  };

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      // Create FormData to handle file upload and other form values
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('password', values.password);
      formData.append('cpassword', values.cpassword);
      formData.append('phone', values.phone);
      formData.append('age', values.age);
      formData.append('gander', values.gender); // API expects 'gander'
      formData.append('role', values.role);
      formData.append('DOB', values.DOB);
      formData.append('profilePic', values.profilePic);

      // Send POST request to the API
      const response = await axios.post('https://ancient-guillema-omaradel562-327b81ec.koyeb.app/mana/adduser', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('API Response:', response.data);

      toast.success('User registered successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
      navigate('login'); // Redirect to users page after successful registration

      resetForm();
      setUploadedFileName('');
      setIsFileUploaded(false);
    } catch (error) {
      console.error('API Error:', error.message);
      console.error('Response:', error.response);
      // Show detailed error message from API if available
      const errorMessage = error.response?.data?.message || 'Failed to register user. Please try again.';
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file, setFieldValue) => {
    setUploading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setFieldValue('profilePic', file);
      setUploadedFileName(file.name);
      setIsFileUploaded(true);
    } catch (error) {
      toast.error('Failed to upload file. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
      setFieldValue('profilePic', null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
      <ToastContainer />
      <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Sign Up
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, setFieldValue }) => (
            <Form>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="col-span-2 md:col-span-2">
                  <Field
                    as={TextField}
                    name="name"
                    label="Name"
                    variant="outlined"
                    fullWidth
                    error={touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                    sx={{ bgcolor: 'white' }}
                  />
                </div>

                {/* Email */}
                <div className="col-span-2 md:col-span-2">
                  <Field
                    as={TextField}
                    name="email"
                    label="Email"
                    type="email"
                    variant="outlined"
                    fullWidth
                    error={touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                    sx={{ bgcolor: 'white' }}
                  />
                </div>

                {/* Password */}
                <div className="col-span-1">
                  <Field
                    as={TextField}
                    name="password"
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    error={touched.password && !!errors.password}
                    helperText={touched.password && errors.password}
                    sx={{ bgcolor: 'white' }}
                  />
                </div>

                {/* Confirm Password */}
                <div className="col-span-1">
                  <Field
                    as={TextField}
                    name="cpassword"
                    label="Confirm Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    error={touched.cpassword && !!errors.cpassword}
                    helperText={touched.cpassword && errors.cpassword}
                    sx={{ bgcolor: 'white' }}
                  />
                </div>

                {/* Profile Picture */}
                <div className="col-span-2 md:col-span-2">
                  <Button
                    variant="contained"
                    component="label"
                    fullWidth
                    sx={{ mb: 1 }}
                    disabled={uploading}
                    startIcon={uploading ? <CircularProgress size={20} /> : null}
                  >
                    {uploading
                      ? 'Uploading...'
                      : isFileUploaded
                      ? 'Replace'
                      : 'Upload Profile Picture'}
                    <input
                      type="file"
                      hidden
                      onChange={(event) => {
                        const file = event.currentTarget.files[0];
                        if (file) {
                          handleFileUpload(file, setFieldValue);
                        }
                      }}
                      accept="image/*"
                    />
                  </Button>
                  {touched.profilePic && errors.profilePic ? (
                    <Typography color="error" variant="body2">
                      {errors.profilePic}
                    </Typography>
                  ) : null}
                  {isFileUploaded && !uploading && !errors.profilePic && (
                    <Typography variant="body2" color="textSecondary">
                      Uploaded File: {uploadedFileName}
                    </Typography>
                  )}
                </div>

                {/* Phone */}
                <div className="col-span-1">
                  <Field
                    as={TextField}
                    name="phone"
                    label="Phone Number"
                    variant="outlined"
                    fullWidth
                    error={touched.phone && !!errors.phone}
                    helperText={touched.phone && errors.phone}
                    sx={{ bgcolor: 'white' }}
                  />
                </div>

                {/* Age */}
                <div className="col-span-1">
                  <Field
                    as={TextField}
                    name="age"
                    label="Age"
                    type="number"
                    variant="outlined"
                    fullWidth
                    error={touched.age && !!errors.age}
                    helperText={touched.age && errors.age}
                    sx={{ bgcolor: 'white' }}
                  />
                </div>

                {/* Gender */}
                <div className="col-span-1">
                  <Field
                    as={TextField}
                    name="gender"
                    label="Gender"
                    select
                    variant="outlined"
                    fullWidth
                    error={touched.gender && !!errors.gender}
                    helperText={touched.gender && errors.gender}
                    sx={{ bgcolor: 'white' }}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Field>
                </div>

                {/* Role */}
                <div className="col-span-1">
                  <Field
                    as={TextField}
                    name="role"
                    label="Role"
                    select
                    variant="outlined"
                    fullWidth
                    error={touched.role && !!errors.role}
                    helperText={touched.role && errors.role}
                    sx={{ bgcolor: 'white' }}
                  >
                    <MenuItem value="student">Student</MenuItem>
                    <MenuItem value="teacher">Teacher</MenuItem>
                    <MenuItem value="parent">Parent</MenuItem>
                    <MenuItem value="managment">Managment</MenuItem>
                  </Field>
                </div>

                {/* Date of Birth */}
                <div className="col-span-1">
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
                    sx={{ bgcolor: 'white' }}
                  />
                </div>

                {/* Submit Button */}
                <div className="col-span-2 md:col-span-2">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
                    sx={{ mt: 2, py: 1.5, fontSize: '1rem' }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
                  </Button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Box>
  );
};

export default SignUp;