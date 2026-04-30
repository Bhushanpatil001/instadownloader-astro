import React, { useState, useEffect } from 'react';

export default function AdminDashboard({ adminRoute }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, latest: null });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/admin/blogs');
      const data = await res.json();
      setBlogs(data);
      setStats({
        total: data.length,
        latest: data.length > 0 ? data[0].title : 'None'
      });
    } catch (err) {
      console.error('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const res = await fetch(`/api/admin/blogs?id=${id}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) fetchBlogs();
    } catch (err) {
      alert('Failed to delete blog');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = `/${adminRoute}`;
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] pt-12 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Navigation Bar */}
        <nav className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-6">
          <div>
            <h1 className="text-4xl font-black text-white mb-2 tracking-tight">CMS Command Center</h1>
            <p className="text-gray-400 font-medium">Manage your content ecosystem with precision.</p>
          </div>
          <div className="flex gap-4">
            <a
              href={`/${adminRoute}/new`}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all active:scale-95"
            >
              <span className="text-xl">+</span> Create New Post
            </a>
            <button
              onClick={handleLogout}
              className="px-6 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all border border-red-500/20 text-red-400"
            >
              Logout
            </button>
          </div>
        </nav>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-2">Total Posts</p>
            <p className="text-5xl font-black text-white">{stats.total}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-2">Platform Status</p>
            <p className="text-xl font-bold text-green-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Encrypted & Online
            </p>
          </div>
          <div className="lg:col-span-2 bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/20 rounded-3xl p-8 backdrop-blur-xl">
            <p className="text-purple-400 text-sm font-bold uppercase tracking-widest mb-2">Latest Publication</p>
            <p className="text-xl font-bold text-white truncate italic">"{stats.latest}"</p>
          </div>
        </div>

        {/* Content Table */}
        <div className="bg-white/5 border border-white/10 rounded-[40px] overflow-hidden backdrop-blur-xl shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-8 py-6 text-sm font-bold text-gray-400 uppercase tracking-widest">Article</th>
                  <th className="px-8 py-6 text-sm font-bold text-gray-400 uppercase tracking-widest">Metadata</th>
                  <th className="px-8 py-6 text-sm font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="3" className="px-8 py-20 text-center text-gray-500 italic">Decrypting data streams...</td>
                  </tr>
                ) : blogs.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-8 py-32 text-center">
                       <div className="text-gray-500 mb-6">No articles found in the ecosystem.</div>
                       <a href={`/${adminRoute}/new`} className="text-purple-400 font-bold hover:underline">Start writing your first piece &rarr;</a>
                    </td>
                  </tr>
                ) : (
                  blogs.map((blog) => (
                    <tr key={blog.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                      <td className="px-8 py-8">
                        <div className="flex items-center gap-6">
                          <div className="w-20 h-14 rounded-xl overflow-hidden shrink-0 border border-white/10">
                            <img src={blog.image} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="text-lg font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">{blog.title}</div>
                            <div className="text-sm text-gray-500 font-mono">/{blog.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {blog.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-white/5 text-gray-400 text-[10px] uppercase font-black rounded-md border border-white/10">{tag}</span>
                          ))}
                        </div>
                        <div className="text-xs text-gray-600 font-bold uppercase tracking-tighter">Modified {new Date(blog.updatedAt).toLocaleDateString()}</div>
                      </td>
                      <td className="px-8 py-8">
                        <div className="flex items-center justify-end gap-3">
                          <a
                            href={`/blog/${blog.slug}`}
                            target="_blank"
                            className="p-3 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all"
                            title="View Public Post"
                          >
                             👁️
                          </a>
                          <a
                            href={`/${adminRoute}/edit/${blog.id}`}
                            className="p-3 rounded-xl bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-all"
                            title="Edit Content"
                          >
                            ✏️
                          </a>
                          <button
                            onClick={() => deleteBlog(blog.id)}
                            className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"
                            title="Destroy Post"
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
      </div>
    </div>
  );
}
