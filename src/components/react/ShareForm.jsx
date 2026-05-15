import React, { useState } from 'react';

export default function ShareForm({ onSave, onCancel, initialData = null }) {
  const [formData, setFormData] = useState(initialData || {
    targetUrl: '',
    title: '',
    description: '',
    image: '',
    platform: 'instagram'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/shares', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const saved = await res.json();
        onSave(saved);
      } else {
        alert('Failed to save shareable link');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving shareable link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl">
      <h2 className="text-2xl font-bold text-white mb-6">
        {initialData ? 'Edit Sharable Link' : 'Create New Sharable Link'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Target URL</label>
          <input 
            type="url" 
            required
            placeholder="https://www.instagram.com/reel/..."
            value={formData.targetUrl}
            onChange={(e) => setFormData({...formData, targetUrl: e.target.value})}
            className="w-full px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Platform</label>
            <select 
              value={formData.platform}
              onChange={(e) => setFormData({...formData, platform: e.target.value})}
              className="w-full px-5 py-3.5 rounded-2xl bg-[#1a1a2e] border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
            >
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
              <option value="facebook">Facebook</option>
              <option value="tiktok">TikTok</option>
              <option value="pinterest">Pinterest</option>
              <option value="x">X / Twitter</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Preview Title</label>
            <input 
              type="text" 
              required
              placeholder="e.g., Awesome Instagram Reel"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Preview Description</label>
          <textarea 
            rows="3"
            placeholder="Enter a catchy description for social media previews..."
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Preview Image URL (Thumbnail)</label>
          <input 
            type="url" 
            placeholder="https://example.com/image.jpg"
            value={formData.image}
            onChange={(e) => setFormData({...formData, image: e.target.value})}
            className="w-full px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Create Sharable Link'}
          </button>
          <button 
            type="button" 
            onClick={onCancel}
            className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 font-bold hover:bg-white/10 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
