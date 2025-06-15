import { Route, BrowserRouter as Router, Routes } from "react-router";
import AppLayout from "./layout/AppLayout";
import AuthLayout from "./layout/AuthLayout";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import Dashboard from "./pages/Dashboard/Dashboard";
import NotFound from "./pages/OtherPage/NotFound";
import TableUsers from "./pages/Tables/TableUsers";
import TableProducts from "./pages/Tables/TableProducts";
import TableOrders from "./pages/Tables/TableOrders";
import TableTechnicians from "./pages/Tables/TableTechnicians";
import ProtectedRoute from "./components/common/ProtectedRoute";

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Dashboard Layout */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index path="/" element={<Dashboard />} />
            {/* Tables */}
            <Route path="/table-users" element={<TableUsers />} />
            <Route path="/table-products" element={<TableProducts />} />
            <Route path="/table-orders" element={<TableOrders />} />
            <Route path="/table-technicians" element={<TableTechnicians />} />

          </Route>

          {/* Auth Layout */}
          <Route element={<AuthLayout />}>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
