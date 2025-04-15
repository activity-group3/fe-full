import { useRoutes, Navigate } from "react-router-dom";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ErrorPage from "../pages/Error";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import ActivityDetail from "../pages/ActivityDetail";
import MyActivities from "../pages/MyActivities";
import MyParticipant from "../pages/MyParticipant";
import DashboardLayout from "../layouts/DashboardLayout";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/Admin/Dashboard";
import CreateActivity from "../pages/CreateActivity";

const checkAdminRole = () => {
  const userData = localStorage.getItem("user");
  if (!userData) return false;
  const user = JSON.parse(userData);
  return user.role === "ADMIN";
};

// Define the Router as a React component
function Router() {
  const routes = useRoutes([
    {
      path: "/",
      element: <Home />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/auth",
      children: [
        {
          path: "login",
          element: <Login />,
          errorElement: <ErrorPage />,
        },
        {
          path: "register",
          element: <Register />,
          errorElement: <ErrorPage />,
        },
      ],
    },
    {
      element: <DashboardLayout />,
      children: [
        {
          path: "/dashboard",
          element: <Dashboard />,
          errorElement: <ErrorPage />,
        },
        {
          path: "/my-activities",
          element: <MyActivities />,
          errorElement: <ErrorPage />,
        },
        {
          path: "/activities/:id",
          element: <ActivityDetail />,
          errorElement: <ErrorPage />,
        },
        {
          path: "/my-participation",
          element: <MyParticipant />,
          errorElement: <ErrorPage />,
        },
        {
          path: "/my-participant",
          element: <MyParticipant />,
          errorElement: <ErrorPage />,
        },
      ],
    },
    {
      element: checkAdminRole() ? (
        <AdminLayout />
      ) : (
        <Navigate to="/dashboard" />
      ),
      children: [
        {
          path: "/admin/dashboard",
          element: <AdminDashboard />,
          errorElement: <ErrorPage />,
        },
        {
          path: "/admin/activities/create",
          element: <CreateActivity />,
          errorElement: <ErrorPage />,
        },
        // ...other admin routes...
      ],
    },
    {
      path: "*",
      element: <ErrorPage />,
    },
  ]);

  return routes;
}

export default Router;
