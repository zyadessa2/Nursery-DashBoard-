import axios from 'axios';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bounce, toast } from 'react-toastify';
import * as Yup from 'yup';

const Signup = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(values) {
    setIsLoading(true);
    try {
      const formData = new FormData();
      for (let key in values) {
        formData.append(key, values[key]);
      }
      let { data } = await axios.post(`https://icpc-hti.vercel.app/api/auth/signup`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (data.success) {
        setIsLoading(false);
        navigate('/login');
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.response?.data?.message || 'An error occurred during signup');
      console.error(err);
      toast.error(err.response?.data?.message || 'An error occurred during signup', {
        position: 'bottom-left',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
        transition: Bounce,
      });
    }
  }

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      cpassword: '',
      profilePic: null,
      phone: '',
      age: '',
      gender: 'male',
      DOB: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Please write your name'),
      phone: Yup.number().required('Write your number'),
      age: Yup.number().required('Write your age'),
      email: Yup.string().email('Write a valid email').required('Email is required'),
      password: Yup.string().required('Password is required'),
      cpassword: Yup.string()
        .required('Confirm password please')
        .oneOf([Yup.ref('password'), null], 'Passwords must match'),
      gender: Yup.string().oneOf(['male', 'female'], 'Choose male or female'),
      DOB: Yup.date().required('Date of birth is required'),
    }),
    onSubmit: handleSubmit,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Sign Up</h2>
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                name="name"
                value={formik.values.name}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                id="name"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your name"
              />
              {formik.touched.name && formik.errors.name && (
                <div className="text-red-500 text-sm">{formik.errors.name}</div>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                name="email"
                value={formik.values.email}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="email"
                id="email"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-sm">{formik.errors.email}</div>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                name="password"
                value={formik.values.password}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="password"
                id="password"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-sm">{formik.errors.password}</div>
              )}
            </div>

            <div>
              <label htmlFor="cpassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                name="cpassword"
                value={formik.values.cpassword}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="password"
                id="cpassword"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Confirm your password"
              />
              {formik.touched.cpassword && formik.errors.cpassword && (
                <div className="text-red-500 text-sm">{formik.errors.cpassword}</div>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                name="phone"
                value={formik.values.phone}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                id="phone"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your phone number"
              />
              {formik.touched.phone && formik.errors.phone && (
                <div className="text-red-500 text-sm">{formik.errors.phone}</div>
              )}
            </div>

            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                Age
              </label>
              <input
                name="age"
                value={formik.values.age}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="number"
                id="age"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your age"
              />
              {formik.touched.age && formik.errors.age && (
                <div className="text-red-500 text-sm">{formik.errors.age}</div>
              )}
            </div>

            <div>
              <label htmlFor="DOB" className="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                name="DOB"
                value={formik.values.DOB}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="date"
                id="DOB"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {formik.touched.DOB && formik.errors.DOB && (
                <div className="text-red-500 text-sm">{formik.errors.DOB}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <div className="mt-1 flex items-center">
                <label className="mr-4">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formik.values.gender === 'male'}
                    onChange={formik.handleChange}
                  />
                  Male
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formik.values.gender === 'female'}
                    onChange={formik.handleChange}
                  />
                  Female
                </label>
              </div>
              {formik.touched.gender && formik.errors.gender && (
                <div className="text-red-500 text-sm">{formik.errors.gender}</div>
              )}
            </div>

            <div>
              <label htmlFor="profilePic" className="block text-sm font-medium text-gray-700">
                Profile Picture
              </label>
              <input
                name="profilePic"
                onChange={(e) => formik.setFieldValue('profilePic', e.target.files[0])}
                onBlur={formik.handleBlur}
                type="file"
                id="profilePic"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={isLoading}
            >
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </div>
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;