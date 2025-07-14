"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import { HorizontaLDots } from "@/components/icons/index";
import { motion, AnimatePresence } from "framer-motion";

type NavItem = {
    name: string;
    path?: string;
    subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
    {
        name: "Dashboard",
        path: "/admin/home",
    },
    {
        name: "Pages",
        subItems: [
            { name: "Home", path: "/admin/home" },
            { name: "About", path: "/admin/about" },
            { name: "Timeline", path: "/admin/timeline" },
            { name: "Projects", path: "/admin/projects" },
            { name: "Contact", path: "/admin/contact" },
        ],
    },
    {
        name: "Team",
        path: "/admin/team",
    },
];

const AppSidebar: React.FC = () => {
    const { isExpanded, isMobileOpen } = useSidebar();
    const pathname = usePathname();
    const isCollapsed = !isExpanded && !isMobileOpen;

    const [openSubmenu, setOpenSubmenu] = useState<{ type: "main"; index: number } | null>(null);
    const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const isActive = useCallback((path: string) => path === pathname, [pathname]);

    const handleSubmenuToggle = (index: number, menuType: "main") => {
        setOpenSubmenu((prev) =>
            prev?.type === menuType && prev.index === index ? null : { type: menuType, index }
        );
    };

    useEffect(() => {
        navItems.forEach((nav, index) => {
            if (nav.subItems?.some((sub) => isActive(sub.path))) {
                setOpenSubmenu({ type: "main", index });
            }
        });
    }, [pathname, isActive]);

    const renderMenuItems = (items: NavItem[], menuType: "main") => (
        <ul className="flex flex-col gap-1">
            {items.map((nav, index) => (
                <li key={nav.name}>
                    {nav.subItems ? (
                        <div className="flex flex-col">
                            <button
                                onClick={() => handleSubmenuToggle(index, menuType)}
                                className={`text-sm font-medium py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${isCollapsed ? "text-center px-2" : "text-left px-4"}`}
                                title={nav.name}
                            >
                                {!isCollapsed && nav.name}
                            </button>

                            <AnimatePresence initial={false}>
                                {!isCollapsed && openSubmenu?.type === menuType && openSubmenu.index === index && (
                                    <motion.div
                                        initial="collapsed"
                                        animate="open"
                                        exit="collapsed"
                                        variants={{
                                            open: { height: "auto", opacity: 1 },
                                            collapsed: { height: 0, opacity: 0 },
                                        }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <ul className="ml-4 mt-1 flex flex-col gap-1">
                                            {nav.subItems.map((subItem) => (
                                                <li key={subItem.name}>
                                                    <Link
                                                        href={subItem.path}
                                                        className={`block text-sm py-1.5 px-4 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive(subItem.path)
                                                            ? "font-semibold text-blue-600 dark:text-blue-400"
                                                            : "text-gray-700 dark:text-gray-300"
                                                            }`}
                                                    >
                                                        {subItem.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        nav.path && (
                            <Link
                                href={nav.path}
                                className={`block text-sm font-medium py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${isCollapsed ? "text-center px-2" : "px-4"
                                    } ${isActive(nav.path)
                                        ? "text-blue-600 dark:text-blue-400"
                                        : "text-gray-700 dark:text-gray-200"
                                    }`}
                                title={nav.name}
                            >
                                {!isCollapsed && nav.name}
                            </Link>
                        )
                    )}
                </li>
            ))}
        </ul>
    );

    return (
        <aside
            className={`
        fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 
        bg-white dark:bg-gray-900 
        text-gray-800 dark:text-gray-100 
        border-r border-gray-200 dark:border-gray-800 
        h-screen transition-all duration-300 ease-in-out z-50
        ${isExpanded || isMobileOpen ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0
    `}
        >

            <div className={`py-8 flex ${isCollapsed ? "lg:justify-center" : "justify-start"}`}>
                <Link href="/">
                    {isCollapsed ? (
                        <Image src="/images/logo/logo-icon.svg" alt="Logo" width={32} height={32} />
                    ) : (
                        <>
                            <Image
                                className="dark:hidden"
                                src="/images/logo/logo.svg"
                                alt="Logo"
                                width={150}
                                height={40}
                            />
                            <Image
                                className="hidden dark:block"
                                src="/images/logo/logo-dark.svg"
                                alt="Logo"
                                width={150}
                                height={40}
                            />
                        </>
                    )}
                </Link>
            </div>

            <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
                <nav className="mb-6">
                    <div className="flex flex-col gap-4">
                        <div>
                            <h2
                                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${isCollapsed ? "lg:justify-center" : "justify-start"
                                    }`}
                            >
                                {isCollapsed ? <HorizontaLDots /> : "Menu"}
                            </h2>
                            {renderMenuItems(navItems, "main")}
                        </div>
                    </div>
                </nav>
            </div>
        </aside>
    );
};

export default AppSidebar;
