import React from "react";

const timeline = [
  {
    year: "2024",
    title: "Senior Product Engineer",
    subtitle: "BrightStack Labs",
    description: "Led UX-driven platform delivery with cross-functional teams, design systems, and core analytics features.",
  },
  {
    year: "2022",
    title: "Frontend Developer",
    subtitle: "Nova Creative",
    description: "Built modular React components, responsive landing pages, and fast interactions for B2B applications.",
  },
  {
    year: "2021",
    title: "Computer Science Graduate",
    subtitle: "State University",
    description: "Graduated with honors in Computer Science and completed a professional certification in UX design.",
  },
];

const skillBuckets = [
  { name: "React", level: 95 },
  { name: "Tailwind CSS", level: 92 },
  { name: "FastAPI", level: 88 },
  { name: "Python", level: 90 },
  { name: "SQL", level: 83 },
];

const About = () => {
  return (
    <section className="space-y-12">
      <div className="glass-card p-10">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_0.75fr] lg:items-center">
          <div className="space-y-6">
            <span className="text-sm uppercase tracking-[0.35em] text-slate-400">About Us</span>
            <h1 className="text-4xl font-bold text-white">Building Modern Digital Solutions</h1>
            <p className="text-slate-300 leading-8">
              Meenu-Dev is a software development company focused on building high-quality web applications, SaaS products, business management systems, and custom digital solutions. Our mission is to help businesses grow through modern technology and exceptional user experiences.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-soft">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Founded</p>
                <p className="mt-2 text-white">2019</p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-soft">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Expertise</p>
                <p className="mt-2 text-white">Full-Stack Web Development</p>
              </div>
            </div>
          </div>
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-8 shadow-soft">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Why Choose Us</p>
            <ul className="mt-6 space-y-4 text-slate-300">
              {[
                "Expert team with 5+ years of proven experience.",
                "Fully customized solutions tailored to your business needs.",
                "Fast, secure, and scalable technology stack.",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-sky-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[0.75fr_1fr]">
        <div className="glass-card p-10">
          <h2 className="text-3xl font-semibold text-white">Experience timeline</h2>
          <div className="mt-8 space-y-8">
            {timeline.map((item) => (
              <div key={item.year} className="relative rounded-[1.75rem] border border-white/10 bg-white/5 p-7 shadow-soft">
                <div className="absolute left-6 top-6 h-3 w-3 rounded-full bg-sky-500 shadow-[0_0_0_8px_rgba(56,189,248,0.1)]" />
                <div className="pl-8">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{item.year}</p>
                  <h3 className="mt-3 text-xl font-semibold text-white">{item.title}</h3>
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-500">{item.subtitle}</p>
                  <p className="mt-3 text-slate-300">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-10">
          <h2 className="text-3xl font-semibold text-white">Skills visualization</h2>
          <div className="mt-8 space-y-6">
            {skillBuckets.map((skill) => (
              <div key={skill.name} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>{skill.name}</span>
                  <span>{skill.level}%</span>
                </div>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-900/70">
                  <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-fuchsia-500" style={{ width: `${skill.level}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
