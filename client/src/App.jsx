import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import { LoginPage as Login } from "./pages/Login";
import Signup from "./pages/signup";
import VerifyOTP from "./pages/VerifyOTP";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import HistoryPage from "./pages/HistoryPage";
import ComplaintPage from "./pages/complaintPage";
import ResultPage from "./pages/ResultPage";
import Processing from "./pages/processing";
import Dashboard from "./pages/Dashboard";
import Howitwork from "./pages/Howitwork";
import Aboutus from "./pages/aboutus";
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
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

          <Route path="/howitwork" element={<Howitwork />} />
          <Route path="/aboutus" element={<Aboutus />} />

          {/* Complaint System Routes */}
          <Route
            path="/complaint"
            element={
              <ProtectedRoute>
                <ComplaintPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/processing"
            element={
              <ProtectedRoute>
                <Processing />
              </ProtectedRoute>
            }
          />

          <Route
            path="/result"
            element={
              <ProtectedRoute>
                <ResultPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />

        </Routes>
      </Router>
    </>
  );
}

export default App;