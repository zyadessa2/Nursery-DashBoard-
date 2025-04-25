import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import './App.css';
import Signup from './pages/Signup';
import Layout from './components/Layout';
import Login from './pages/Login';
import Users from './components/user/Users';
import NotFound from './pages/NotFound';
import AddUser from './components/user/AddUser';
import AddStudent from './components/student/AddStudent';
import Students from './components/student/Students';
import Teachers from './components/teacher/Teachers';
import AddTeacher from './components/teacher/AddTeacher';
import Parent from './components/parent/Parent';
import AddParent from './components/parent/AddParent';
import Class from './components/class/Class';
import AddClass from './components/class/AddClass';
import Subject from './components/subject/Subject';
import AddSubject from './components/subject/AddSubject';
import Schedule from './components/schedule/Schedule';
import AddSchedule from './components/schedule/AddSchedule';
import Report from './components/report/Report';
import AddReport from './components/report/AddReport';
import Attendance from './components/attendance/Attendance';

// ProtectedRoute Component
const ProtectedRoute = ({ element }) => {
  const userToken = localStorage.getItem("userToken");
  if (!userToken) {
    return <Navigate to="/login" replace />; // Use Navigate for client-side redirection
  }
  return element;
};

let routers = createBrowserRouter([
  { index: true, element: <Login /> },
  { path: "login", element: <Login /> },
  { path: "signup", element: <Signup /> },

  {
    path: 'dashboard',
    element: <ProtectedRoute element={<Layout />} />, // Protect the layout
    children: [
      { path: "users", element: <ProtectedRoute element={<Users />} /> },
      { path: "users/add", element: <ProtectedRoute element={<AddUser />} /> },
      { path: "students", element: <ProtectedRoute element={<Students />} /> },
      { path: "students/add", element: <ProtectedRoute element={<AddStudent />} /> },
      { path: "teachers", element: <ProtectedRoute element={<Teachers />} /> },
      { path: "teachers/add", element: <ProtectedRoute element={<AddTeacher />} /> },
      { path: "parents", element: <ProtectedRoute element={<Parent />} /> },
      { path: "parents/add", element: <ProtectedRoute element={<AddParent />} /> },
      { path: "class", element: <ProtectedRoute element={<Class />} /> },
      { path: "class/add", element: <ProtectedRoute element={<AddClass />} /> },
      { path: "subjects", element: <ProtectedRoute element={<Subject />} /> },
      { path: "subjects/add", element: <ProtectedRoute element={<AddSubject />} /> },
      { path: "schedules", element: <ProtectedRoute element={<Schedule />} /> },
      { path: "schedules/add", element: <ProtectedRoute element={<AddSchedule />} /> },
      { path: "reports", element: <ProtectedRoute element={<Report />} /> },
      { path: "reports/add", element: <ProtectedRoute element={<AddReport />} /> },
      { path: "attendance", element: <ProtectedRoute element={<Attendance />} /> },
      {
        path: "logout",
        loader: () => {
          // Perform logout logic (e.g., clear auth tokens)
          localStorage.removeItem("userToken");
          return <Navigate to="/login" replace />; // Use Navigate for redirection
        },
      },
      { path: "*", element: <NotFound /> }, // Catch-all route for unmatched paths
    ],
  },
]);

function App() {
  return <RouterProvider router={routers}></RouterProvider>;
}

export default App;
