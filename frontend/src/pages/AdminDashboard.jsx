import React, { useEffect, useState } from "react";
import { getBlogs } from "../services/blogService";
import { getProjects } from "../services/projectService";
import { getSkills, getEducations, getExperiences } from "../services/portfolioService";
import { getContactMessages } from "../services/contactService";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ projects: 0, blogs: 0, skills: 0, experiences: 0, educations: 0, messages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProjects({ skip: 0, limit: 1 }),
      getBlogs({ skip: 0, limit: 1 }),
      getSkills({ skip: 0, limit: 1 }),
      getExperiences({ skip: 0, limit: 1 }),
      getEducations({ skip: 0, limit: 1 }),
      getContactMessages({ skip: 0, limit: 1 }),
    ])
      .then(([projectsRes, blogsRes, skillsRes, experiencesRes, educationsRes, messagesRes]) => {
        setStats({
          projects: projectsRes.data.total || 0,
          blogs: blogsRes.data.total || 0,
          skills: skillsRes.data.total || 0,
          experiences: experiencesRes.data.total || 0,
          educations: educationsRes.data.total || 0,
          messages: messagesRes.data.total || 0,
        });
      })
      .catch(() => {
        setStats((prev) => ({ ...prev }));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="space-y-8">
      <div className="glass-card p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Admin dashboard</p>
            <h1 className="mt-3 text-4xl font-bold text-white">Meenu-Dev Command Center</h1>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-300">
            {loading ? 'Loading dashboard...' : 'Live API data connected'}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { label: 'Projects', value: stats.projects },
          { label: 'Blog posts', value: stats.blogs },
          { label: 'Skills', value: stats.skills },
          { label: 'Experience', value: stats.experiences },
          { label: 'Education', value: stats.educations },
          { label: 'Messages', value: stats.messages },
        ].map((card) => (
          <div key={card.label} className="glass-card p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{card.label}</p>
            <p className="mt-4 text-4xl font-bold text-white">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-white">Quick actions</h2>
          <p className="mt-3 text-slate-300">Review metrics and monitor business inquiries from clients and visitors.</p>
        </div>
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-white">Security</h2>
          <p className="mt-3 text-slate-300">Admin routes and workflows support token-based access control and safe content updates.</p>
        </div>
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-white">Performance</h2>
          <p className="mt-3 text-slate-300">The dashboard uses FastAPI endpoints for backend-driven content and metrics.</p>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
