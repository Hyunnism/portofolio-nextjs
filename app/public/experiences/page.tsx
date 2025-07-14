'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import PublicNavBar from "@/components/ui/PublicNavbar";
import Footer from "@/components/ui/Footer";

type TimelineItem = {
    id: string;
    type: 'experience' | 'organization';
    role: string;
    company: string;
    location: string | null;
    start_date: string;
    end_date: string | null;
    created_at?: string | null;
};

export default function ExperiencesPage() {
    const [experiences, setExperiences] = useState<TimelineItem[]>([]);
    const [organizations, setOrganizations] = useState<TimelineItem[]>([]);
    const [showOthers, setShowOthers] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const exp = await supabase
                .from('timeline')
                .select('*')
                .eq('type', 'experience')
                .order('start_date', { ascending: false });
            if (exp.data) setExperiences(exp.data);

            const org = await supabase
                .from('timeline')
                .select('*')
                .eq('type', 'organization')
                .order('start_date', { ascending: false });
            if (org.data) setOrganizations(org.data);
        };

        fetchData();
    }, []);

    const TimelineSection = ({
        title,
        items,
    }: {
        title: string;
        items: TimelineItem[];
    }) => (
        <section className="relative max-w-3xl mx-auto my-10">
            <h2 className="text-center text-base font-semibold text-white mb-4">
                {title}
            </h2>

            {/* Garis tengah */}
            <div className="absolute left-1/2 top-0 w-[1px] h-full bg-gray-600 -translate-x-1/2 z-0" />

            {items.map((item, i) => {
                const isLeft = i % 2 !== 0;
                return (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                        className={`w-full md:w-1/2 px-2 py-3 relative z-10 ${isLeft ? 'md:pr-4 md:text-right md:ml-auto' : 'md:pl-4'
                            }`}
                    >
                        {/* Titik biru di garis tengah */}
                        <div className="absolute top-3 left-1/2 w-2 h-2 bg-blue-400 border-2 border-white rounded-full -translate-x-1/2 z-20" />

                        {/* Card kecil */}
                        <div className="bg-gray-800 rounded-md p-2 text-xs shadow-sm">
                            <h3 className="font-semibold text-sm leading-tight">{item.role}</h3>
                            <p className="text-[11px] text-gray-300">{item.company}</p>
                            {item.location && (
                                <p className="text-[11px] text-gray-500">{item.location}</p>
                            )}
                            <p className="text-[10px] text-gray-400 mt-1">
                                {item.start_date} – {item.end_date ?? 'Present'}
                            </p>
                        </div>
                    </motion.div>
                );
            })}
        </section>
    );

    return (
        <>
            <PublicNavBar />

            <main className="min-h-screen px-4 py-10 md:px-6 bg-black text-white text-sm">
                <h1 className="text-base md:text-lg font-bold text-center mb-4">
                    My Timeline
                </h1>

                <TimelineSection title="Experiences" items={experiences} />

                {showOthers && (
                    <TimelineSection title="Organizations" items={organizations} />
                )}

                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowOthers(!showOthers)}
                    className="mt-4 text-blue-400 hover:text-blue-200 transition text-xs flex flex-col items-center mx-auto"
                >
                    {showOthers ? (
                        <>
                            <FaChevronUp className="animate-bounce" />
                            <span>Show Less</span>
                        </>
                    ) : (
                        <>
                            <FaChevronDown className="animate-bounce" />
                            <span>See Organizations</span>
                        </>
                    )}
                </motion.button>

                <Footer />
            </main>
        </>
    );
}
