import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/signup";
import VerifyOTP from "./pages/VerifyOTP";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import ComplaintPage from "./pages/complaintPage";
import ResultPage from "./pages/ResultPage";

function App() {
  return (
    <Router>
      <Routes>

        {/* Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Complaint System Routes */}
        <Route path="/complaint" element={<ComplaintPage />} />
        <Route path="/result" element={<ResultPage />} />

      </Routes>
    </Router>
  );
}

export default App;