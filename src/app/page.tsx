import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import ApplicationForm from "@/components/ApplicationForm";
import BlogGrid from "@/components/BlogGrid";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-background selection:bg-blue-500/20">
      <Navbar />
      <Hero />

      {/* Recent Posts Section (New) */}
      <section className="py-20 bg-secondary/30 border-y border-border/50">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Latest Insights</h2>
              <p className="text-muted-foreground">Automated updates from the AI engine.</p>
            </div>
            <Link href="/blog" className="text-blue-500 hover:text-blue-600 font-medium flex items-center gap-2">
              View All Posts <span>→</span>
            </Link>
          </div>
          <BlogGrid limit={3} />
        </div>
      </section>

      <section id="services" className="py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-16">모든 AI 부동산 서비스</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-background border border-border shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 mx-auto text-2xl">📊</div>
              <h3 className="text-xl font-bold mb-4">AI 부동산 분석</h3>
              <p className="text-muted-foreground leading-relaxed">
                빅데이터와 AI를 활용하여 광주/광산구 지역의 정확한 시세와 전망을 분석해드립니다.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-background border border-border shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-6 mx-auto text-2xl">🏠</div>
              <h3 className="text-xl font-bold mb-4">맞춤 매물 추천</h3>
              <p className="text-muted-foreground leading-relaxed">
                고객님의 라이프스타일과 예산에 딱 맞는 최적의 매물을 AI가 찾아드립니다.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-background border border-border shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-6 mx-auto text-2xl">💬</div>
              <h3 className="text-xl font-bold mb-4">전문가 상담</h3>
              <p className="text-muted-foreground leading-relaxed">
                복잡한 부동산 세금, 법률 문제까지. 전문 공인중개사가 친절하게 상담해드립니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 bg-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-500/5 blur-[100px] -z-10" />
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">무료 상담 신청</h2>
            <p className="text-muted-foreground text-lg">
              궁금한 점이 있으신가요? 연락처를 남겨주시면 빠르게 안내해드리겠습니다.
            </p>
          </div>
          <div className="bg-background rounded-3xl border border-border shadow-xl p-1 md:p-8">
            <ApplicationForm />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
