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
    <div className="w-full max-w-md mx-auto">
      <div className="bg-[#0f0f1a]/80 border border-white/10 backdrop-blur-2xl rounded-2xl p-6 shadow-lg">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 mb-4 text-2xl">
            🔐
          </div>
          <h1 className="text-2xl font-black text-white mb-1 tracking-tight">Encrypted Access</h1>
          <p className="text-gray-400 text-xs font-medium">Verify your credentials to enter the CMS.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-xs font-bold text-center">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">
              Terminal ID
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 transition-all text-sm"
              placeholder="Username"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">
              Access Protocol
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 transition-all text-sm"
              placeholder="Password"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">
              Encryption Key
            </label>
            <input
              type="password"
              value={formData.secretKey}
              onChange={(e) => setFormData({ ...formData, secretKey: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 transition-all text-sm"
              placeholder="Secret Key"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold uppercase tracking-wide text-sm hover:shadow-lg hover:shadow-purple-600/25 disabled:opacity-50 transition-all active:scale-[0.98]"
          >
            {loading ? 'Authenticating...' : 'Establish Connection'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
            Secure Environment v2.4.0
          </span>
        </div>
      </div>
    </div>
  );
}