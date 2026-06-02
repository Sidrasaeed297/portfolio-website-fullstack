// src/components/Navbar.jsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Projects" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B1020]/80 backdrop-blur-xl transition-colors duration-300">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-4">
        <NavLink to="/" className="flex items-center gap-3 text-lg font-semibold text-white">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 to-purple-500 text-base font-black text-white shadow-glow">
            M
          </span>
          Meenu-Dev
        </NavLink>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-3 text-slate-200 md:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          <span className="text-xl">☰</span>
        </button>

        <nav className={`w-full transition-all duration-300 md:w-auto ${isOpen ? 'block' : 'hidden'} md:block`}>
          <div className="flex flex-col gap-4 rounded-[1.75rem] border border-white/10 bg-white/5 p-4 shadow-soft md:flex-row md:items-center md:bg-transparent md:border-0 md:p-0 md:shadow-none">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "rounded-full bg-slate-900/70 px-4 py-2 text-sm font-semibold text-white md:bg-transparent md:px-0 md:py-0 md:text-sky-300"
                    : "rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition hover:text-white md:px-0 md:py-0"
                }
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink
              to="/admin/login"
              onClick={() => setIsOpen(false)}
              className="btn-primary w-full justify-center md:w-auto"
            >
              Admin Login
            </NavLink>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
