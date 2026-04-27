import React, { useState } from 'react';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    /* In production, POST to a backend endpoint – placeholder here */
    setSent(true);
  };

  if (sent) {
    return (
      <div className="p-12 rounded-[32px] border border-[var(--bdr)] text-center shadow-lg" style={{ background: 'var(--bg-glass)' }}>
        <div className="text-[3.5rem] mb-6">✅</div>
        <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--txt)' }}>Message Sent!</h2>
        <p className="text-[var(--txt2)] text-lg">
          Thanks for reaching out. We'll get back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <div className="p-10 rounded-[32px] border border-[var(--bdr)] shadow-md" style={{ background: 'var(--bg-glass)' }}>
      <h2 className="text-xl font-bold mb-8" style={{ color: 'var(--txt)' }}>Send us a Message</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold opacity-60 ml-1">Your Name</label>
            <input 
              name="name" type="text" required 
              className="px-5 py-4 rounded-[14px] border border-[var(--bdr)] outline-none transition-all focus:border-[var(--brand)]" 
              style={{ background: 'var(--bg-glass)', color: 'var(--txt)' }}
              placeholder="John Doe"
              value={form.name} onChange={handleChange} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold opacity-60 ml-1">Email Address</label>
            <input 
              name="email" type="email" required 
              className="px-5 py-4 rounded-[14px] border border-[var(--bdr)] outline-none transition-all focus:border-[var(--brand)]" 
              style={{ background: 'var(--bg-glass)', color: 'var(--txt)' }}
              placeholder="you@example.com"
              value={form.email} onChange={handleChange} />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold opacity-60 ml-1">Subject</label>
          <input 
            name="subject" type="text" required 
            className="px-5 py-4 rounded-[14px] border border-[var(--bdr)] outline-none transition-all focus:border-[var(--brand)]" 
            style={{ background: 'var(--bg-glass)', color: 'var(--txt)' }}
            placeholder="e.g. Bug report – Instagram downloader"
            value={form.subject} onChange={handleChange} />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold opacity-60 ml-1">Message</label>
          <textarea 
            name="message" required
            className="px-5 py-4 rounded-[14px] border border-[var(--bdr)] outline-none transition-all focus:border-[var(--brand)] min-h-[160px] resize-y"
            style={{ background: 'var(--bg-glass)', color: 'var(--txt)' }}
            placeholder="Describe your issue or question in detail…"
            value={form.message} onChange={handleChange} />
        </div>
        <div>
          <button type="submit" 
            className="px-10 py-4 rounded-2xl text-white font-bold text-lg transition-all hover:translate-x-1 active:scale-95"
            style={{ background: 'var(--g-brand)', boxShadow: '0 8px 20px -5px rgba(124,58,237,0.3)' }}>
            Send Message →
          </button>
        </div>
      </form>
    </div>
  );
}
