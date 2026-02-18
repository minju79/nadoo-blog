import Link from "next/link";
import { format } from "date-fns";


interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    thumbnail_url?: string;
    created_at: string;
    category?: string;
}

export default function PostCard({ post }: { post: Post }) {
    return (
        <Link href={`/blog/${post.slug}`} className="group relative block h-full">
            <div className="h-full border border-white/10 bg-secondary/20 rounded-2xl overflow-hidden hover:border-white/20 transition-colors">
                <div className="aspect-video bg-muted relative overflow-hidden">
                    {post.category && (
                        <div className="absolute top-3 left-3 z-10 px-3 py-1 bg-black/60 backdrop-blur-md text-white/90 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-white/10">
                            {post.category}
                        </div>
                    )}
                    {post.thumbnail_url ? (
                        <img
                            src={post.thumbnail_url}
                            alt={post.title}
                            className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-secondary text-muted-foreground">
                            No Image
                        </div>
                    )}
                </div>
                <div className="p-6">
                    <div className="text-sm text-muted-foreground mb-3 flex items-center justify-between">
                        <span>{format(new Date(post.created_at), "MMMM d, yyyy")}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                    </h3>
                    {post.excerpt && (
                        <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                            {post.excerpt}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
}
