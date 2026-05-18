import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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

  // Category dropdown state
  const [categories, setCategories] = useState([]);
  const [categoryInput, setCategoryInput] = useState('');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const categoryRef = useRef(null);

  useEffect(() => {
    const t = document.documentElement.getAttribute('data-theme') || 'dark';
    setCurrentTheme(t);

    fetch('/api/admin/blogs')
      .then(r => r.json())
      .then(blogs => {
        const unique = [...new Set(
          (Array.isArray(blogs) ? blogs : [])
            .map(b => b.category)
            .filter(Boolean)
        )].sort();
        setCategories(unique);
      })
      .catch(() => {});

    if (mode === 'edit' && blogId) {
      fetchBlog();
    }
  }, [blogId]);

  useEffect(() => {
    const handler = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const config = useMemo(() => ({
    readonly: false,
    placeholder: 'Start writing...',
    height: 400,
    theme: currentTheme === 'dark' ? 'dark' : 'light',
    toolbarButtonSize: 'small',
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
      if (blog) setFormData(prev => ({ ...prev, ...blog }));
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

  // Category helpers
  const filteredCategories = useMemo(() => {
    const q = categoryInput.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter(c => c.toLowerCase().includes(q));
  }, [categories, categoryInput]);

  const isNewCategory = useMemo(() => {
    const q = categoryInput.trim();
    return q.length > 0 && !categories.some(c => c.toLowerCase() === q.toLowerCase());
  }, [categories, categoryInput]);

  const selectCategory = useCallback((cat) => {
    setFormData(prev => ({ ...prev, category: cat }));
    setCategoryInput('');
    setCategoryOpen(false);
  }, []);

  const addNewCategory = useCallback(() => {
    const q = categoryInput.trim();
    if (!q) return;
    const formatted = q.charAt(0).toUpperCase() + q.slice(1);
    if (!categories.some(c => c.toLowerCase() === formatted.toLowerCase())) {
      setCategories(prev => [...prev, formatted].sort());
    }
    selectCategory(formatted);
  }, [categoryInput, categories, selectCategory]);

  const handleCategoryKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isNewCategory) {
        addNewCategory();
      } else if (filteredCategories.length === 1) {
        selectCategory(filteredCategories[0]);
      }
    } else if (e.key === 'Escape') {
      setCategoryOpen(false);
    }
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

  const inputStyle = "w-full px-4 py-2.5 rounded-lg border border-[var(--bdr)] bg-[var(--bg-glass)] text-[var(--txt)] text-sm focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent transition-all outline-none placeholder:text-[var(--txt3)] opacity-90 focus:opacity-100";
  const labelStyle = "block text-[10px] font-bold text-[var(--txt2)] mb-1.5 uppercase tracking-widest ml-1";

  return (
    <div className="min-h-screen pt-8 pb-16 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg-base)' }}>
      <div className="max-w-5xl mx-auto bg-[var(--bg-glass)] rounded-2xl border border-[var(--bdr)] backdrop-blur-2xl shadow-lg overflow-hidden">
        <div className="p-6 sm:p-8">
          <header className="mb-8">
            <h1 className="text-2xl font-black text-[var(--txt)] mb-1">
              {mode === 'edit' ? 'Update Article' : 'New Article'}
            </h1>
            <p className="text-[var(--txt2)] text-xs font-medium">Configure your content and metadata below.</p>
          </header>

          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm font-bold flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title and Short Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category dropdown */}
              <div ref={categoryRef} style={{ position: 'relative' }}>
                <label className={labelStyle}>Category *</label>
                <div
                  onClick={() => setCategoryOpen(o => !o)}
                  className={`${inputStyle} flex items-center justify-between cursor-pointer select-none`}
                >
                  <span className={formData.category ? '' : 'opacity-50'}>{formData.category || 'Select or type…'}</span>
                  <svg
                    style={{ flexShrink: 0, width: 14, height: 14, transform: categoryOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', opacity: 0.5 }}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={formData.category}
                  onChange={() => {}}
                  required
                  style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 1, height: 1, top: 0 }}
                  tabIndex={-1}
                />
                {categoryOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 border border-white/10 rounded-lg shadow-xl z-[10000] overflow-hidden animate-slideDown"
                       style={{ background: currentTheme === 'dark' ? '#1a1a2e' : '#ffffff' }}
                  >
                    <div style={{ padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      <input
                        autoFocus
                        type="text"
                        value={categoryInput}
                        onChange={e => setCategoryInput(e.target.value)}
                        onKeyDown={handleCategoryKeyDown}
                        placeholder="Search or create…"
                        style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: 'var(--txt)', fontSize: 13, fontWeight: 600 }}
                      />
                    </div>
                    <div className="p-1.5 grid grid-cols-1 gap-1 max-h-[220px] overflow-y-auto">
                      {filteredCategories.map(cat => (
                        <div
                          key={cat}
                          onMouseDown={() => selectCategory(cat)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all text-sm font-medium cursor-pointer ${
                            formData.category === cat
                              ? 'bg-[var(--brand)] text-white'
                              : 'text-[var(--txt2)] hover:bg-[var(--bg-glass-h)] hover:text-[var(--txt)]'
                          }`}
                        >
                          <span>
                            {categoryInput.trim() ? (
                              (() => {
                                const idx = cat.toLowerCase().indexOf(categoryInput.trim().toLowerCase());
                                if (idx === -1) return cat;
                                return <>{cat.slice(0, idx)}<strong style={{ opacity: 0.75 }}>{cat.slice(idx, idx + categoryInput.trim().length)}</strong>{cat.slice(idx + categoryInput.trim().length)}</>;
                              })()
                            ) : cat}
                          </span>
                          {formData.category === cat && (
                            <svg className="ml-auto shrink-0" width={13} height={13} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      ))}
                      {isNewCategory && (
                        <div
                          onMouseDown={addNewCategory}
                          className="flex items-center gap-2 px-3 py-2 rounded-md transition-all text-sm font-bold cursor-pointer text-[var(--brand)] hover:bg-[var(--bg-glass-h)]"
                          style={{ borderTop: filteredCategories.length ? '1px solid rgba(255,255,255,0.08)' : 'none', marginTop: filteredCategories.length ? 3 : 0 }}
                        >
                          <svg width={13} height={13} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                          </svg>
                          Create &ldquo;{categoryInput.trim().charAt(0).toUpperCase() + categoryInput.trim().slice(1)}&rdquo;
                        </div>
                      )}
                      {filteredCategories.length === 0 && !isNewCategory && (
                        <div className="px-3 py-2 text-xs font-semibold text-[var(--txt3)]">No categories found</div>
                      )}
                    </div>
                  </div>
                )}
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
              <div className="flex rounded-lg overflow-hidden border border-[var(--bdr)] bg-[var(--bg-glass)]">
                <span className="hidden sm:inline-flex items-center px-4 bg-[var(--bg-glass-h)] text-[var(--txt3)] text-[10px] font-bold uppercase border-r border-[var(--bdr)]">
                  /blog/
                </span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  className="flex-1 px-4 py-2.5 bg-transparent text-[var(--txt)] text-sm focus:ring-2 focus:ring-[var(--brand)] transition-all outline-none"
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
                className={`${inputStyle} h-24 resize-none leading-relaxed`}
                placeholder="Brief summary of the article..."
                required
              />
            </div>

            {/* Main Content (Jodit) */}
            <div>
              <label className={labelStyle}>Main Content *</label>
              <div className="rounded-lg border border-[var(--bdr)] overflow-hidden shadow-inner">
                <JoditEditor
                  ref={editor}
                  value={formData.content}
                  config={config}
                  onBlur={(newContent) => setFormData({ ...formData, content: newContent })}
                />
              </div>
            </div>

            {/* Meta Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className={labelStyle}>Meta Title</label>
                <textarea
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  className={`${inputStyle} h-20 resize-none`}
                  placeholder="Search engine title..."
                />
              </div>
              <div>
                <label className={labelStyle}>Meta Description</label>
                <textarea
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  className={`${inputStyle} h-20 resize-none`}
                  placeholder="Search engine description..."
                />
              </div>
              <div>
                <label className={labelStyle}>Meta Keywords</label>
                <textarea
                  value={formData.metaKeys}
                  onChange={(e) => setFormData({ ...formData, metaKeys: e.target.value })}
                  className={`${inputStyle} h-20 resize-none`}
                  placeholder="Keywords (comma separated)..."
                />
              </div>
            </div>

            {/* Tags Area */}
            <div>
              <label className={labelStyle}>Tags (Management)</label>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {formData.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 bg-[var(--brand)]/10 text-[var(--brand)] text-[10px] font-bold uppercase rounded border border-[var(--brand)]/20 flex items-center gap-1.5 group transition-all hover:bg-[var(--brand)] hover:text-white">
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

            {/* Image Section (last) */}
            <div className="pt-6 border-t border-[var(--bdr)] space-y-5">
              <label className={labelStyle}>Featured Media & Preview</label>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className={inputStyle}
                    placeholder="Paste cover image URL"
                  />
                  <p className="mt-1 text-[var(--txt3)] text-[10px] font-medium uppercase tracking-wider ml-1">Original URL saved for high resolution.</p>
                </div>
                <div className="lg:col-span-1">
                  <div className="rounded-lg overflow-hidden border border-[var(--bdr)] aspect-video bg-[var(--bg-glass)] flex items-center justify-center relative">
                    {formData.image ? (
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-[var(--txt3)] text-[10px] font-bold uppercase">No Image</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-8">
              <a
                href={`/${adminRoute}/dashboard`}
                className="px-8 py-2.5 rounded-lg bg-[var(--bg-glass-h)] text-[var(--txt)] font-bold uppercase tracking-wide text-sm border border-[var(--bdr)] hover:bg-[var(--bdr)] transition-all text-center"
              >
                Cancel
              </a>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold uppercase tracking-wide text-sm hover:shadow-md hover:shadow-purple-600/20 disabled:opacity-50 transition-all active:scale-95"
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