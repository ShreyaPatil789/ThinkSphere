import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import SplashScreen from "./pages/SplashScreen";

import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";

import CreateBlog from "./pages/CreateBlog";
import ModulePage from "./pages/ModulePage"
import ProfilePage from "./pages/ProfilePage";
import Blogs from "./pages/Blogs"; // Blogs 
import BlogDetail from "./pages/BlogDetail";
import Notifications from "./pages/Notifications";
import EditBlog from "./pages/EditBlogs";
import PublicProfilePage from './pages/PublicProfile';
function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000); // Hide splash after 2 seconds
  }, []);

  return (
    <>
    <ToastContainer position="top-right" autoClose={3000} />
      {loading ? (
        <SplashScreen />
      ) : (
        <Routes>
          <Route path="/" element={<Welcome />} /> {/* Welcome Page as default */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
         
          <Route path="/ModulePage" element={<ModulePage />} />
          <Route path="/About" element={<About />} />


          <Route path="/ProfilePage" element={<ProfilePage />} />
          <Route path="/user/:userId" element={<PublicProfilePage />} />


          <Route path="/blogs/:category" element={<Blogs />} />
          <Route path="/create-blog" element={<CreateBlog />} />
          <Route path="/blogs/:category/:id" element={<BlogDetail />} />
         

<Route path="/notifications" element={<Notifications />} />
<Route path="/edit-blog/:id" element={<EditBlog />} />

          <Route path="*" element={<Navigate to="/" />} /> {/* Redirect to Welcome Page */}
        </Routes>
      )}
    </>
  );
}

export default App;
