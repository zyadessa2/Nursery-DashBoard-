import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../context/AuthContext";
import { Box, Button, TextField, Typography, CircularProgress } from "@mui/material";

const Login = () => {
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(values) {
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        "https://ancient-guillema-omaradel562-327b81ec.koyeb.app/mana/signin",
        values
      );

      if (data.success) {
        console.log(data.data.token);
        
        localStorage.setItem("userToken", data.data.token);
        setToken(data.data.token);
        toast.success("Login successful 🎉", {
          position: "top-center",
          autoClose: 5000,
          theme: "light",
          transition: Bounce,
        });
        navigate("/dashboard/users");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  }

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: handleLogin,
  });

  return (
    <>
      <ToastContainer />
      <Box className="bg-gray-100 min-h-screen flex items-center justify-center py-16">
        <Box className="container mx-auto px-4">
          <Box className="flex flex-col md:flex-row justify-center items-center">
            {/* Form Section */}
            <Box className="md:w-1/2 bg-white p-8 rounded-lg shadow-lg">
              <Typography
                variant="h4"
                className="text-center font-bold text-blue-600 mb-6"
              >
                Welcome Back
              </Typography>
              <Typography
                variant="body1"
                className="text-center text-gray-600 mb-6"
              >
                Please login to your account
              </Typography>

              {error && (
                <Box className="alert alert-danger text-red-600 mb-4">
                  {error}
                </Box>
              )}

              <form onSubmit={formik.handleSubmit}>
                {/* Email Field */}
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email"
                  variant="outlined"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  className="!mb-4"
                />

                {/* Password Field */}
                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  variant="outlined"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                  className="my-4"
                />

                {/* Submit Button */}
                <Box className="text-center mt-4">
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    disabled={!(formik.isValid && formik.dirty) || isLoading}
                    className="py-3 text-lg font-bold"
                  >
                    {isLoading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Log In"
                    )}
                  </Button>
                </Box>

                {/* Links */}
                <Typography className="text-center mt-4 text-gray-600">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-blue-600 hover:underline">
                    Sign Up
                  </Link>
                </Typography>
                
              </form>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Login;