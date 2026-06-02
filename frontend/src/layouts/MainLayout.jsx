// src/layouts/MainLayout.jsx
import React, { useContext } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ThemeToggle from '../components/ThemeToggle';
import { ThemeContext } from '../context/ThemeContext';

const MainLayout = ({ children }) => {
  const { theme } = useContext(ThemeContext);
  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <Navbar />
      <main className="min-h-screen container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
