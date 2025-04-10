import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import BookingPage from "./pages/BookingPage";
import Bookings from "./pages/Bookings";
import CreateBus from "./pages/CreateBus";
import DeleteBus from "./pages/DeleteBus";
import EditBus from "./pages/EditBus";
import MyBuses from "./pages/MyBuses";
import Home from "./pages/Home";
import Footer from './components/Footer';
import About from './pages/About';
import TicketConfirmed from "./pages/Confirm";
import TicketDetails from "./pages/TicketDetails";




// Route protection components
const ProtectedRoute = ({ role, allowedRoles, redirectPath = '/' }) => {
  if (!allowedRoles.includes(role)) {
    return <Navigate to={redirectPath} replace />;
  }
  return <Outlet />;
};

const AuthRoute = ({ token, redirectPath = '/user-dashboard' }) => {
  if (token) {
    return <Navigate to={redirectPath} replace />;
  }
  return <Outlet />;
};

const App = () => {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  const role = storedUser ? JSON.parse(storedUser).role : null;

  return (
    <Router>
      <div className="page-wrapper">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          
          {/* Authentication Routes (only for non-logged in users) */}
          <Route element={<AuthRoute token={token} />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* User Routes */}
          <Route element={<ProtectedRoute role={role} allowedRoles={['user', 'admin']} />}>
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/bookings/:scheduleId" element={<BookingPage />} />
            <Route path="/confirm" element={<TicketConfirmed/>}/>
            <Route path="/ticket" element={<TicketDetails />} />

            
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute role={role} allowedRoles={['operator']} redirectPath="/unauthorized" />}>
            <Route path="/admindashboard" element={<AdminDashboard />} />
            <Route path="/my-buses" element={<MyBuses />} />
            <Route path="/create-bus" element={<CreateBus />} />
            <Route path="/edit-bus/:busId" element={<EditBus />} />
            <Route path="/delete-bus/:busId" element={<DeleteBus />} />
          </Route>

         
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;