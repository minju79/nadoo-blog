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

      <section id="features" className="py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-16">Why Choose Survival Package?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-background border border-border shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 mx-auto text-2xl">⚡</div>
              <h3 className="text-xl font-bold mb-4">Fully Automated</h3>
              <p className="text-muted-foreground leading-relaxed">
                Connect RSS feeds and AI to generate high-quality blog posts automatically, 24/7.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-background border border-border shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-6 mx-auto text-2xl">✨</div>
              <h3 className="text-xl font-bold mb-4">Premium Design</h3>
              <p className="text-muted-foreground leading-relaxed">
                Impress clients with a professional, high-performance website that looks great on any device.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-background border border-border shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-6 mx-auto text-2xl">🎯</div>
              <h3 className="text-xl font-bold mb-4">Lead Capture</h3>
              <p className="text-muted-foreground leading-relaxed">
                Integrated application forms to capture high-value leads directly to your Supabase database.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="apply" className="py-20 bg-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-500/5 blur-[100px] -z-10" />
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Join the Revolution</h2>
            <p className="text-muted-foreground text-lg">
              Secure your spot in the Nadoo AI Survival Package.
              We are accepting a limited number of applicants to ensure quality.
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
