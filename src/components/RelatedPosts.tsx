
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { format } from "date-fns";

interface RelatedPostsProps {
    currentSlug: string;
    category: string;
}

export default async function RelatedPosts({ currentSlug, category }: RelatedPostsProps) {
    // 🔍 Fetch 3 related posts from the same category, excluding the current one
    const { data: relatedPosts } = await supabase
        .from("posts")
        .select("title, slug, thumbnail_url, created_at, excerpt")
        .eq("category", category)
        .neq("slug", currentSlug)
        .limit(3);

    if (!relatedPosts || relatedPosts.length === 0) return null;

    return (
        <section className="mt-20 border-t border-white/10 pt-12">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                <span>🧐</span>
                <span>이 글을 본 분들이 관심있어 한 글</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((post) => (
                    <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="group block bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-amber-500/50 transition-all duration-300"
                    >
                        {post.thumbnail_url && (
                            <div className="aspect-video overflow-hidden">
                                <img
                                    src={post.thumbnail_url}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        )}
                        <div className="p-5">
                            <span className="text-xs text-amber-500 font-medium mb-2 block">
                                {format(new Date(post.created_at), "MMM d, yyyy")}
                            </span>
                            <h4 className="font-bold text-lg leading-snug group-hover:text-amber-500 transition-colors line-clamp-2">
                                {post.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                {post.excerpt || "내용 미리보기..."}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
