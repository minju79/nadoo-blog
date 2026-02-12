import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Metadata } from "next";

interface Props {
    params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const { data: post } = await supabase
        .from("posts")
        .select("title, excerpt")
        .eq("slug", slug)
        .single();

    if (!post) {
        return {
            title: "Post Not Found",
        };
    }

    return {
        title: `${post.title} | NADOO_AI Blog`,
        description: post.excerpt,
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const { data: post } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .single();

    if (!post) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-background pb-20">
            <Navbar />

            <article className="pt-32 pb-20 container mx-auto px-6 max-w-[800px]">
                <Link href="/blog" className="text-muted-foreground hover:text-foreground mb-8 inline-block">
                    ← Back to Blog
                </Link>

                <header className="mb-12 text-center">
                    <span className="text-muted-foreground text-sm mb-4 block">
                        {format(new Date(post.created_at), "MMMM d, yyyy")}
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                        {post.title}
                    </h1>
                    {post.thumbnail_url && (
                        <div className="rounded-2xl overflow-hidden aspect-video relative shadow-2xl border border-white/10">
                            <img src={post.thumbnail_url} alt={post.title} className="w-full h-full object-cover" />
                        </div>
                    )}
                </header>

                <div className="prose prose-invert prose-lg max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: post.content || "" }} />
                </div>
            </article>

            <Footer />
        </main>
    );
}
