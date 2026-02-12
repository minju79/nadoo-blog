import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import ApplicationForm from "@/components/ApplicationForm";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <section id="features" className="py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-10">Why Choose Survival Package?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-secondary/50 border border-white/5">
              <h3 className="text-xl font-bold mb-4">Fully Automated</h3>
              <p className="text-muted-foreground">
                Connect RSS feeds and AI to generate high-quality blog posts automatically.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-secondary/50 border border-white/5">
              <h3 className="text-xl font-bold mb-4">Premium Design</h3>
              <p className="text-muted-foreground">
                Impress clients with a professional, high-performance website.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-secondary/50 border border-white/5">
              <h3 className="text-xl font-bold mb-4">Lead Capture</h3>
              <p className="text-muted-foreground">
                Integrated application forms to capture high-value leads directly to Supabase.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="apply" className="py-20 bg-secondary/20">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Join the Revolution</h2>
            <p className="text-muted-foreground">
              Secure your spot in the Nadoo AI Survival Package.
              We are accepting a limited number of applicants to ensure quality.
            </p>
          </div>
          <ApplicationForm />
        </div>
      </section>

      <Footer />
    </main>
  );
}
