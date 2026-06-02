import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { getBlogs } from '../services/blogService';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getBlogs({ skip: 0, limit: 50, q: query || undefined })
      .then((res) => setBlogs(res.data.items || []))
      .catch(() => toast.error('❗ Failed to load blogs'))
      .finally(() => setLoading(false));
  }, [query]);

  const categories = useMemo(() => {
    const tags = new Set(['All']);
    blogs.forEach((blog) => tags.add(blog.category || 'General'));
    return Array.from(tags);
  }, [blogs]);

  const visibleBlogs = blogs.filter((blog) =>
    (selectedCategory === 'All' || blog.category === selectedCategory) &&
    (blog.title.toLowerCase().includes(query.toLowerCase()) || blog.body.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <section className="space-y-8">
      <div className="glass-card p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">Blog</h1>
            <p className="mt-2 text-slate-300">Insights on product design, performance, and backend architecture.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles..."
              className="rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-sky-400"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-56 rounded-[1.75rem] bg-slate-900/70 p-6 skeleton" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {visibleBlogs.length === 0 ? (
            <div className="glass-card p-8 text-slate-300">
              No articles found yet. Try a different filter.
            </div>
          ) : (
            visibleBlogs.map((blog) => (
              <article key={blog.id} className="glass-card p-6 transition hover:-translate-y-1 hover:border-sky-400/30">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-slate-900/80 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-300">
                    {blog.category || 'General'}
                  </span>
                  <span className="text-xs text-slate-400">{new Date(blog.published_at).toLocaleDateString()}</span>
                </div>
                <h2 className="mt-4 text-2xl font-semibold text-white">{blog.title}</h2>
                <p className="mt-3 text-slate-300">{blog.body.slice(0, 140)}…</p>
              </article>
            ))
          )}
        </div>
      )}
    </section>
  );
};

export default Blog;
