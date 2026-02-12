"use client";

import Link from "next/link";

import { motion } from "framer-motion";

export default function Navbar() {
    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/10"
        >
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold tracking-tighter hover:opacity-80 transition-opacity">
                    NADOO_AI
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                    <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                        Features
                    </Link>
                    <Link href="#blog" className="text-muted-foreground hover:text-foreground transition-colors">
                        Blog
                    </Link>
                    <Link href="#apply">
                        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-full hover:opacity-90 transition-opacity font-bold">
                            맞춤 AI 제작 문의
                        </button>
                    </Link>
                </div>
            </div>
        </motion.nav>
    );
}
