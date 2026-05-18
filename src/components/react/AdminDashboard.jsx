import React, { useState, useEffect } from 'react';
import ShareForm from './ShareForm';
import TrendingForm from './TrendingForm';

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export default function AdminDashboard({ adminRoute }) {
  const [activeTab, setActiveTab] = useState('blogs');
  const [blogs, setBlogs] = useState([]);
  const [shares, setShares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showShareForm, setShowShareForm] = useState(false);
  const [addTopicTrigger, setAddTopicTrigger] = useState(0);

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
      else alert('Failed to delete blog');
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
    <div className="min-h-screen bg-[#0f0f1a] pt-10 pb-16 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Top Navigation Bar */}
        <nav className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-4">
          {/* Tab Switcher on the left */}
          <div className="flex bg-white/5 p-0.5 rounded-xl border border-white/10 w-fit shrink-0">
            <button
              onClick={() => { setActiveTab('blogs'); setShowShareForm(false); }}
              className={`px-4 py-2 rounded-[10px] font-bold text-sm transition-all ${activeTab === 'blogs' ? 'bg-purple-600 text-white shadow' : 'text-gray-500 hover:text-white'}`}
            >
              Blogs
            </button>
            <button
              onClick={() => { setActiveTab('shares'); setShowShareForm(false); }}
              className={`px-4 py-2 rounded-[10px] font-bold text-sm transition-all ${activeTab === 'shares' ? 'bg-purple-600 text-white shadow' : 'text-gray-500 hover:text-white'}`}
            >
              Shares
            </button>
            <button
              onClick={() => { setActiveTab('trending'); setShowShareForm(false); }}
              className={`px-4 py-2 rounded-[10px] font-bold text-sm transition-all ${activeTab === 'trending' ? 'bg-purple-600 text-white shadow' : 'text-gray-500 hover:text-white'}`}
            >
              Trending
            </button>
          </div>

          {/* Actions and Search on the right */}
          <div className="flex flex-col sm:flex-row gap-3 items-center w-full lg:w-auto justify-end">
            <div className="relative w-full sm:w-56">
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-gray-600"
              />
            </div>

            {activeTab === 'blogs' && (
              <a
                href={`/${adminRoute}/new`}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm hover:shadow-md transition-all active:scale-95 whitespace-nowrap"
              >
                <span className="text-lg">+</span> Create Blog
              </a>
            )}

            {activeTab === 'shares' && (
              <button
                onClick={() => setShowShareForm(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm hover:shadow-md transition-all active:scale-95 whitespace-nowrap"
              >
                <span className="text-lg">+</span> Create Share
              </button>
            )}

            {activeTab === 'trending' && (
              <button
                onClick={() => setAddTopicTrigger(prev => prev + 1)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm hover:shadow-md transition-all active:scale-95 whitespace-nowrap"
              >
                <span className="text-lg">+</span> Create Topic
              </button>
            )}

            <button
              onClick={handleLogout}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-red-400 font-bold text-sm hover:bg-white/10 transition-all whitespace-nowrap"
            >
              Logout
            </button>
          </div>
        </nav>

        {showShareForm && (
          <div className="mb-10">
            <ShareForm
              onSave={() => { setShowShareForm(false); fetchShares(); }}
              onCancel={() => setShowShareForm(false)}
            />
          </div>
        )}

        {/* Content Table or Trending Form */}
        {activeTab === 'trending' ? (
          <TrendingForm searchTerm={searchTerm} addTopicTrigger={addTopicTrigger} />
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      {activeTab === 'blogs' ? 'Article' : 'Sharable Link'}
                    </th>
                    {activeTab === 'blogs' && (
                      <>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest w-32">Short Name</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest w-40">Category</th>
                      </>
                    )}
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      {activeTab === 'blogs' ? 'Tags / Date' : 'Metadata / Stats'}
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right w-28">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={activeTab === 'blogs' ? 5 : 3} className="px-6 py-12 text-center text-gray-500 italic animate-pulse">Syncing with database...</td>
                    </tr>
                  ) : (activeTab === 'blogs' ? filteredBlogs : filteredShares).length === 0 ? (
                    <tr>
                      <td colSpan={activeTab === 'blogs' ? 5 : 3} className="px-6 py-24 text-center">
                        <div className="text-gray-500 font-medium">No {activeTab} found matching your search.</div>
                      </td>
                    </tr>
                  ) : (
                    (activeTab === 'blogs' ? filteredBlogs : filteredShares).map((item) => (
                      <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-10 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-black/40">
                              <img src={item.image} className="w-full h-full object-cover" onError={(e) => e.target.src = 'https://via.placeholder.com/150'} />
                            </div>
                            <div className="max-w-md">
                              <div className="text-base font-bold text-white mb-0.5 group-hover:text-purple-400 transition-colors truncate max-w-[300px]">{item.title}</div>
                              <div className="text-xs text-gray-500 font-mono truncate">
                                {activeTab === 'blogs' ? `/blog/${item.slug}` : `/share/${item.id}`}
                              </div>
                            </div>
                          </div>
                        </td>
                        {activeTab === 'blogs' && (
                          <>
                            <td className="px-6 py-6 text-sm font-semibold text-gray-300">
                              {item.shortName || <span className="text-gray-600 italic font-normal text-xs">None</span>}
                            </td>
                            <td className="px-6 py-6">
                              {item.category ? (
                                <div className="max-w-[200px]">
                                  <span 
                                    className="px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold rounded-full inline-block whitespace-normal break-words"
                                    title={item.category}
                                  >
                                    {item.category.length > 25 ? `${item.category.substring(0, 25)}...` : item.category}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-gray-600 italic text-xs">Uncategorized</span>
                              )}
                            </td>
                          </>
                        )}
                        <td className="px-6 py-6">
                          {activeTab === 'blogs' ? (
                            <>
                              <div className="flex flex-wrap gap-1.5 mb-1.5">
                                {item.tags?.slice(0, 3).map(tag => (
                                  <span key={tag} className="px-2 py-0.5 bg-white/5 text-gray-400 text-[10px] uppercase font-bold rounded border border-white/10 whitespace-nowrap">{tag}</span>
                                ))}
                                {(item.tags || []).length === 0 && <span className="text-gray-600 italic text-xs">No tags</span>}
                              </div>
                              <div className="text-[10px] text-gray-500 font-bold uppercase">Modified {formatDate(item.updatedAt)}</div>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] uppercase font-bold rounded border border-blue-500/20">
                                  {item.platform}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 truncate max-w-[200px]">{item.targetUrl}</div>
                            </>
                          )}
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={activeTab === 'blogs' ? `/blog/${item.slug}` : `/share/${item.id}`}
                              target="_blank"
                              className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all"
                              title="View Public"
                            >
                              👁️
                            </a>
                            {activeTab === 'blogs' ? (
                              <a
                                href={`/${adminRoute}/edit/${item.id}`}
                                className="p-2 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-all"
                                title="Edit Content"
                              >
                                ✏️
                              </a>
                            ) : (
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(`${window.location.origin}/share/${item.id}`);
                                  alert('Link copied!');
                                }}
                                className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all"
                                title="Copy Share Link"
                              >
                                🔗
                              </button>
                            )}
                            <button
                              onClick={() => activeTab === 'blogs' ? deleteBlog(item.id) : deleteShare(item.id)}
                              className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"
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