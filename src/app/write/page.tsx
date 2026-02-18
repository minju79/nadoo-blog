"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function WritePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 🔒 Simple Security Check
        if (formData.accessCode !== "nadoo1234") {
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

    // Auto-resize textarea
    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData({ ...formData, content: e.target.value });
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    return (
        <main className="min-h-screen bg-background text-foreground font-sans pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 text-center"
                >
                    <h1 className="text-3xl font-bold mb-2">Manual Blog Writer</h1>
                    <p className="text-muted-foreground">Directly publish to Nadoo Blog</p>
                </motion.div>

                <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    onSubmit={handleSubmit}
                    className="space-y-6 bg-card p-8 rounded-3xl border border-border shadow-sm"
                >
                    {/* Access Code */}
                    <div>
                        <label className="block text-sm font-bold mb-2 text-red-500">Access Code (Required)</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-xl bg-secondary border border-transparent focus:border-red-500 outline-none transition-colors"
                            placeholder="Enter Admin Password"
                            value={formData.accessCode}
                            onChange={(e) => setFormData({ ...formData, accessCode: e.target.value })}
                        />
                    </div>

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

                    {/* Slug */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-muted-foreground">Slug (URL)</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 rounded-xl bg-secondary/50 border border-transparent focus:border-primary outline-none transition-colors text-sm font-mono"
                            placeholder="blog-post-url-slug"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        />
                    </div>

                    {/* Thumbnail URL */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Thumbnail Image URL</label>
                        <input
                            type="url"
                            className="w-full px-4 py-3 rounded-xl bg-secondary border border-transparent focus:border-primary outline-none transition-colors"
                            placeholder="https://example.com/image.jpg"
                            value={formData.thumbnail_url}
                            onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                        />
                        {formData.thumbnail_url && (
                            <img src={formData.thumbnail_url} alt="Preview" className="mt-2 h-32 w-auto rounded-lg object-cover border border-border" />
                        )}
                    </div>

                    {/* Excerpt */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Excerpt (Short Summary)</label>
                        <textarea
                            rows={2}
                            className="w-full px-4 py-3 rounded-xl bg-secondary border border-transparent focus:border-primary outline-none transition-colors resize-none"
                            placeholder="Briefly describe the post..."
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Content (HTML Supported)</label>
                        <textarea
                            required
                            rows={10}
                            className="w-full px-4 py-3 rounded-xl bg-secondary border border-transparent focus:border-primary outline-none transition-colors resize-none font-mono text-sm leading-relaxed"
                            placeholder="Write your content here... HTML tags are supported."
                            value={formData.content}
                            onChange={handleContentChange}
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                            Tip: You can use HTML tags like &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;ul&gt; for formatting.
                        </p>
                    </div>

                    {/* Category Selection */}
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

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50"
                    >
                        {loading ? "Publishing..." : "🚀 Publish Post"}
                    </button>

                </motion.form>
            </div>
        </main>
    );
}
