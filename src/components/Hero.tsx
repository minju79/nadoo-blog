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
                        <span className="inline-block py-1.5 px-4 rounded-full bg-blue-500/10 text-blue-500 text-sm font-semibold mb-6 border border-blue-500/20">
                            NADOO_AI : Future Tech & AI
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 pb-2">
                            콘텐츠는 AI가. <br />
                            비즈니스는 사람이.
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                            "AI 시대 리더"를 위한 완벽한 지식 창고. <br />
                            최신 AI 트렌드부터 실무 활용법까지, 이제 숨만 쉬어도 홍보가 됩니다.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="#apply" className="w-full sm:w-auto">
                                <button className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1">
                                    맞춤 AI 제작 문의
                                </button>
                            </Link>
                            <Link href="/blog" className="w-full sm:w-auto">
                                <button className="w-full sm:w-auto px-8 py-4 bg-secondary text-secondary-foreground rounded-full font-bold text-lg hover:bg-secondary/80 transition-all border border-border hover:border-primary/20">
                                    View Demo Blog
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Background Gradient */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full -z-10" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-500/5 blur-[100px] rounded-full -z-10" />
        </section>
    );
}
