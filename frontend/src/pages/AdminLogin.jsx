// src/pages/AdminLogin.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('✅ Logged in');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error('❌ Login failed');
    }
  };

  return (
    <section className="mx-auto mt-16 max-w-md">
      <div className="glass-card p-10">
        <div className="space-y-4 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Admin Portal</p>
          <h1 className="text-3xl font-bold text-white">Meenu-Dev Control Panel</h1>
          <p className="text-slate-300">Manage projects, content, and client communications securely.</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-sky-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-sky-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn-primary w-full py-3">
            Login
          </button>
        </form>
      </div>
    </section>
  );
};

export default AdminLogin;



