import React, { useState, useEffect, useRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';

export default function BlogForm({ adminRoute, mode = 'create', blogId = null }) {
  const editor = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    shortName: '',
    slug: '',
    description: '',
    content: '',
    image: '',
    tags: [],
    category: '',
    readTime: '',
    metaTitle: '',
    metaDescription: '',
    metaKeys: ''
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentTheme, setCurrentTheme] = useState('dark');

  useEffect(() => {
    const t = document.documentElement.getAttribute('data-theme') || 'dark';
    setCurrentTheme(t);
    
    if (mode === 'edit' && blogId) {
      fetchBlog();
    }
  }, [blogId]);

  const config = useMemo(() => ({
    readonly: false,
    placeholder: 'Start writing...',
    height: 500,
    theme: currentTheme === 'dark' ? 'dark' : 'light',
    toolbarButtonSize: 'middle',
    buttons: [
      'bold', 'italic', 'underline', 'strikethrough', '|',
      'ul', 'ol', '|',
      'outdent', 'indent', '|',
      'font', 'fontsize', 'brush', 'paragraph', '|',
      'image', 'table', 'link', '|',
      'align', 'undo', 'redo', '|',
      'hr', 'eraser', 'fullsize', 'source'
    ]
  }), [currentTheme]);

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    const newSlug = newTitle.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/--+/g, '-').trim();
    setFormData({ ...formData, title: newTitle, slug: newSlug });
  };

  const fetchBlog = async () => {
    try {
      const res = await fetch('/api/admin/blogs');
      const blogs = await res.json();
      const blog = blogs.find(b => b.id === blogId);
      if (blog) setFormData({
        ...formData,
        ...blog
      });
    } catch (err) {
      setError('Failed to fetch blog');
    }
  };

  const handleTagAdd = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      }
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/blogs${mode === 'edit' ? `?id=${blogId}` : ''}`, {
        method: mode === 'edit' ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mode === 'edit' ? { ...formData, id: blogId } : formData)
      });

      if (res.ok) {
        window.location.href = `/${adminRoute}/dashboard`;
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to save blog');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full px-4 py-3 rounded-xl border border-[var(--bdr)] bg-[var(--bg-glass)] text-[var(--txt)] focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent transition-all outline-none placeholder:text-[var(--txt3)] opacity-80 focus:opacity-100";
  const labelStyle = "block text-xs font-black text-[var(--txt2)] mb-2 uppercase tracking-widest ml-1";

  return (
    <div className="min-h-screen pt-12 pb-24 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg-base)' }}>
      <div className="max-w-5xl mx-auto bg-[var(--bg-glass)] rounded-[40px] border border-[var(--bdr)] backdrop-blur-3xl shadow-2xl overflow-hidden">
        <div className="p-10 sm:p-14">
          <header className="mb-12">
            <h1 className="text-3xl font-black text-[var(--txt)] mb-2">
              {mode === 'edit' ? 'Update Article' : 'New Article'}
            </h1>
            <p className="text-[var(--txt2)] text-sm font-medium">Configure your content and metadata below.</p>
          </header>

          {error && (
            <div className="mb-10 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-bold flex items-center gap-3 animate-pulse">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* Title and Short Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className={labelStyle}>Article Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={handleTitleChange}
                  className={inputStyle}
                  placeholder="Article Title"
                  required
                />
              </div>
              <div>
                <label className={labelStyle}>Short Name</label>
                <input
                  type="text"
                  value={formData.shortName}
                  onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                  className={inputStyle}
                  placeholder="Short Name"
                />
              </div>
            </div>

            {/* Category and Read Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className={labelStyle}>Category *</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={inputStyle}
                  placeholder="e.g. Technology"
                  required
                />
              </div>
              <div>
                <label className={labelStyle}>Read Time *</label>
                <input
                  type="text"
                  value={formData.readTime}
                  onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                  className={inputStyle}
                  placeholder="e.g. 5 min read"
                  required
                />
              </div>
            </div>


            {/* URL / Slug */}
            <div>
              <label className={labelStyle}>Access URL (Slug)</label>
              <div className="flex rounded-xl overflow-hidden border border-[var(--bdr)] bg-[var(--bg-glass)]">
                <span className="hidden sm:inline-flex items-center px-5 bg-[var(--bg-glass-h)] text-[var(--txt3)] text-[10px] font-black uppercase border-r border-[var(--bdr)]">
                  /blog/
                </span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  className="flex-1 px-5 py-4 bg-transparent text-[var(--txt)] focus:ring-2 focus:ring-[var(--brand)] transition-all outline-none"
                  placeholder="url-slug"
                  required
                />
              </div>
            </div>

            {/* Short Description */}
            <div>
              <label className={labelStyle}>Article Synopsis *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={`${inputStyle} h-28 resize-none leading-relaxed`}
                placeholder="Brief summary of the article..."
                required
              />
            </div>

            {/* Main Description (Jodit) */}
            <div>
              <label className={labelStyle}>Main Content *</label>
              <div className="rounded-2xl border border-[var(--bdr)] overflow-hidden shadow-inner">
                <JoditEditor
                  ref={editor}
                  value={formData.content}
                  config={config}
                  onBlur={(newContent) => setFormData({ ...formData, content: newContent })}
                />
              </div>
            </div>

            {/* Meta Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
              <div>
                <label className={labelStyle}>Meta Title</label>
                <textarea
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  className={`${inputStyle} h-24 resize-none`}
                  placeholder="Search engine title..."
                />
              </div>
              <div>
                <label className={labelStyle}>Meta Description</label>
                <textarea
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  className={`${inputStyle} h-24 resize-none`}
                  placeholder="Search engine description..."
                />
              </div>
              <div>
                <label className={labelStyle}>Meta Keywords</label>
                <textarea
                  value={formData.metaKeys}
                  onChange={(e) => setFormData({ ...formData, metaKeys: e.target.value })}
                  className={`${inputStyle} h-24 resize-none`}
                  placeholder="Keywords (comma separated)..."
                />
              </div>
            </div>

            {/* Tags Area */}
            <div>
              <label className={labelStyle}>Tags (Management)</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.tags.map(tag => (
                  <span key={tag} className="px-3 py-1.5 bg-[var(--brand)]/10 text-[var(--brand)] text-[10px] font-black uppercase rounded-lg border border-[var(--brand)]/20 flex items-center gap-2 group transition-all hover:bg-[var(--brand)] hover:text-white">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="opacity-50 hover:opacity-100 transition-opacity">×</button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagAdd}
                className={inputStyle}
                placeholder="Type and press Enter to add tags"
              />
            </div>

            {/* Image Section Moved to Last (per request) */}
            <div className="pt-10 border-t border-[var(--bdr)] space-y-6">
               <label className={labelStyle}>Featured Media & Preview</label>
               <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  <div className="lg:col-span-3">
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className={inputStyle}
                      placeholder="Paste cover image URL (Unsplash, etc.)"
                    />
                    <p className="mt-2 text-[var(--txt3)] text-[10px] font-medium uppercase tracking-wider ml-1">Original image URL will be saved for high-resolution display.</p>
                  </div>
                  <div className="lg:col-span-1">
                    <div className="rounded-2xl overflow-hidden border border-[var(--bdr)] aspect-video bg-[var(--bg-glass)] flex items-center justify-center relative group">
                      {formData.image ? (
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-[var(--txt3)] text-[10px] font-black uppercase">No Image</div>
                      )}
                    </div>
                  </div>
               </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-5 pt-12">
              <a
                href={`/${adminRoute}/dashboard`}
                className="px-10 py-4 rounded-2xl bg-[var(--bg-glass-h)] text-[var(--txt)] font-black uppercase tracking-widest border border-[var(--bdr)] hover:bg-[var(--bdr)] transition-all text-center"
              >
                Cancel
              </a>
              <button
                type="submit"
                disabled={loading}
                className="px-10 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black uppercase tracking-widest hover:shadow-[0_0_40px_rgba(124,58,237,0.3)] disabled:opacity-50 transition-all active:scale-95"
              >
                {loading ? 'Processing...' : mode === 'edit' ? 'Update Article' : 'Publish Article'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
