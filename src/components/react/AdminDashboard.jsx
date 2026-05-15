import React, { useState, useEffect } from 'react';
import ShareForm from './ShareForm';
import TrendingForm from './TrendingForm';

export default function AdminDashboard({ adminRoute }) {
  const [activeTab, setActiveTab] = useState('blogs'); // 'blogs', 'shares', or 'trending'
  const [blogs, setBlogs] = useState([]);
  const [shares, setShares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showShareForm, setShowShareForm] = useState(false);

  useEffect(() => {
    if (activeTab === 'blogs') {
      fetchBlogs();
    } else if (activeTab === 'shares') {
      fetchShares();
    }
  }, [activeTab]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/blogs');
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      console.error('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  const fetchShares = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/shares');
      const data = await res.json();
      setShares(data);
    } catch (err) {
      console.error('Failed to fetch shares');
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) fetchBlogs();
      else alert('Failed to delete blog: ' + res.statusText);
    } catch (err) {
      alert('Failed to delete blog');
    }
  };

  const deleteShare = async (id) => {
    if (!confirm('Are you sure you want to delete this share link?')) return;
    try {
      const res = await fetch(`/api/admin/shares?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) fetchShares();
    } catch (err) {
      alert('Failed to delete share');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = `/${adminRoute}`;
  };

  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredShares = shares.filter(share => 
    share.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    share.targetUrl.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0f0f1a] pt-12 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Navigation Bar */}
        <nav className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black text-white mb-2 tracking-tight">CMS Command Center</h1>
            <p className="text-gray-400 font-medium">Manage your content ecosystem with precision.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* Tab Switcher */}
            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 mr-4">
              <button 
                onClick={() => { setActiveTab('blogs'); setShowShareForm(false); }}
                className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'blogs' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
              >
                Blogs
              </button>
              <button 
                onClick={() => { setActiveTab('shares'); setShowShareForm(false); }}
                className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'shares' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
              >
                Shares
              </button>
              <button 
                onClick={() => { setActiveTab('trending'); setShowShareForm(false); }}
                className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'trending' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
              >
                Trending
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <input 
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-gray-600"
              />
            </div>

            {activeTab === 'blogs' && (
              <a
                href={`/${adminRoute}/new`}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all active:scale-95 whitespace-nowrap"
              >
                <span className="text-xl">+</span> Create Blog
              </a>
            )}
            
            {activeTab === 'shares' && (
              <button
                onClick={() => setShowShareForm(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all active:scale-95 whitespace-nowrap"
              >
                <span className="text-xl">+</span> Create Share
              </button>
            )}
            
            <button
              onClick={handleLogout}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-red-400 font-bold hover:bg-white/10 transition-all whitespace-nowrap"
            >
              Logout
            </button>
          </div>
        </nav>

        {showShareForm && (
          <div className="mb-12">
            <ShareForm 
              onSave={() => { setShowShareForm(false); fetchShares(); }}
              onCancel={() => setShowShareForm(false)}
            />
          </div>
        )}

        {/* Content Table or Trending Form */}
        {activeTab === 'trending' ? (
          <TrendingForm />
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-[40px] overflow-hidden backdrop-blur-xl shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="px-8 py-6 text-sm font-bold text-gray-400 uppercase tracking-widest">
                      {activeTab === 'blogs' ? 'Article' : 'Sharable Link'}
                    </th>
                    <th className="px-8 py-6 text-sm font-bold text-gray-400 uppercase tracking-widest">Metadata / Stats</th>
                    <th className="px-8 py-6 text-sm font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="3" className="px-8 py-20 text-center text-gray-500 italic">Syncing with neural network...</td>
                    </tr>
                  ) : (activeTab === 'blogs' ? filteredBlogs : filteredShares).length === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-8 py-32 text-center">
                        <div className="text-gray-500 mb-6">
                          No {activeTab} found matching your criteria.
                        </div>
                      </td>
                    </tr>
                  ) : (
                    (activeTab === 'blogs' ? filteredBlogs : filteredShares).map((item) => (
                      <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                        <td className="px-8 py-8">
                          <div className="flex items-center gap-6">
                            <div className="w-20 h-14 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-black/40">
                              <img src={item.image} className="w-full h-full object-cover" onError={(e) => e.target.src = 'https://via.placeholder.com/150'} />
                            </div>
                            <div className="max-w-md">
                              <div className="text-lg font-bold text-white mb-1 group-hover:text-purple-400 transition-colors truncate">{item.title}</div>
                              <div className="text-sm text-gray-500 font-mono truncate">
                                {activeTab === 'blogs' ? `/blog/${item.slug}` : `/share/${item.id}`}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-8">
                          {activeTab === 'blogs' ? (
                            <>
                              <div className="flex flex-wrap gap-2 mb-2">
                                {item.tags?.slice(0, 2).map(tag => (
                                  <span key={tag} className="px-2 py-0.5 bg-white/5 text-gray-400 text-[10px] uppercase font-black rounded-md border border-white/10">{tag}</span>
                                ))}
                              </div>
                              <div className="text-xs text-gray-600 font-bold uppercase tracking-tighter">Modified {new Date(item.updatedAt).toLocaleDateString()}</div>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] uppercase font-black rounded-md border border-blue-500/20">
                                  {item.platform}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 truncate max-w-[250px]">{item.targetUrl}</div>
                            </>
                          )}
                        </td>
                        <td className="px-8 py-8">
                          <div className="flex items-center justify-end gap-3">
                            <a
                              href={activeTab === 'blogs' ? `/blog/${item.slug}` : `/share/${item.id}`}
                              target="_blank"
                              className="p-3 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all"
                              title="View Public"
                            >
                               👁️
                            </a>
                            {activeTab === 'blogs' ? (
                              <a
                                href={`/${adminRoute}/edit/${item.id}`}
                                className="p-3 rounded-xl bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-all"
                                title="Edit Content"
                              >
                                ✏️
                              </a>
                            ) : (
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(`${window.location.origin}/share/${item.id}`);
                                  alert('Link copied to clipboard!');
                                }}
                                className="p-3 rounded-xl bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all"
                                title="Copy Share Link"
                              >
                                🔗
                              </button>
                            )}
                            <button
                              onClick={() => activeTab === 'blogs' ? deleteBlog(item.id) : deleteShare(item.id)}
                              className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
