"use client";

import { useState, useEffect, use } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Props {
    params: Promise<{ id: string }>;
}

export default function EditPage({ params }: Props) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        accessCode: "",
        title: "",
        slug: "",
        thumbnail_url: "",
        excerpt: "",
        content: "",
        category: "General",
    });

    useEffect(() => {
        const fetchPost = async () => {
            const { data, error } = await supabase
                .from("posts")
                .select("*")
                .eq("id", id)
                .single();

            if (error) {
                alert("Error fetching post: " + error.message);
                router.push("/blog");
                return;
            }

            if (data) {
                setFormData({
                    accessCode: "", // User still needs to enter this
                    title: data.title,
                    slug: data.slug,
                    thumbnail_url: data.thumbnail_url || "",
                    excerpt: data.excerpt || "",
                    content: data.content || "",
                    category: data.category || "General",
                });
            }
            setFetching(false);
        };

        fetchPost();
    }, [id, router]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setFormData({
            ...formData,
            title,
            // Don't auto-update slug on edit to preserve URLs
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
            const { error } = await supabase
                .from("posts")
                .update({
                    title: formData.title,
                    slug: formData.slug,
                    content: formData.content,
                    excerpt: formData.excerpt,
                    thumbnail_url: formData.thumbnail_url,
                    category: formData.category,
                })
                .eq("id", id);

            if (error) throw error;

            alert("✅ Post Updated Successfully!");
            router.push(`/blog/${formData.slug}`);
            router.refresh();

        } catch (error: any) {
            console.error("Error submitting:", error);
            alert(`Failed to update: ${error.message}`);
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

    if (fetching) {
        return <div className="min-h-screen pt-32 text-center">Loading post data...</div>;
    }

    return (
        <main className="min-h-screen bg-background text-foreground font-sans pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 text-center"
                >
                    <h1 className="text-3xl font-bold mb-2">Edit Blog Post</h1>
                    <p className="text-muted-foreground">Update content for: {formData.title}</p>
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
                            placeholder="Enter Admin Password to Save Changes"
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
                        <label className="block text-sm font-medium mb-2 text-muted-foreground">Slug (URL) - Be careful changing this!</label>
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

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 py-4 rounded-xl bg-secondary text-foreground font-bold text-lg hover:bg-secondary/80 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] py-4 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50"
                        >
                            {loading ? "Updating..." : "💾 Save Changes"}
                        </button>
                    </div>

                </motion.form>
            </div>
        </main>
    );
}
