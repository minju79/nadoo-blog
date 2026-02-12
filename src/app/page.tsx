import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeaturedPost from "@/components/FeaturedPost";
import BlogGrid from "@/components/BlogGrid";
import ApplicationForm from "@/components/ApplicationForm";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export const revalidate = 60; // Revalidate every minute

export default async function Home() {
  // Fetch the latest post for the Featured section
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1);

  const featuredPost = posts?.[0];

  return (
    <main className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />

      {/* 1. Featured Section: The most important "Authority" post */}
      {featuredPost ? (
        <FeaturedPost post={featuredPost} />
      ) : (
        <div className="pt-32 pb-20 text-center container mx-auto">
          <div className="p-12 bg-secondary/30 rounded-3xl border border-dashed border-border mx-auto max-w-2xl">
            <h2 className="text-2xl font-bold mb-2">No Posts Yet</h2>
            <p className="text-muted-foreground">Run your automation to see the first post here.</p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-6 py-16 grid lg:grid-cols-[1fr_350px] gap-12">
        {/* 2. Main Content: Latest News Stream (AI Content) */}
        <section>
          <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
            <h2 className="text-2xl font-bold">Latest Insights</h2>
            <Link href="/blog" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              View All →
            </Link>
          </div>
          <BlogGrid limit={6} />
        </section>

        {/* 3. Sidebar: Consultation & Branding (The "Money" part) */}
        <aside className="space-y-8">
          {/* Profile / Branding Widget */}
          <div className="p-8 rounded-2xl border border-border bg-card sticky top-24 shadow-sm">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg shadow-blue-600/20">
              N
            </div>
            <h3 className="text-xl font-bold mb-2">Nadoo AI Agent</h3>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              Data-driven real estate insights. Creating value through AI analysis and local expertise.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm font-medium text-green-600 dark:text-green-400">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>Accepting New Clients</span>
              </div>
              <Link href="#contact" className="block w-full py-3 bg-primary text-primary-foreground text-center rounded-xl font-bold hover:opacity-90 transition-opacity shadow-md">
                Request Consultation
              </Link>
            </div>
          </div>

          {/* Popular Topics */}
          <div className="p-8 rounded-2xl border border-border bg-card shadow-sm">
            <h3 className="text-lg font-bold mb-4">Trending Topics</h3>
            <div className="flex flex-wrap gap-2">
              {["Real Estate", "AI Analysis", "Market Trends", "Investment", "Gwangju"].map((tag) => (
                <span key={tag} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-medium hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* 4. Consultation Section (Bottom) */}
      <section id="contact" className="py-20 bg-secondary/20 relative border-t border-border/50">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <h2 className="text-3xl font-bold mb-4">Professional Consultation</h2>
          <p className="text-muted-foreground text-lg mb-10">
            Have questions about real estate investment or market trends?
          </p>
          <div className="bg-background rounded-3xl border border-border shadow-2xl p-6 md:p-10 text-left">
            <ApplicationForm />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
