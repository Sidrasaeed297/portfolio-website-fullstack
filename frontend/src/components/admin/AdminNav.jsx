// src/components/admin/AdminNav.jsx
import { NavLink } from "react-router-dom";

export default function AdminNav() {
  const sections = [
    { to: "/admin/projects", label: "Projects" },
    { to: "/admin/blogs", label: "Blogs" },
    { to: "/admin/skills", label: "Skills" },
    { to: "/admin/experience", label: "Experience" },
    { to: "/admin/education", label: "Education" },
    { to: "/admin/contact-messages", label: "Contact Messages" },
  ];

  return (
    <nav className="bg-gray-100 dark:bg-gray-800 w-64 p-4 h-full overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
        Admin Panel
      </h2>
      <ul className="space-y-2">
        {sections.map((sec) => (
          <li key={sec.to}>
            <NavLink
              to={sec.to}
              className={({ isActive }) =>
                `block px-3 py-2 rounded hover:bg-primary/10 ${
                  isActive ? "bg-primary text-white" : "text-gray-800 dark:text-gray-200"
                }`
              }
            >
              {sec.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
