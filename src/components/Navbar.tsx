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
                <Link href="/" className="text-2xl font-bold tracking-tighter hover:opacity-80 transition-opacity flex items-center gap-2">
                    <span className="text-foreground">NADOO</span>
                    <span className="text-amber-500">_AI</span>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-bold">
                    <Link href="#features" className="text-amber-500/80 hover:text-amber-400 transition-colors uppercase tracking-wide">
                        Features
                    </Link>
                    <Link href="#blog" className="text-amber-500/80 hover:text-amber-400 transition-colors uppercase tracking-wide">
                        Blog
                    </Link>
                    <Link href="/write" className="text-amber-500/80 hover:text-amber-400 transition-colors uppercase tracking-wide flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                        Write
                    </Link>
                    <Link href="https://nadooai-ay4nv8rj.manus.space/" target="_blank" className="text-amber-500/80 hover:text-amber-400 transition-colors uppercase tracking-wide flex items-center gap-1">
                        <span>🌐</span> Hub
                    </Link>
                    <Link href="https://ai-real-estate-2026-app.vercel.app/" target="_blank" className="text-amber-500/80 hover:text-amber-400 transition-colors uppercase tracking-wide flex items-center gap-1">
                        <span>🏠</span> 부동산
                    </Link>
                    <Link href="#apply" className="bg-gradient-to-r from-amber-500 to-yellow-600 text-black px-6 py-2 rounded-full hover:scale-105 transition-transform font-bold shadow-lg shadow-amber-500/20">
                        맞춤 AI 제작 문의
                    </Link>
                </div>
            </div>
        </motion.nav>
    );
}
