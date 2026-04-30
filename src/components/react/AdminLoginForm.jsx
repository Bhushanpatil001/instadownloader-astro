import React, { useState } from 'react';

export default function AdminLoginForm({ adminRoute }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    secretKey: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        window.location.href = `/${adminRoute}/dashboard`;
      } else {
        const data = await res.json();
        setError(data.error || 'Access Denied');
      }
    } catch (err) {
      setError('Connection disrupted');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md relative group">
      {/* Decorative Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-[40px] blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
      
      <div className="relative bg-[#0f0f1a]/80 border border-white/10 backdrop-blur-2xl rounded-[40px] p-10 shadow-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 mb-6 text-4xl">
            🔐
          </div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Encrypted Access</h1>
          <p className="text-gray-400 text-sm font-medium">Verify your credentials to enter the CMS ecosystem.</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold text-center animate-shake">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Terminal ID</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/5 transition-all"
              placeholder="Username"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Access Protocol</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/5 transition-all"
              placeholder="Password"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Encryption Key</label>
            <input
              type="password"
              value={formData.secretKey}
              onChange={(e) => setFormData({ ...formData, secretKey: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/5 transition-all"
              placeholder="Secret Key"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black uppercase tracking-widest hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] disabled:opacity-50 transition-all active:scale-[0.98] mt-4"
          >
            {loading ? 'Authenticating...' : 'Establish Connection'}
          </button>
        </form>

        <div className="mt-10 text-center">
          <div className="inline-block p-1 rounded-full bg-white/5">
             <div className="px-4 py-1 text-[10px] font-bold text-gray-600 uppercase tracking-widest">Secure Environment v2.4.0</div>
          </div>
        </div>
      </div>
    </div>
  );
}
