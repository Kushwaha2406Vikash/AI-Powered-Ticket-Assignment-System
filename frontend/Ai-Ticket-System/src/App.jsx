import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CheckAuth from "./component/check-auth.jsx";
import Tickets from "./pages/Tickets";
import TicketDetailsPage from "./pages/TicketDetails.jsx";
import Navbar from "./component/Navbar.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import AdminPanel from "./pages/Admin.jsx";
import Home from "./pages/Home.jsx";

function App() {
  return (
    <Router>
      <Navbar />
      
      {/* Wrapper div with margin or padding */}
      <div className="mt-20 px-4"> {/* Tailwind: margin-top 5rem, padding-x 1rem */}
        <Routes>
          <Route
            path="/"
            element={
              <CheckAuth protectedRoute={true}>
                <Home />
              </CheckAuth>
            }
          />
          <Route
            path="/tickets"
            element={
              <CheckAuth protectedRoute={true}>
                <Tickets />
              </CheckAuth>
            }
          />
          <Route
            path="/tickets/:id"
            element={
              <CheckAuth protectedRoute={true}>
                <TicketDetailsPage />
              </CheckAuth>
            }
          />
          <Route
            path="/login"
            element={
              <CheckAuth protectedRoute={false}>
                <Login />
              </CheckAuth>
            }
          />
          <Route
            path="/signup"
            element={
              <CheckAuth protectedRoute={false}>
                <Signup />
              </CheckAuth>
            }
          />
          <Route
            path="/admin"
            element={
              <CheckAuth protectedRoute={true}>
                <AdminPanel />
              </CheckAuth>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
