import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeaturedPost from "@/components/FeaturedPost";
import BlogGrid from "@/components/BlogGrid";
import ApplicationForm from "@/components/ApplicationForm";
import ChatBot from "@/components/ChatBot";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export const revalidate = 0; // Disable cache for immediate updates

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
        <aside>
          <div className="sticky top-24 space-y-8">
            {/* Premium Service Widget */}
            <div className="p-0 rounded-2xl border border-yellow-500/30 bg-gradient-to-b from-slate-900 to-black shadow-xl overflow-hidden group relative">
              {/* User's Custom Image */}
              <div className="absolute inset-0 bg-[url('/custom-ai-service.png')] bg-cover bg-center opacity-60 transition-opacity group-hover:opacity-70"></div>

              <div className="relative z-10 p-8">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-2xl flex items-center justify-center text-black text-3xl font-bold mb-6 shadow-lg shadow-amber-500/20">
                  AI
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white">맞춤 AI 에이전트 제작</h3>
                <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                  당신의 비즈니스에 딱 맞는 AI 비서를 만들어 드립니다. 반복 업무 자동화부터 고객 응대까지.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm font-bold text-yellow-400">
                    <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                    <span>월 3팀 한정 제작</span>
                  </div>
                  <Link href="#contact" className="block w-full py-4 bg-gradient-to-r from-yellow-500 to-amber-600 text-black text-center rounded-xl font-bold hover:scale-[1.02] transition-transform shadow-lg shadow-amber-500/20">
                    무료 견적 받기 →
                  </Link>
                </div>
              </div>
            </div>

            {/* Popular Topics */}
            <div className="p-8 rounded-2xl border border-border bg-card shadow-sm">
              <h3 className="text-lg font-bold mb-4">Trending Topics</h3>
              <div className="flex flex-wrap gap-2">
                {["Generative AI", "LLM", "Automation", "ChatGPT", "Future Tech"].map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-medium hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      <ChatBot />

      {/* 4. Consultation Section (Bottom) */}
      <section id="contact" className="py-20 bg-secondary/20 relative border-t border-border/50">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              비즈니스 혁신
            </span>
            , AI로 시작하세요
          </h2>
          <p className="text-muted-foreground text-lg mb-10">
            비즈니스 업무 자동화, 나만의 AI 비서 제작에 대해 궁금하신가요?
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
