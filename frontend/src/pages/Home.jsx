// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProjects } from "../services/projectService";
import { getSkills } from "../services/portfolioService";
import { getBlogs } from "../services/blogService";

const Home = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [stats, setStats] = useState({ projects: 50, articles: 0, clients: 20, experience: 5 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProjects({ skip: 0, limit: 4 }),
      getSkills({ skip: 0, limit: 6 }),
      getBlogs({ skip: 0, limit: 3 }),
    ])
      .then(([projectsRes, skillsRes, blogsRes]) => {
        setProjects(projectsRes.data.items || []);
        setSkills(skillsRes.data.items || []);
        setStats((prev) => ({
          ...prev,
          projects: projectsRes.data.total || 0,
          articles: blogsRes.data.total || 0,
        }));
      })
      .catch(() => {
        setSkills([
          { name: "React", category: "Frontend", proficiency: 95 },
          { name: "Tailwind", category: "Styling", proficiency: 90 },
          { name: "FastAPI", category: "Backend", proficiency: 88 },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="space-y-14 pb-20">
      <div className="glass-card overflow-hidden p-10 relative">
        <div className="absolute right-[-3rem] top-10 h-48 w-48 rounded-full bg-gradient-to-br from-sky-500/30 via-purple-500/20 to-transparent blur-3xl" />
        <div className="absolute left-[-2rem] bottom-8 h-40 w-40 rounded-full bg-gradient-to-tr from-fuchsia-500/25 to-transparent blur-3xl" />
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-slate-300">
              Full-stack product design
            </span>
            <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-white sm:text-6xl">
              We Build Modern Web Applications That Scale.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-300">
              We design and develop modern web applications, SaaS platforms, admin dashboards, and business solutions using React, FastAPI, and modern cloud technologies. From concept to deployment, Meenu-Dev delivers fast, secure, and scalable digital experiences.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => navigate("/projects")} className="btn-primary">
                Explore Projects
              </button>
              <button onClick={() => navigate("/contact")} className="btn-secondary">
                Start a Project
              </button>
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-8 shadow-soft">
            <div className="space-y-6">
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Stats</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-900/80 p-5 text-center">
                    <p className="text-3xl font-semibold text-white">{stats.projects}+</p>
                    <p className="mt-2 text-sm text-slate-400">Projects Delivered</p>
                  </div>
                  <div className="rounded-3xl bg-slate-900/80 p-5 text-center">
                    <p className="text-3xl font-semibold text-white">{stats.clients}+</p>
                    <p className="mt-2 text-sm text-slate-400">Business Clients</p>
                  </div>
                  <div className="rounded-3xl bg-slate-900/80 p-5 text-center">
                    <p className="text-3xl font-semibold text-white">{stats.experience}+</p>
                    <p className="mt-2 text-sm text-slate-400">Years Experience</p>
                  </div>
                  <div className="rounded-3xl bg-slate-900/80 p-5 text-center">
                    <p className="text-3xl font-semibold text-white">99%</p>
                    <p className="mt-2 text-sm text-slate-400">Client Satisfaction</p>
                  </div>
                </div>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Skills</p>
                <div className="mt-6 grid gap-4">
                  {(loading ? [{ name: "Loading...", proficiency: 76 }, { name: "Loading...", proficiency: 89 }] : skills).slice(0, 3).map((skill) => (
                    <div key={skill.name}>
                      <div className="flex items-center justify-between text-sm text-slate-200">
                        <span>{skill.name}</span>
                        <span>{skill.proficiency}%</span>
                      </div>
                      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-fuchsia-500" style={{ width: `${skill.proficiency}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="glass-card p-10">
          <span className="text-sm uppercase tracking-[0.35em] text-slate-400">Our Services</span>
          <h2 className="mt-4 text-3xl font-semibold text-white">What We Deliver</h2>
          <p className="mt-4 text-slate-300 leading-7">
            End-to-end solutions that combine modern UI, secure backend APIs, and efficient deployment workflows.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              { title: "Custom Web Applications", description: "Tailored solutions for your business needs." },
              { title: "SaaS Development", description: "Scalable platforms with multi-tenant architecture." },
              { title: "Business Management Systems", description: "Admin dashboards and operational tools." },
              { title: "API Development", description: "RESTful backends with FastAPI and modern tech." },
            ].map((item) => (
              <div key={item.title} className="rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-6">
                <h3 className="font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-10">
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Recent Work</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">Client Projects</h2>
            </div>
            <div className="grid gap-6">
              {loading ? (
                [1, 2, 3].map((item) => (
                  <div key={item} className="h-40 rounded-[1.75rem] bg-slate-900/80 skeleton" />
                ))
              ) : (
                projects.slice(0, 3).map((project) => (
                  <article key={project.id} className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-6 transition hover:-translate-y-1 hover:border-sky-400/40">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-400">{project.tech_stack || 'Product'}</p>
                    <h3 className="mt-3 text-2xl font-semibold text-white">{project.title}</h3>
                    <p className="mt-3 text-slate-300">{project.description}</p>
                    <div className="mt-5 flex flex-wrap gap-3">
                      {project.demo_url && (
                        <a href={project.demo_url} target="_blank" rel="noreferrer" className="btn-secondary">
                          Live Demo
                        </a>
                      )}
                      {project.repo_url && (
                        <a href={project.repo_url} target="_blank" rel="noreferrer" className="btn-secondary">
                          GitHub
                        </a>
                      )}
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
