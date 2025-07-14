// src/app/(public)/about/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import PublicNavBar from "@/components/ui/PublicNavbar";
import Footer from "@/components/ui/Footer";
import { Typewriter } from "react-simple-typewriter";

type AboutContent = {
    name: string;
    role: string;
    location: string;
    company: string;
    description: string;
    image_url: string;
};

export default function AboutPage() {
    const [about, setAbout] = useState<AboutContent | null>(null);
    const [contributions, setContributions] = useState<number | null>(null);

    const githubUsername = "Hyunnism";

    useEffect(() => {
        const fetchAbout = async () => {
            const { data, error } = await supabase
                .from("about_content")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(1)
                .single();

            if (error) {
                console.error("Error fetching about content:", error.message);
            } else {
                setAbout(data);
            }
        };

        fetchAbout();
    }, []);

    useEffect(() => {
        const fetchContributions = async () => {
            try {
                const res = await fetch(`https://github-contributions-api.deno.dev/${githubUsername}.json`);
                const data = await res.json();

                const flatData = data?.contributions?.flat() ?? [];
                const total = flatData.reduce((sum: number, day: any) => sum + (day.contributionCount || 0), 0);
                setContributions(total);
            } catch (error) {
                console.error("Failed to fetch GitHub contributions:", error);
            }
        };

        fetchContributions();
    }, []);

    if (!about) {
        return (
            <main className="min-h-screen bg-black text-white flex items-center justify-center">
                <p className="text-gray-500">Loading about content...</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-black text-gray-200 px-4 sm:px-6 lg:px-8 py-10 font-mono">
            <PublicNavBar />

            <section className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 items-start">
                {/* Left: Text */}
                <div className="md:col-span-2 space-y-4">
                    <h2 className="text-xs uppercase tracking-widest text-teal-400">About</h2>
                    <h1 className="text-xl font-semibold text-white">
                        <Typewriter
                            words={[about.name]}
                            loop={0}
                            cursor
                            cursorStyle="_"
                            typeSpeed={80}
                            deleteSpeed={40}
                            delaySpeed={1500}
                        />
                    </h1>

                    <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap max-h-[220px] overflow-auto pr-1">
                        {about.description}
                    </p>

                    <div className="pt-2 text-xs text-teal-400 space-y-2">
                        <p>
                            My role is <span className="font-semibold text-white">{about.role}</span>
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-start sm:gap-10">
                            <p>
                                Currently working on{" "}
                                <span className="font-semibold text-white">{about.company}</span>
                            </p>
                            <p>
                                Working at{" "}
                                <span className="font-semibold text-white">{about.location}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right: Image */}
                <div className="flex justify-center">
                    <Image
                        src={about.image_url}
                        alt={about.name}
                        width={180}
                        height={180}
                        className="rounded-xl object-cover shadow-md"
                    />
                </div>
            </section>

            {/* Contributions */}
            <section className="max-w-4xl mx-auto mt-12">
                <h3 className="text-xs font-medium text-teal-400 mb-2">My contributions</h3>
                <div className="overflow-x-auto rounded-lg border border-gray-800 bg-gray-950 p-3">
                    <iframe
                        title="GitHub Contributions"
                        src={`https://ghchart.rshah.org/409EFF/${githubUsername}`}
                        className="min-w-[600px] h-[140px] invert-[0.85] contrast-[1.2]"
                        loading="lazy"
                    />
                    <p className="mt-2 text-xs text-gray-500 text-center">
                        {contributions !== null
                            ? `${contributions} contributions in the last year`
                            : "Fetching contributions..."}
                    </p>
                </div>
            </section>

            <Footer />
        </main>
    );
}
