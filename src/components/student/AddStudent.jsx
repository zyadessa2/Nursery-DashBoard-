import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";

// Validation schema using Yup
const validationSchema = Yup.object({
  userId: Yup.string().required("User ID is required"),
  classId: Yup.string().required("Class ID is required"),
  subjectes: Yup.array()
    .of(Yup.string().required("Subject ID is required"))
    .min(1, "At least one subject is required"),
});

const AddStudent = () => {
  const [loading, setLoading] = useState(false);
  const [subjectInput, setSubjectInput] = useState("");
  const [subjects, setSubjects] = useState([]);

  const initialValues = {
    userId: "",
    classId: "",
    subjectes: [],
  };

  const handleAddSubject = () => {
    if (subjectInput.trim()) {
      setSubjects([...subjects, subjectInput.trim()]);
      setSubjectInput("");
    }
  };

  const handleRemoveSubject = (index) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const userToken = localStorage.getItem("userToken"); // Retrieve userToken from localStorage
      if (!userToken) {
        throw new Error("User is not authenticated. Please log in.");
      }

      const payload = { ...values, subjectes: subjects };
      await axios.post(
        "https://ancient-guillema-omaradel562-327b81ec.koyeb.app/student/addstudent",
        payload,
        {
            headers: { token: userToken },
        }
      );

      toast.success("Student added successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      resetForm();
      setSubjects([]);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to add student.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", py: 4 }}>
      <ToastContainer />
      <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#1976d2" }}
        >
          Add New Student
        </Typography>
        <Formik
          initialValues={{ ...initialValues, subjectes: subjects }}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            handleSubmit({ ...values, subjectes: subjects }, { resetForm });
          }}
        >
          {({ errors, touched, handleChange, handleBlur, setFieldValue }) => (
            <Form>
              <div className="grid grid-cols-2 gap-4">
                {/* User ID */}
                <div className="col-span-2">
                  <Field
                    as={TextField}
                    name="userId"
                    label="User ID"
                    variant="outlined"
                    fullWidth
                    error={touched.userId && !!errors.userId}
                    helperText={touched.userId && errors.userId}
                    sx={{ bgcolor: "white" }}
                  />
                </div>

                {/* Class ID */}
                <div className="col-span-2">
                  <Field
                    as={TextField}
                    name="classId"
                    label="Class ID"
                    variant="outlined"
                    fullWidth
                    error={touched.classId && !!errors.classId}
                    helperText={touched.classId && errors.classId}
                    sx={{ bgcolor: "white" }}
                  />
                </div>

                {/* Subjects */}
                <div className="col-span-2">
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    Subjects
                  </Typography>
                  <div className="flex items-center gap-2">
                    <TextField
                      value={subjectInput}
                      onChange={(e) => setSubjectInput(e.target.value)}
                      onBlur={handleBlur}
                      label="Add Subject ID"
                      variant="outlined"
                      fullWidth
                      sx={{ bgcolor: "white" }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        if (subjectInput.trim()) {
                          const updatedSubjects = [
                            ...subjects,
                            subjectInput.trim(),
                          ];
                          setSubjects(updatedSubjects);
                          setFieldValue("subjectes", updatedSubjects); // Sync with Formik
                          setSubjectInput("");
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  <ul className="mt-2">
                    {subjects.map((subject, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center bg-gray-100 p-2 rounded-md mt-2"
                      >
                        <span>{subject}</span>
                        <Button
                          variant="text"
                          color="error"
                          onClick={() => {
                            const updatedSubjects = subjects.filter(
                              (_, i) => i !== index
                            );
                            setSubjects(updatedSubjects);
                            setFieldValue("subjectes", updatedSubjects); // Sync with Formik
                          }}
                        >
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                  {touched.subjectes && errors.subjectes && (
                    <Typography color="error" variant="body2">
                      {errors.subjectes}
                    </Typography>
                  )}
                </div>

                {/* Submit Button */}
                <div className="col-span-2">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
                    sx={{ mt: 2, py: 1.5, fontSize: "1rem" }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Add Student"
                    )}
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

export default AddStudent;