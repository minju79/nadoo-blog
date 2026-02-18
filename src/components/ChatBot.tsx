"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="mb-4 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
                    >
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
                            <h3 className="text-white font-bold">NADOO AI Assistant</h3>
                            <p className="text-blue-100 text-xs">Ask me anything about AI automation</p>
                        </div>
                        <div className="p-4 h-64 overflow-y-auto bg-gray-50 dark:bg-slate-900/50">
                            <div className="flex gap-3 mb-4">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-lg">🤖</div>
                                <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none shadow-sm text-sm border border-gray-100 dark:border-gray-700">
                                    안녕하세요! AI 뉴스 블로그 운영이나 자동화 구축에 대해 궁금한 점이 있으신가요?
                                </div>
                            </div>
                        </div>
                        <div className="p-3 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-slate-900">
                            <button
                                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                                onClick={() => window.location.href = '#contact'}
                            >
                                상담 신청하기
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-blue-600/30 transition-shadow hover:scale-105 active:scale-95"
            >
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                )}
            </button>
        </div>
    );
}
