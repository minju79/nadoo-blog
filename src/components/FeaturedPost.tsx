"use client";

import Link from "next/link";
import { format } from "date-fns";
import { motion } from "framer-motion";

interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    thumbnail_url?: string;
    created_at: string;
    category?: string;
}

export default function FeaturedPost({ post }: { post: Post }) {
    if (!post) return null;

    return (
        <section className="relative w-full h-[60vh] min-h-[500px] flex items-end justify-start overflow-hidden group">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                {post.thumbnail_url ? (
                    <img
                        src={post.thumbnail_url}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-slate-900" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 pb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-3xl"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-full">
                            Featured
                        </span>
                        {post.category && (
                            <span className="px-3 py-1 bg-white/10 backdrop-blur text-white text-xs font-bold uppercase tracking-wider rounded-full border border-white/20">
                                {post.category}
                            </span>
                        )}
                        <span className="text-white/80 text-sm">
                            {format(new Date(post.created_at), "MMMM d, yyyy")}
                        </span>
                    </div>
                    <Link href={`/blog/${post.slug}`}>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight hover:text-blue-400 transition-colors cursor-pointer">
                            {post.title}
                        </h1>
                    </Link>
                    <p className="text-lg text-white/80 line-clamp-2 md:line-clamp-3 mb-8 max-w-2xl">
                        {post.excerpt}
                    </p>

                    <Link href={`/blog/${post.slug}`}>
                        <button className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-blue-600 hover:text-white transition-all">
                            Read Article
                        </button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
