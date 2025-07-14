'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    SiReact, SiVuedotjs, SiNextdotjs, SiNodedotjs, SiDjango, SiLaravel,
    SiTailwindcss, SiBootstrap, SiSupabase, SiSanity, SiRedux, SiFramer
} from 'react-icons/si';
import PublicNavBar from "@/components/ui/PublicNavbar";
import Footer from "@/components/ui/Footer";

const codeSnippets = {
    Javascript: `// Javascript
const arr = ["Muhamad", "Hidayat", "Setiawan"];

function greeting() {
  const name = arr.find((item) => item === "Awan");
  return \`Hello, \${name}!\`;
}

console.log(greeting()); // Hello, Setiawan!`,

    Typescript: `// TypeScript
const arr: string[] = ["Muhamad", "Hidayat", "Setiawan"];

function greeting(): string {
  const name: string | undefined = arr.find((item) => item === "Setiawan");
  return \`Hello, \${name}!\`;
}

console.log(greeting()); // Hello, Setiawan!`,

    Python: `# Python
arr = ["Muhamad", "Hidayat", "Setiawan"]

def greeting():
    name = next((item for item in arr if item == "Setiawan"), None)
    return f"Hello, {name}!"

print(greeting()) # Hello, Setiawan!`,

    PHP: `<?php
// PHP
$arr = ["Muhamad", "Hidayat", "Setiawan"];

function greeting($arr) {
    $name = null;
    foreach ($arr as $item) {
        if ($item === "Setiawan") {
            $name = $item;
            break;
        }
    }
    return "Hello, $name!";
}

echo greeting($arr); // Hello, Setiawan!`
};

const tabs = ["Javascript", "Typescript", "Python", "PHP"] as const;
type TabKey = typeof tabs[number];

const techStacks = [
    { icon: <SiReact />, link: "https://reactjs.org", name: "React" },
    { icon: <SiVuedotjs />, link: "https://vuejs.org", name: "Vue" },
    { icon: <SiNextdotjs />, link: "https://nextjs.org", name: "Next.js" },
    { icon: <SiNodedotjs />, link: "https://nodejs.org", name: "Node.js" },
    { icon: <SiDjango />, link: "https://www.djangoproject.com", name: "Django" },
    { icon: <SiLaravel />, link: "https://laravel.com", name: "Laravel" },
    { icon: <SiTailwindcss />, link: "https://tailwindcss.com", name: "Tailwind CSS" },
    { icon: <SiBootstrap />, link: "https://getbootstrap.com", name: "Bootstrap" },
    { icon: <SiSupabase />, link: "https://supabase.com", name: "Supabase" },
    { icon: <SiSanity />, link: "https://www.sanity.io", name: "Sanity" },
    { icon: <SiRedux />, link: "https://redux.js.org", name: "Redux" },
    { icon: <SiFramer />, link: "https://www.framer.com/motion/", name: "Framer Motion" },
];

export default function SkillsPage() {
    const [activeTab, setActiveTab] = useState<TabKey>("Javascript");

    return (
        <>
            <PublicNavBar />

            <div className="min-h-screen flex flex-col justify-between bg-black text-white font-mono">
                <div className="w-full flex flex-col items-center px-4 pt-24 pb-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-8"
                    >
                        <h1 className="text-xl font-bold mb-2">Skills</h1>
                        <p className="text-sm text-gray-400">
                            Just a few of my skills using some programming lang that I’ve learned and mastered.
                        </p>
                    </motion.div>

                    {/* Tabbed code section */}
                    <div className="bg-gray-900 rounded-xl w-full max-w-md mb-10 shadow-lg overflow-hidden">
                        <div className="flex border-b border-gray-700 overflow-x-auto">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${activeTab === tab
                                        ? 'text-white border-b-2 border-cyan-400'
                                        : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <div className="max-h-[300px] overflow-auto custom-scroll">
                            <AnimatePresence mode="wait">
                                <motion.pre
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.25 }}
                                    className="p-4 text-sm text-green-300 whitespace-pre-wrap"
                                >
                                    <code>{codeSnippets[activeTab]}</code>
                                </motion.pre>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Tech stacks */}
                    <div className="text-center">
                        <h2 className="text-lg font-semibold mb-4">Tech Stacks</h2>
                        <div className="flex flex-wrap gap-6 justify-center text-4xl text-cyan-300">
                            {techStacks.map((tech, idx) => (
                                <a
                                    key={idx}
                                    href={tech.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={tech.name}
                                    className="hover:scale-110 transition-transform"
                                >
                                    {tech.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer always at the bottom */}
                <Footer />
            </div>
        </>
    );
}
