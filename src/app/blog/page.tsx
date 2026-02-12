import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogGrid from "@/components/BlogGrid";

export const revalidate = 60;

export default function BlogListingPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-32 pb-20 container mx-auto px-6">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">Latest Insights</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Explore the latest AI-generated real estate market analysis and trends.
                    </p>
                </div>

                <BlogGrid />
            </div>
            <Footer />
        </main>
    );
}
