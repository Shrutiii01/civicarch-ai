import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/signup";

function App() {
  return (
    <Router>
      <Routes>
        {/* The Landing page will show up on the base URL (e.g., localhost:5173/) */}
        <Route path="/" element={<Landing />} />
        
        {/* Routes for authentication pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;