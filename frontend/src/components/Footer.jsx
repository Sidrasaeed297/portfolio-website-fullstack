// src/components/Footer.jsx
import React from "react";

const Footer = () => (
  <footer className="border-t border-white/10 bg-[#0B1020] text-slate-400 py-8">
    <div className="container mx-auto px-4 text-center">
      <p className="text-sm text-slate-500">
        © {new Date().getFullYear()} Meenu-Dev. All rights reserved.
      </p>
      <p className="text-xs text-slate-600 mt-2">
        Building modern software solutions for businesses worldwide.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-4 text-sm text-slate-400">
        <a href="https://github.com/" className="transition hover:text-white" target="_blank" rel="noreferrer">GitHub</a>
        <a href="https://www.linkedin.com/" className="transition hover:text-white" target="_blank" rel="noreferrer">LinkedIn</a>
        <a href="mailto:sidrasaeed1289@gmail.com" className="transition hover:text-white">sidrasaeed1289@gmail.com</a>
      </div>
    </div>
  </footer>
);

export default Footer;
