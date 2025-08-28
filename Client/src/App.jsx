import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "../src/Components/Navbar";
import ProtectedRoute from "./Components/ProtectedRoute";

import Home from "../src/Pages/Home";
import Blog from "./Pages/Blog";
import CaseStudies from "./Pages/CaseStudies";
import Profile from "./Pages/Profile";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import ForgotPassword from "./Pages/ForgotPassword";
import WebApps from "./Pages/WebApps";
import MobileApps from "./Pages/MobileApps";
import WindowsApps from "./Pages/WindowsApps";
import DigitalMarketing from "./Pages/DigitalMarketing";
import AdShoot from "./Pages/AdShoot";
import Pricing from "./Pages/Pricing";
import CreateContent from "./Pages/CreateContent";
import BlogDetail from "./Pages/BlogDetail";
import CaseStudyDetail from "./Pages/CaseStudyDetail";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/case-studies/web-apps" element={<WebApps />} />
          <Route path="/case-studies/mobile-apps" element={<MobileApps />} />
          <Route path="/case-studies/windows-apps" element={<WindowsApps />} />
          <Route path="/case-studies/digital-marketing" element={<DigitalMarketing />} />
          <Route path="/case-studies/ad-shoot" element={<AdShoot />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/create" element={
            <ProtectedRoute requireAuth={true} requireAuthor={true}>
              <CreateContent />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
