import { createBrowserRouter } from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";

import BuyerHome from "../pages/buyer/HomePage";
import CartPage from "../pages/buyer/CartPage";
import OrdersPage from "../pages/buyer/OrdersPage";
import CanteenDetailPage from "../pages/buyer/CanteenDetailPage";
import ProfilePage from "../pages/canteen/ProfilePage";
import AdminDashboard from "../pages/admin/DashboardPage";
import HistoryPage from "../pages/buyer/HistoryPage";
import CanteenDashboard from "../pages/canteen/DashboardPage";
import CanteenOrdersPage from "../pages/canteen/CanteenOrdersPage";
import MenuPage from "../pages/canteen/MenuPage";
import ProtectedRoute from "../components/ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import RegisterPage from "../pages/auth/RegisterPage";
import CanteenRequestPage from "../pages/admin/CanteenRequestPage";
import CanteenRequestsPage from "../pages/buyer/CanteenRequestPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    path: "/register",
    element: <RegisterPage />,
  },

  // BUYER
  {
    element: (
      <ProtectedRoute allowedRoles={["BUYER"]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),

    children: [
      {
        path: "/buyer/request-canteen",
        element: <CanteenRequestsPage />,
      },
      {
        path: "/buyer",
        element: <BuyerHome />,
      },

      {
        path: "/buyer/cart",
        element: <CartPage />,
      },

      {
        path: "/buyer/orders",
        element: <OrdersPage />,
      },

      {
        path: "/buyer/history",

        element: (
          <ProtectedRoute allowedRoles={["BUYER"]}>
            <HistoryPage />
          </ProtectedRoute>
        ),
      },

      {
        path: "/buyer/canteens/:id",
        element: <CanteenDetailPage />,
      },
    ],
  },

  // CANTEEN
  {
    element: (
      <ProtectedRoute allowedRoles={["CANTEEN_ADMIN"]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),

    children: [
      {
        path: "/canteen",
        element: <CanteenDashboard />,
      },

      {
        path: "/canteen/menus",
        element: <MenuPage />,
      },

      {
        path: "/canteen/orders",
        element: <CanteenOrdersPage />,
      },

      {
        path: "/canteen/profile",

        element: (
          <ProtectedRoute allowedRoles={["CANTEEN_ADMIN"]}>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
    ],
  },

  // ADMIN
  {
    element: (
      <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),

    children: [
      {
        path: "/admin",
        element: <AdminDashboard />,
      },
      {
        path: "/admin/requests",
        element: <CanteenRequestPage />,
      },
      {
        path: "/admin",
        element: <AdminDashboard />,
      },
    ],
  },
]);
