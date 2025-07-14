"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSidebar } from "@/context/SidebarContext";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const AppHeader: React.FC = () => {
    const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
    const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleToggleSidebar = () => {
        if (window.innerWidth >= 1024) {
            toggleSidebar();
        } else {
            toggleMobileSidebar();
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);
    return (
        <header className="sticky top-0 z-99999 w-full border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 lg:border-b">
            <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">

                {/* Kiri: Sidebar Toggle + Logo + Mobile Menu */}
                <div className="flex w-full items-center justify-between gap-2 border-b px-3 py-3 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
                    {/* Toggle Sidebar */}
                    <button
                        onClick={handleToggleSidebar}
                        aria-label="Toggle Sidebar"
                        className="z-99999 flex h-10 w-10 items-center justify-center rounded-lg border-gray-200 text-gray-500 dark:border-gray-800 dark:text-gray-400 lg:h-11 lg:w-11 lg:border"
                    >
                        {isMobileOpen ? (
                            // Close icon
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
                                <path
                                    fill="currentColor"
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M6.22 6.22a.75.75 0 011.06 0L12 10.94l4.72-4.72a.75.75 0 111.06 1.06L13.06 12l4.72 4.72a.75.75 0 11-1.06 1.06L12 13.06l-4.72 4.72a.75.75 0 11-1.06-1.06L10.94 12 6.22 7.28a.75.75 0 010-1.06z"
                                />
                            </svg>
                        ) : (
                            // Hamburger icon
                            <svg viewBox="0 0 16 12" width="16" height="12" fill="none">
                                <path
                                    fill="currentColor"
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M1.33.25h13.33a.75.75 0 010 1.5H1.33a.75.75 0 010-1.5zm0 10h13.33a.75.75 0 010 1.5H1.33a.75.75 0 010-1.5zM1.33 5.25a.75.75 0 000 1.5H8a.75.75 0 000-1.5H1.33z"
                                />
                            </svg>
                        )}
                    </button>

                    {/* Logo untuk mobile */}
                    <Link href="/" className="lg:hidden">
                        <Image
                            src="/images/logo/logo.svg"
                            alt="Logo"
                            width={154}
                            height={32}
                            className="dark:hidden"
                        />
                        <Image
                            src="/images/logo/logo-dark.svg"
                            alt="Logo Dark"
                            width={154}
                            height={32}
                            className="hidden dark:block"
                        />
                    </Link>

                    {/* Toggle Menu (mobile) */}
                    <button
                        onClick={() => setApplicationMenuOpen(!isApplicationMenuOpen)}
                        className="z-99999 flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
                    >
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
                            <path
                                fill="currentColor"
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M6 10.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm12 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm-6 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"
                            />
                        </svg>
                    </button>

                    {/* Search Bar (desktop only) */}
                    <div className="hidden lg:block">
                        <form>
                            <div className="relative">
                                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                                    <svg width="20" height="20" fill="none" className="fill-gray-500 dark:fill-gray-400">
                                        <path
                                            fill="currentColor"
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M9.375 3.042a6.333 6.333 0 100 12.666 6.333 6.333 0 000-12.666zM1.542 9.375a7.833 7.833 0 1114.722 4.042l2.82 2.82a.75.75 0 01-1.06 1.061l-2.82-2.82A7.833 7.833 0 011.542 9.375z"
                                        />
                                    </svg>
                                </span>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Search or type command..."
                                    className="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
                                />
                                <button className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
                                    ⌘ K
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Kanan: Menu Utama */}
                <div
                    className={`${isApplicationMenuOpen ? "flex" : "hidden"
                        } w-full items-center justify-between gap-4 px-5 py-4 shadow-theme-md lg:flex lg:justify-end lg:px-0 lg:shadow-none`}
                >
                    <div className="flex items-center gap-2 2xsm:gap-3">
                        <ThemeToggleButton />
                        <button
                            onClick={handleLogout}
                            className="px-3 py-2 text-sm rounded border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AppHeader;
