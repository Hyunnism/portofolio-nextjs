"use client";

import { ReactNode, useEffect, useState } from "react";
import AppHeader from "@/components/admin/AppHeader";
import AppSidebar from "@/components/admin/AppSidebar";
import { useSidebar } from "@/context/SidebarContext";

export default function AdminLayout({ children }: { children: ReactNode }) {
    const [isClient, setIsClient] = useState(false);
    const { isExpanded, isMobileOpen } = useSidebar();

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    return (
        <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
            {/* Sidebar */}
            <AppSidebar />

            {/* Konten utama */}
            <div
                className={`relative flex flex-col min-h-screen transition-all duration-300 ease-in-out
                    ${isMobileOpen ? "lg:pl-[290px]" : isExpanded ? "lg:pl-[290px]" : "lg:pl-[90px]"}
                `}
            >
                {/* Header */}
                <AppHeader />

                {/* Main content */}
                <main className="flex-1 overflow-y-auto px-4 py-6 lg:px-8 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
                    {children}
                </main>
            </div>
        </div>
    );
}
