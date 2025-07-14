"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import PublicNavBar from "@/components/ui/PublicNavbar";
import Footer from "@/components/ui/Footer";
import { motion, AnimatePresence, LazyMotion, domAnimation } from "framer-motion";

export default function HomePage() {
    const [introText, setIntroText] = useState<string>("");
    const [pages, setPages] = useState<{ label: string; slug: string }[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [loopIndex, setLoopIndex] = useState(0);

    const greetings = useMemo(
        () => ["Hello G", "Hello There", "Welcome", "Hi Stranger", "Hola Dev"],
        []
    );

    // Loop greeting every 2.5s
    useEffect(() => {
        const interval = setInterval(() => {
            setLoopIndex((prev) => (prev + 1) % greetings.length);
        }, 2500);
        return () => clearInterval(interval);
    }, [greetings.length]);

    // Fetch content (Supabase)
    useEffect(() => {
        const fetchContent = async () => {
            const { data, error } = await supabase
                .from("home_content")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(1);

            if (!error && data && data.length > 0) {
                setIntroText(data[0].intro_text || "");
                setPages(data[0].pages || []);
            }

            setLoading(false);
        };

        fetchContent();
    }, []);

    return (
        <main className="relative min-h-screen bg-black text-gray-300 px-4 py-10 flex flex-col items-center justify-between font-mono">
            <PublicNavBar />

            <div className="max-w-3xl mx-auto text-center mt-28 min-h-[140px]">
                <LazyMotion features={domAnimation}>
                    <AnimatePresence mode="wait">
                        <motion.h1
                            key={loopIndex}
                            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.5 }}
                        >
                            {greetings[loopIndex]}<span className="animate-pulse">|</span>
                        </motion.h1>
                    </AnimatePresence>

                    {loading ? (
                        <div className="flex items-center justify-center gap-2 text-gray-500 mt-8">
                            <motion.svg
                                className="h-5 w-5 text-cyan-400"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8H4z"
                                />
                            </motion.svg>
                            Loading content...
                        </div>
                    ) : (
                        <motion.p
                            className="text-sm sm:text-base text-gray-400 leading-relaxed whitespace-pre-wrap mt-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4 }}
                        >
                            {introText || "Welcome to my portfolio!"}
                        </motion.p>
                    )}
                </LazyMotion>
            </div>

            {!loading && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mt-10 text-sm md:text-base w-full max-w-4xl"
                >
                    <h2 className="text-cyan-400 uppercase tracking-widest mb-4">Pages.</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-cyan-300">
                        {pages.length === 0 ? (
                            <p className="text-gray-500 col-span-full">No pages defined yet.</p>
                        ) : (
                            pages.map((page, i) => (
                                <div key={i}>
                                    <span className="text-gray-500">{`${String(i + 1).padStart(2, "0")}. `}</span>
                                    <Link
                                        href={page.slug}
                                        className="underline hover:text-cyan-500 transition-all"
                                    >
                                        {page.label}
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            )}

            <Footer />
        </main>
    );
}
