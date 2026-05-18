import React, { useState, useEffect } from 'react';

const PLATFORMS = [
    { id: 'instagram', name: 'Instagram' },
    { id: 'youtube', name: 'YouTube' },
    { id: 'facebook', name: 'Facebook' },
    { id: 'pinterest', name: 'Pinterest' },
    { id: 'x', name: 'X (Twitter)' }
];

export default function TrendingForm({ searchTerm = '', addTopicTrigger = 0 }) {
    const [trending, setTrending] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [editingIndex, setEditingIndex] = useState(null);

    useEffect(() => {
        fetchTrendingData();
    }, []);

    useEffect(() => {
        if (addTopicTrigger > 0) {
            addNewTopic();
        }
    }, [addTopicTrigger]);

    const fetchTrendingData = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/trending');
            const data = await res.json();
            setTrending(data.trending || []);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to load trending data' });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            const res = await fetch('/api/admin/trending', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ trending })
            });
            if (res.ok) {
                setMessage({ type: 'success', text: 'Trending data updated successfully!' });
                setEditingIndex(null);
            } else {
                throw new Error('Failed to save');
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to save trending data' });
        } finally {
            setSaving(false);
        }
    };

    const addNewTopic = () => {
        const newTopic = {
            name: '',
            slug: '',
            platforms: {}
        };
        setTrending([...trending, newTopic]);
        setEditingIndex(trending.length);
    };

    const removeTopic = (index) => {
        if (confirm('Are you sure you want to remove this topic?')) {
            const newTrending = trending.filter((_, i) => i !== index);
            setTrending(newTrending);
            if (editingIndex === index) setEditingIndex(null);
            else if (editingIndex > index) setEditingIndex(editingIndex - 1);
        }
    };

    const updateTopicField = (index, field, value) => {
        const newTrending = [...trending];
        newTrending[index][field] = value;
        if (field === 'name') {
            newTrending[index].slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
        }
        setTrending(newTrending);
    };

    const addPlatformToTopic = (topicIndex, platformId) => {
        if (!platformId) return;
        const newTrending = [...trending];
        if (!newTrending[topicIndex].platforms[platformId]) {
            newTrending[topicIndex].platforms[platformId] = [];
            setTrending(newTrending);
        }
    };

    const removePlatformFromTopic = (topicIndex, platformId) => {
        const newTrending = [...trending];
        delete newTrending[topicIndex].platforms[platformId];
        setTrending(newTrending);
    };

    const addUrlToPlatform = (topicIndex, platformId, url) => {
        if (!url) return;
        const newTrending = [...trending];
        if (!newTrending[topicIndex].platforms[platformId].includes(url)) {
            newTrending[topicIndex].platforms[platformId].push(url);
            setTrending(newTrending);
        }
    };

    const removeUrlFromPlatform = (topicIndex, platformId, urlIndex) => {
        const newTrending = [...trending];
        newTrending[topicIndex].platforms[platformId] = newTrending[topicIndex].platforms[platformId].filter((_, i) => i !== urlIndex);
        setTrending(newTrending);
    };

    if (loading) return <div className="text-center py-20 text-gray-500 italic">Syncing trending matrix...</div>;

    return (
        <div className="space-y-6">

            {message.text && (
                <div className={`p-3 rounded-lg text-center text-sm font-bold ${
                    message.type === 'success' 
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Topic List */}
                <div className="lg:col-span-1 space-y-3">
                    {trending
                        .map((topic, index) => ({ topic, originalIndex: index }))
                        .filter(item => item.topic.name.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map(({ topic, originalIndex }) => (
                            <div 
                                key={originalIndex}
                                onClick={() => setEditingIndex(originalIndex)}
                                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                    editingIndex === originalIndex 
                                        ? 'bg-purple-600/20 border-purple-500/50 shadow-md' 
                                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                                }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-white text-base">{topic.name || 'Untitled Topic'}</h3>
                                        <p className="text-xs text-gray-500 font-mono mt-0.5">/{topic.slug}</p>
                                    </div>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); removeTopic(originalIndex); }}
                                        className="p-1.5 text-gray-500 hover:text-red-500 transition-colors"
                                    >
                                        🗑️
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-1.5 mt-3">
                                    {Object.keys(topic.platforms || {}).map(p => (
                                        <span key={p} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-[10px] uppercase font-bold text-gray-400">
                                            {p}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))
                    }
                </div>

                {/* Editor Area */}
                <div className="lg:col-span-2">
                    {editingIndex !== null ? (
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-xl sticky top-8">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <span className="p-1.5 bg-purple-600 rounded-md text-sm">✏️</span>
                                Editing: {trending[editingIndex].name || 'New Topic'}
                            </h3>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Topic Name</label>
                                        <input 
                                            type="text"
                                            value={trending[editingIndex].name}
                                            onChange={(e) => updateTopicField(editingIndex, 'name', e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500"
                                            placeholder="e.g. Virat Kohli"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">URL Slug</label>
                                        <input 
                                            type="text"
                                            value={trending[editingIndex].slug}
                                            onChange={(e) => updateTopicField(editingIndex, 'slug', e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-500 font-mono text-sm focus:outline-none"
                                            readOnly
                                        />
                                    </div>
                                </div>

                                <div className="border-t border-white/10 pt-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-base font-bold text-white">Platform Content</h4>
                                        <select 
                                            onChange={(e) => { addPlatformToTopic(editingIndex, e.target.value); e.target.value = ''; }}
                                            className="px-3 py-2 rounded-lg bg-purple-600 text-white font-bold text-sm outline-none cursor-pointer"
                                        >
                                            <option value="">+ Add Platform</option>
                                            {PLATFORMS.map(p => (
                                                <option key={p.id} value={p.id} disabled={!!trending[editingIndex].platforms[p.id]}>
                                                    {p.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-4">
                                        {Object.entries(trending[editingIndex].platforms).map(([platId, urls]) => (
                                            <div key={platId} className="bg-white/5 border border-white/10 rounded-lg p-4 relative group/plat">
                                                <div className="flex justify-between items-center mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                                        <span className="font-bold text-white uppercase tracking-widest text-xs">
                                                            {PLATFORMS.find(p => p.id === platId)?.name}
                                                        </span>
                                                    </div>
                                                    <button 
                                                        onClick={() => removePlatformFromTopic(editingIndex, platId)}
                                                        className="text-gray-500 hover:text-red-500 text-xs font-bold"
                                                    >
                                                        Remove Platform
                                                    </button>
                                                </div>

                                                <div className="space-y-2">
                                                    {urls.map((url, uIndex) => (
                                                        <div key={uIndex} className="flex gap-2">
                                                            <div className="flex-1 px-3 py-2 bg-black/30 border border-white/5 rounded-lg text-gray-400 text-sm truncate">
                                                                {url}
                                                            </div>
                                                            <button 
                                                                onClick={() => removeUrlFromPlatform(editingIndex, platId, uIndex)}
                                                                className="px-2 py-1.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 text-sm"
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <div className="flex gap-2 pt-1">
                                                        <input 
                                                            type="text"
                                                            placeholder="Paste video/reel URL..."
                                                            className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-purple-500"
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    addUrlToPlatform(editingIndex, platId, e.target.value);
                                                                    e.target.value = '';
                                                                }
                                                            }}
                                                        />
                                                        <button 
                                                            onClick={(e) => {
                                                                const input = e.currentTarget.previousSibling;
                                                                addUrlToPlatform(editingIndex, platId, input.value);
                                                                input.value = '';
                                                            }}
                                                            className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg text-sm"
                                                        >
                                                            Add
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {Object.keys(trending[editingIndex].platforms).length === 0 && (
                                            <div className="text-center py-8 border-2 border-dashed border-white/5 rounded-lg text-gray-600 italic text-sm">
                                                No platforms added to this topic yet.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-6 flex justify-end gap-3">
                                    <button 
                                        onClick={() => setEditingIndex(null)}
                                        className="px-6 py-2.5 rounded-lg bg-white/5 text-gray-400 font-bold text-sm hover:bg-white/10 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="px-8 py-2.5 rounded-lg bg-purple-600 text-white font-bold text-sm hover:shadow-md hover:shadow-purple-600/20 transition-all disabled:opacity-50"
                                    >
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-white/5 rounded-xl bg-white/[0.01]">
                            <div className="text-5xl mb-4">🚀</div>
                            <h3 className="text-xl font-bold text-white mb-2">Select a topic to edit</h3>
                            <p className="text-gray-500 max-w-sm text-sm">Choose a trending topic from the left sidebar to modify its platforms and video URLs.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}