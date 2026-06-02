import React, { useState } from "react";
import toast from "react-hot-toast";
import { submitContactMessage } from "../services/contactService";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitContactMessage(form);
      toast.success("✅ Your message was delivered successfully.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      toast.error("❗ Unable to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="grid gap-10 lg:grid-cols-[0.9fr_0.7fr]">
      <div className="glass-card p-10">
        <span className="text-sm uppercase tracking-[0.35em] text-slate-400">Get In Touch</span>
        <h1 className="mt-4 text-4xl font-bold text-white">Let's Build Something Great Together</h1>
        <p className="mt-4 max-w-2xl text-slate-300 leading-8">
          Whether you need a business website, SaaS platform, management system, or custom software solution, Meenu-Dev is ready to help.
        </p>
        <div className="mt-10 grid gap-4">
          {[
            { label: "Email", value: "sidrasaeed1289@gmail.com" },
            { label: "Location", value: "Remote / Global" },
            { label: "Availability", value: "Open for new projects" },
          ].map((item) => (
            <div key={item.label} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-soft">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{item.label}</p>
              <p className="mt-2 text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-10">
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-300">Name</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-sky-400"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-300">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-sky-400"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="subject" className="mb-2 block text-sm font-medium text-slate-300">Subject</label>
            <input
              id="subject"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              required
              className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-sky-400"
              placeholder="Project collaboration, feedback, question"
            />
          </div>
          <div>
            <label htmlFor="message" className="mb-2 block text-sm font-medium text-slate-300">Message</label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={6}
              className="w-full resize-none rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-sky-400"
              placeholder="Tell me about your vision or the challenge you want to solve."
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full"
          >
            {submitting ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default Contact;
