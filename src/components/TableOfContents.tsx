
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Heading {
    id: string;
    text: string;
    level: number;
}

export default function TableOfContents({ content }: { content: string }) {
    const [headings, setHeadings] = useState<Heading[]>([]);
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        // Parse HTML content to find h2, h3
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, "text/html");
        const elements = Array.from(doc.querySelectorAll("h2, h3"));

        const extractedHeadings = elements.map((elem, index) => {
            const id = elem.id || `heading-${index}`;
            elem.id = id; // Ensure ID exists for linking
            return {
                id,
                text: elem.textContent || "",
                level: Number(elem.tagName.charAt(1))
            };
        });

        setHeadings(extractedHeadings);

        // Add IDs to the actual DOM elements after initial render
        // Note: This relies on the parent component treating content as HTML
        setTimeout(() => {
            const article = document.querySelector('article');
            if (article) {
                const domHeadings = article.querySelectorAll('h2, h3');
                domHeadings.forEach((elem, index) => {
                    if (!elem.id) elem.id = `heading-${index}`;
                });
            }
        }, 500);

        // Scroll spy
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: "0px 0px -80% 0px" }
        );

        setTimeout(() => {
            const domHeadings = document.querySelectorAll("h2, h3");
            domHeadings.forEach((h) => observer.observe(h));
        }, 1000);

        return () => observer.disconnect();
    }, [content]);

    if (headings.length === 0) return null;

    return (
        <motion.nav
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            className="hidden xl:block fixed right-8 top-32 w-64 p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10"
        >
            <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">On this page</h4>
            <ul className="space-y-3 text-sm">
                {headings.map((heading) => (
                    <li key={heading.id}
                        className={`transition-colors duration-200 ${heading.level === 3 ? "pl-4" : ""
                            }`}
                    >
                        <a
                            href={`#${heading.id}`}
                            className={`block hover:text-amber-500 ${activeId === heading.id
                                    ? "text-amber-500 font-bold"
                                    : "text-slate-400"
                                }`}
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById(heading.id)?.scrollIntoView({
                                    behavior: "smooth"
                                });
                                setActiveId(heading.id);
                            }}
                        >
                            {heading.text}
                        </a>
                    </li>
                ))}
            </ul>
        </motion.nav>
    );
}
