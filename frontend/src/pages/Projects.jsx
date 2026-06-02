import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { getProjects } from '../services/projectService';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProjects({ skip: 0, limit: 50, q: query || undefined })
      .then((res) => setProjects(res.data.items || []))
      .catch(() => toast.error('❗ Failed to load projects'))
      .finally(() => setLoading(false));
  }, [query]);

  const techTags = useMemo(() => {
    const tags = new Set(['All']);
    projects.forEach((project) => {
      project.tech_stack?.split(',').map((item) => item.trim()).forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  }, [projects]);

  const visibleProjects = projects.filter((project) => 
    selectedTag === 'All' || project.tech_stack?.includes(selectedTag)
  );

  return (
    <section className="space-y-8">
      <div className="glass-card p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">Projects</h1>
            <p className="mt-2 text-slate-300">Recent client projects and successful business solutions we've delivered.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects..."
              className="rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-sky-400"
            />
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none"
            >
              {techTags.map((tag) => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {[1,2,3,4].map((item) => (
            <div key={item} className="h-56 rounded-[1.75rem] bg-slate-900/70 p-6 skeleton" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {visibleProjects.length === 0 ? (
            <div className="glass-card p-8 text-slate-300">
              No projects matched your search. Try a different keyword.
            </div>
          ) : (
            visibleProjects.map((project) => (
              <article key={project.id} className="glass-card p-6 transition hover:-translate-y-1 hover:border-sky-400/30">
                <div className="flex flex-col gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">{project.title}</h2>
                    <p className="mt-3 text-slate-300">{project.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.tech_stack?.split(',').map((tech) => (
                      <span key={tech} className="rounded-full bg-slate-900/80 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
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
                </div>
              </article>
            ))
          )}
        </div>
      )}
    </section>
  );
};

export default Projects;
