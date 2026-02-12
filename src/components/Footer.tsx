export default function Footer() {
    return (
        <footer className="py-12 border-t border-white/10 bg-background">
            <div className="container mx-auto px-6 text-center text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} Nadoo AI. All rights reserved.</p>
                <p className="mt-2 text-sm">
                    Built with Next.js, Supabase, and AI Automation.
                </p>
            </div>
        </footer>
    );
}
