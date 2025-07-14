"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    HomeIcon,
    UserIcon,
    BookIcon,
    RocketIcon,
    LayersIcon,
    MessageCircleIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const navItems = [
    { href: "/", icon: <HomeIcon size={20} />, label: "Home" },
    { href: "/about", icon: <UserIcon size={20} />, label: "About" },
    { href: "/skills", icon: <LayersIcon size={20} />, label: "Skills" },
    { href: "/projects", icon: <RocketIcon size={20} />, label: "Projects" },
    { href: "/experiences", icon: <BookIcon size={20} />, label: "Experiences" },
    { href: "/contact", icon: <MessageCircleIcon size={20} />, label: "Contact" },
];

export default function PublicNavBar() {
    const pathname = usePathname();
    const containerRef = useRef<HTMLDivElement>(null);
    const [bubbleStyle, setBubbleStyle] = useState({ left: 0, top: 0, width: 0, height: 0 });

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const activeLink = container.querySelector(`[data-active="true"]`) as HTMLElement;
        if (activeLink) {
            const rect = activeLink.getBoundingClientRect();
            const parentRect = container.getBoundingClientRect();
            setBubbleStyle({
                left: rect.left - parentRect.left,
                top: rect.top - parentRect.top,
                width: rect.width,
                height: rect.height,
            });
        }
    }, [pathname]);

    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
            <div
                ref={containerRef}
                className="relative flex items-center gap-4 bg-[#0e1111] border border-cyan-900 text-cyan-200 px-5 py-2 rounded-full shadow-lg"
            >
                {/* floating bubble */}
                <motion.div
                    className="absolute rounded-full bg-cyan-800 opacity-30 z-0"
                    animate={bubbleStyle}
                    transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
                />

                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            data-active={isActive || undefined}
                            className="relative z-10"
                        >
                            <div className="p-2 rounded-full hover:bg-cyan-800 transition-colors duration-200">
                                {item.icon}
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
