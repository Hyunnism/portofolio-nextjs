// src/components/admin/AdminShell.tsx
"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppSidebar from "@/components/admin/AppSidebar";
import AppHeader from "@/components/admin/AppHeader";

export default function AdminShell({ children }: { children: React.ReactNode }) {
    const { isExpanded, isMobileOpen } = useSidebar();

    return (
        <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
            <AppSidebar />
            <div
                className={`relative flex flex-col min-h-screen transition-all duration-300 ease-in-out
                    ${isMobileOpen ? "lg:pl-[290px]" : isExpanded ? "lg:pl-[290px]" : "lg:pl-[90px]"}
                `}
            >
                <AppHeader />
                <main className="flex-1 overflow-y-auto px-4 py-6 lg:px-8 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
                    {children}
                </main>
            </div>
        </div>
    );
}
