import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./pages/lan";
import Login from "./pages/Login";
import AuthPage from "./pages/Register";
import Home from "./pages/Home";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/profilePage";
import MessagePage from "./pages/MessagePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="/message" element={<MessagePage />} />
      </Routes>
    </Router>
  );
}

export default App;
