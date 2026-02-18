"use client";

import { useState } from "react";
import PostCard from "./PostCard";

interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    thumbnail_url?: string;
    created_at: string;
    category?: string;
}

export default function BlogList({ posts }: { posts: Post[] }) {
    const [selectedCategory, setSelectedCategory] = useState("All");

    // Extract unique categories (plus 'All')
    // Handle null/undefined categories by defaulting to 'General'
    const categories = ["All", ...Array.from(new Set(posts.map(p => p.category || "General")))];

    const filteredPosts = selectedCategory === "All"
        ? posts
        : posts.filter(post => (post.category || "General") === selectedCategory);

    return (
        <div className="space-y-10">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${selectedCategory === cat
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-2 ring-blue-500 ring-offset-2 ring-offset-background"
                                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Posts Grid */}
            {filteredPosts.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPosts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 text-muted-foreground bg-muted/30 rounded-3xl border border-dashed border-border mx-auto max-w-lg">
                    <p className="text-lg mb-2">🎈 No posts found</p>
                    <p className="text-sm">Try selecting a different category.</p>
                </div>
            )}
        </div>
    );
}
