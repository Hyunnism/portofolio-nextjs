// src/components/AboutSection.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

type AboutContent = {
    name: string;
    role: string;
    location: string;
    company: string;
    description: string;
    image_url: string;
};

export default function AboutSection() {
    const [about, setAbout] = useState<AboutContent | null>(null);

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

    if (!about) return null;

    return (
        <section className="mt-24 max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
            <div className="md:col-span-2 space-y-4">
                <h2 className="text-sm uppercase tracking-widest text-teal-400">About</h2>
                <h1 className="text-2xl font-bold text-white">{about.name}</h1>
                <p className="text-gray-300 whitespace-pre-line">{about.description}</p>

                <div className="pt-4 text-sm text-gray-400 space-y-1">
                    <p>
                        My role is{" "}
                        <span className="font-semibold text-white">{about.role}</span>
                    </p>
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

            <div className="flex items-center justify-center">
                <Image
                    src={about.image_url}
                    alt={about.name}
                    width={256}
                    height={256}
                    className="rounded-xl object-cover shadow-lg"
                />
            </div>
        </section>
    );
}
