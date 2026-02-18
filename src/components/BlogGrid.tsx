import { supabase } from "@/lib/supabase";
import BlogList from "./BlogList";

export default async function BlogGrid({ limit }: { limit?: number }) {
    let query = supabase
        .from("posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

    if (limit) {
        query = query.limit(limit);
    }

    const { data: posts } = await query;

    if (!posts || posts.length === 0) {
        return (
            <div className="text-center py-20 text-muted-foreground">
                <p>No posts found yet. Connect your automation!</p>
            </div>
        );
    }

    return <BlogList posts={posts} />;
}
