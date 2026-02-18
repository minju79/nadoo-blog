
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function WritePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'manual' | 'ai'>('manual');
    const [targetUrl, setTargetUrl] = useState("");

    const [formData, setFormData] = useState({
        accessCode: "",
        title: "",
        slug: "",
        thumbnail_url: "",
        excerpt: "",
        content: "",
        category: "General",
    });

    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .replace(/ /g, "-")
            .replace(/[^\w\uAC00-\uD7A3-]/g, ""); // Allow Korean characters
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setFormData({
            ...formData,
            title,
            slug: formData.slug || generateSlug(title) // Auto-generate slug if empty
        });
    };

    const handleAiGenerate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.accessCode !== "nadoo3379") {
            alert("❌ Incorrect Access Code! Please enter it first.");
            return;
        }

        if (!targetUrl) {
            alert("Please enter a URL.");
            return;
        }

        setAiLoading(true);

        try {
            const response = await fetch('/api/ai-post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: targetUrl,
                    accessCode: formData.accessCode
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to generate");
            }

            // Populate form with AI result
            setFormData({
                ...formData,
                title: data.title,
                slug: data.slug || generateSlug(data.title),
                content: data.content,
                thumbnail_url: data.thumbnail_url || "",
                excerpt: data.content.substring(0, 150) + "...",
                category: "AI News" // Default for imports
            });

            alert("✨ AI Draft Generated! Please review and publish.");
            setActiveTab('manual'); // Switch to editor view

        } catch (error: any) {
            console.error("AI Error:", error);
            alert(`AI Generation Failed: ${error.message}`);
        } finally {
            setAiLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.accessCode !== "nadoo3379") {
            alert("❌ Incorrect Access Code!");
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.from("posts").insert([
                {
                    title: formData.title,
                    slug: formData.slug || generateSlug(formData.title),
                    content: formData.content,
                    excerpt: formData.excerpt,
                    thumbnail_url: formData.thumbnail_url,
                    category: formData.category,
                    published: true,
                    created_at: new Date().toISOString(),
                },
            ]);

            if (error) throw error;

            alert("✅ Post Published Successfully!");
            router.push(`/blog/${formData.slug}`);

        } catch (error: any) {
            console.error("Error submitting:", error);
            alert(`Failed to publish: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData({ ...formData, content: e.target.value });
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    return (
        <main className="min-h-screen bg-background text-foreground font-sans pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 text-center"
                >
                    <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                        Blog Writer
                    </h1>
                    <p className="text-muted-foreground">
                        {activeTab === 'manual' ? 'Write your story manually.' : 'Import content via AI.'}
                    </p>
                </motion.div>

                <div className="bg-card rounded-3xl border border-border shadow-xl overflow-hidden">
                    {/* Tabs */}
                    <div className="flex border-b border-border">
                        <button
                            onClick={() => setActiveTab('manual')}
                            className={`flex-1 py-4 text-center font-bold transition-colors ${activeTab === 'manual' ? 'bg-secondary text-primary border-b-2 border-primary' : 'hover:bg-muted/50 text-muted-foreground'}`}
                        >
                            ✍️ Manual Write
                        </button>
                        <button
                            onClick={() => setActiveTab('ai')}
                            className={`flex-1 py-4 text-center font-bold transition-colors ${activeTab === 'ai' ? 'bg-secondary text-primary border-b-2 border-primary' : 'hover:bg-muted/50 text-muted-foreground'}`}
                        >
                            🤖 AI Import (from URL)
                        </button>
                    </div>

                    <div className="p-8">
                        {/* Global Access Code */}
                        <div className="mb-8">
                            <label className="block text-sm font-bold mb-2 text-red-500">Access Code (Required for both)</label>
                            <input
                                type="password"
                                className="w-full px-4 py-3 rounded-xl bg-secondary border border-transparent focus:border-red-500 outline-none transition-colors"
                                placeholder="Enter Admin Password (nadoo3379)"
                                value={formData.accessCode}
                                onChange={(e) => setFormData({ ...formData, accessCode: e.target.value })}
                            />
                        </div>

                        {activeTab === 'ai' ? (
                            <motion.div
                                key="ai-tab"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-6"
                            >
                                <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl text-center">
                                    <h3 className="text-xl font-bold text-blue-800 mb-2">Import & Rewrite with AI</h3>
                                    <p className="text-blue-600 mb-6">Paste any URL (News, Blog, Technical Article), and AI will rewrite it into a professional blog post.</p>

                                    <input
                                        type="url"
                                        required
                                        className="w-full px-4 py-4 rounded-xl border border-blue-200 focus:border-blue-500 outline-none text-lg mb-4 shadow-sm"
                                        placeholder="https://example.com/article-url"
                                        value={targetUrl}
                                        onChange={(e) => setTargetUrl(e.target.value)}
                                    />

                                    <button
                                        onClick={handleAiGenerate}
                                        disabled={aiLoading}
                                        className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100"
                                    >
                                        {aiLoading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Analyzing & Writing...
                                            </span>
                                        ) : "✨ Generate Draft"}
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.form
                                key="manual-tab"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onSubmit={handleSubmit}
                                className="space-y-6"
                            >
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">Title</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-secondary border border-transparent focus:border-primary outline-none transition-colors font-bold text-lg"
                                        placeholder="Blog Post Title"
                                        value={formData.title}
                                        onChange={handleTitleChange}
                                    />
                                </div>

                                {/* Content */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">Content (HTML Supported)</label>
                                    <textarea
                                        required
                                        rows={15}
                                        className="w-full px-4 py-3 rounded-xl bg-secondary border border-transparent focus:border-primary outline-none transition-colors resize-none font-mono text-sm leading-relaxed"
                                        placeholder="Write your content here..."
                                        value={formData.content}
                                        onChange={handleContentChange}
                                    />
                                </div>

                                {/* Meta Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Category</label>
                                        <select
                                            className="w-full px-4 py-3 rounded-xl bg-secondary border border-transparent focus:border-primary outline-none transition-colors"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            <option value="General">General</option>
                                            <option value="AI News">AI News</option>
                                            <option value="Tech Reviews">Tech Reviews</option>
                                            <option value="Tutorials">Tutorials</option>
                                            <option value="Thinking">Thinking</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Slug</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl bg-secondary border border-transparent focus:border-primary outline-none transition-colors text-sm"
                                            value={formData.slug}
                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Thumbnail URL</label>
                                    <input
                                        type="url"
                                        className="w-full px-4 py-3 rounded-xl bg-secondary border border-transparent focus:border-primary outline-none transition-colors"
                                        placeholder="https://example.com/image.jpg"
                                        value={formData.thumbnail_url}
                                        onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Excerpt</label>
                                    <textarea
                                        rows={2}
                                        className="w-full px-4 py-3 rounded-xl bg-secondary border border-transparent focus:border-primary outline-none transition-colors resize-none"
                                        value={formData.excerpt}
                                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 rounded-xl bg-black text-white font-bold text-lg hover:bg-gray-800 transition-colors shadow-lg disabled:opacity-50"
                                >
                                    {loading ? "Publishing..." : "🚀 Publish Post"}
                                </button>
                            </motion.form>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
