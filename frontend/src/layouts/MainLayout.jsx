// src/layouts/MainLayout.jsx
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = ({ children }) => (
  <div className="min-h-screen bg-[#0B1020] text-slate-100">
    <Navbar />
    <main className="container mx-auto px-4 py-10 md:px-6">
      {children}
    </main>
    <Footer />
  </div>
);

export default MainLayout;
