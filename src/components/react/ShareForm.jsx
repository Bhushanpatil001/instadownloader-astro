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
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.targetUrl) newErrors.targetUrl = 'Target URL is required';
    if (!formData.title) newErrors.title = 'Title is required';
    if (formData.targetUrl && !formData.targetUrl.match(/^https?:\/\/.+/)) {
      newErrors.targetUrl = 'Please enter a valid URL (starting with http:// or https://)';
    }
    if (formData.image && !formData.image.match(/^https?:\/\/.+/)) {
      newErrors.image = 'Please enter a valid image URL';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
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
        const error = await res.json();
        alert(error.message || 'Failed to save shareable link');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving shareable link');
    } finally {
      setLoading(false);
    }
  };

  const platformIcons = {
    instagram: '📸',
    youtube: '▶️',
    facebook: '📘',
    tiktok: '🎵',
    pinterest: '📌',
    x: '𝕏',
    other: '🔗'
  };

  return (
    <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl overflow-hidden">
      {/* Decorative gradient blobs */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-600/20 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="relative p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {initialData ? 'Edit Sharable Link' : 'Create New Sharable Link'}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Target URL */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Target URL <span className="text-red-400">*</span>
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors">
                🔗
              </div>
              <input 
                type="url" 
                required
                placeholder="https://www.instagram.com/reel/..."
                value={formData.targetUrl}
                onChange={(e) => setFormData({...formData, targetUrl: e.target.value})}
                className={`w-full pl-11 pr-5 py-3.5 rounded-xl bg-white/5 border ${
                  errors.targetUrl ? 'border-red-500/50' : 'border-white/10'
                } text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 transition-all group-hover:bg-white/10`}
              />
            </div>
            {errors.targetUrl && (
              <p className="text-red-400 text-xs mt-1 ml-1">{errors.targetUrl}</p>
            )}
          </div>

          {/* Platform and Title Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Platform <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <select 
                  value={formData.platform}
                  onChange={(e) => setFormData({...formData, platform: e.target.value})}
                  className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50 appearance-none cursor-pointer hover:bg-white/10 transition-colors"
                >
                  {Object.entries(platformIcons).map(([value, icon]) => (
                    <option key={value} value={value} className="bg-[#1a1a2e]">
                      {icon} {value.charAt(0).toUpperCase() + value.slice(1)}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  ▼
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Preview Title <span className="text-red-400">*</span>
              </label>
              <input 
                type="text" 
                required
                placeholder="e.g., Amazing sunset timelapse"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className={`w-full px-5 py-3.5 rounded-xl bg-white/5 border ${
                  errors.title ? 'border-red-500/50' : 'border-white/10'
                } text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 transition-all hover:bg-white/10`}
              />
              {errors.title && (
                <p className="text-red-400 text-xs mt-1 ml-1">{errors.title}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Preview Description
            </label>
            <textarea 
              rows="3"
              placeholder="Write a catchy description that makes people want to click..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 transition-all resize-none hover:bg-white/10"
            />
            <p className="text-gray-600 text-xs mt-1 ml-1">
              {formData.description.length}/500 characters
            </p>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Preview Image URL
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors">
                🖼️
              </div>
              <input 
                type="url" 
                placeholder="https://example.com/thumbnail.jpg"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                className={`w-full pl-11 pr-5 py-3.5 rounded-xl bg-white/5 border ${
                  errors.image ? 'border-red-500/50' : 'border-white/10'
                } text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 transition-all group-hover:bg-white/10`}
              />
            </div>
            {errors.image && (
              <p className="text-red-400 text-xs mt-1 ml-1">{errors.image}</p>
            )}
            
            {/* Image Preview */}
            {formData.image && (
              <div className="mt-3 flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-black/40 flex-shrink-0">
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150?text=Invalid+URL';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 truncate">{formData.image}</p>
                  <p className="text-[10px] text-gray-600 mt-0.5">Thumbnail preview</p>
                </div>
              </div>
            )}
          </div>

          {/* Live Preview Card */}
          {(formData.title || formData.description) && (
            <div className="mt-6 p-5 rounded-xl bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20">
              <p className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-3">📱 Live Preview</p>
              <div className="flex gap-3">
                {formData.image && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-black/40 flex-shrink-0">
                    <img src={formData.image} className="w-full h-full object-cover" alt="" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{platformIcons[formData.platform]}</span>
                    <p className="font-semibold text-white text-sm">{formData.title || 'Untitled'}</p>
                  </div>
                  <p className="text-gray-400 text-xs line-clamp-2">{formData.description || 'No description provided'}</p>
                  <p className="text-[10px] text-gray-600 mt-2 truncate">{formData.targetUrl || 'https://...'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    {initialData ? '💾 Update Share Link' : '✨ Create Share Link'}
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
            <button 
              type="button" 
              onClick={onCancel}
              className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-bold hover:bg-white/10 hover:text-white transition-all active:scale-95"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}