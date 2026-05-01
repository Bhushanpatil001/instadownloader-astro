import React, { useState, useEffect } from 'react';

export default function AdminDashboard({ adminRoute }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
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

  const deleteBlog = async (id) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const res = await fetch(`/api/admin/blogs/${id}/delete`, {
        method: 'POST',
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

  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.slug.toLowerCase().includes(searchTerm.toLowerCase())
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
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <input 
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-gray-600"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30">🔍</span>
            </div>

            <a
              href={`/${adminRoute}/new`}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all active:scale-95 whitespace-nowrap"
            >
              <span className="text-xl">+</span> Create New Post
            </a>
            
            <button
              onClick={handleLogout}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-red-400 font-bold hover:bg-white/10 transition-all whitespace-nowrap"
            >
              Logout
            </button>
          </div>
        </nav>

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
                ) : filteredBlogs.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-8 py-32 text-center">
                       <div className="text-gray-500 mb-6">
                         {searchTerm ? `No results found for "${searchTerm}"` : 'No articles found in the ecosystem.'}
                       </div>
                       {!searchTerm && (
                         <a href={`/${adminRoute}/new`} className="text-purple-400 font-bold hover:underline">Start writing your first piece &rarr;</a>
                       )}
                    </td>
                  </tr>
                ) : (
                  filteredBlogs.map((blog) => (
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
