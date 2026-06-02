// src/pages/admin/Dashboard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <section className="space-y-8 p-6 md:p-8">
      <div className="glass-card p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Admin portal</p>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-200">
            Quick access to admin tools
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <Link to="/admin/projects" className="glass-card p-6 text-white transition hover:-translate-y-1">
          <h2 className="text-xl font-semibold">Projects</h2>
          <p className="mt-2 text-slate-300">Manage client projects and business solutions.</p>
        </Link>
        <Link to="/admin/blogs" className="glass-card p-6 text-white transition hover:-translate-y-1">
          <h2 className="text-xl font-semibold">Blogs</h2>
          <p className="mt-2 text-slate-300">Create and update articles for the content feed.</p>
        </Link>
        <Link to="/admin/skills" className="glass-card p-6 text-white transition hover:-translate-y-1">
          <h2 className="text-xl font-semibold">Skills</h2>
          <p className="mt-2 text-slate-300">Manage company capabilities and technical expertise.</p>
        </Link>
        <Link to="/admin/experience" className="glass-card p-6 text-white transition hover:-translate-y-1">
          <h2 className="text-xl font-semibold">Experience</h2>
          <p className="mt-2 text-slate-300">Keep your professional timeline up to date.</p>
        </Link>
        <Link to="/admin/education" className="glass-card p-6 text-white transition hover:-translate-y-1">
          <h2 className="text-xl font-semibold">Education</h2>
          <p className="mt-2 text-slate-300">Manage educational background entries.</p>
        </Link>
        <Link to="/admin/contact-messages" className="glass-card p-6 text-white transition hover:-translate-y-1">
          <h2 className="text-xl font-semibold">Contact Messages</h2>
          <p className="mt-2 text-slate-300">Review and respond to client inquiries and proposals.</p>
        </Link>
      </div>
    </section>
  );
}
