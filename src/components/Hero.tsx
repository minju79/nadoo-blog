"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-6">
                            AI-Powered Real Estate Portfolio
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                            Automate Your Content. <br />
                            Dominate the Market.
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                            The "Survival Package" for modern agents. Fully automated blog,
                            landing page, and application system.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="#apply" className="w-full sm:w-auto">
                                <button className="w-full sm:w-auto px-8 py-4 bg-foreground text-background rounded-full font-semibold text-lg hover:opacity-90 transition-opacity">
                                    Get Survival Package
                                </button>
                            </Link>
                            <Link href="#blog" className="w-full sm:w-auto">
                                <button className="w-full sm:w-auto px-8 py-4 bg-secondary text-secondary-foreground rounded-full font-semibold text-lg hover:bg-secondary/80 transition-colors">
                                    View Demo Blog
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Background Gradient */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 blur-[120px] rounded-full -z-10" />
        </section>
    );
}
