"use client";
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";

type SidebarContextType = {
    isExpanded: boolean;
    isMobileOpen: boolean;
    activeItem: string | null;
    openSubmenu: string | null;
    toggleSidebar: () => void;
    toggleMobileSidebar: () => void;
    setActiveItem: (item: string | null) => void;
    toggleSubmenu: (item: string) => void;
};


const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
};

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [activeItem, setActiveItem] = useState<string | null>(null);
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

    // Atur ulang berdasarkan ukuran layar
    useEffect(() => {
        const handleResize = () => {
            const isMobile = window.innerWidth < 1024;
            if (!isMobile) setIsMobileOpen(false);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleSidebar = () => {
        setIsExpanded((prev) => {
            const next = !prev;
            // Simpan preferensi ke localStorage (opsional)
            if (typeof window !== "undefined") {
                localStorage.setItem("sidebarExpanded", next.toString());
            }
            return next;
        });
    };

    const toggleMobileSidebar = () => {
        setIsMobileOpen((prev) => !prev);
    };

    const toggleSubmenu = (item: string) => {
        setOpenSubmenu((prev) => (prev === item ? null : item));
    };

    // Restore sidebar expanded state from localStorage
    useEffect(() => {
        const stored = localStorage.getItem("sidebarExpanded");
        if (stored !== null) {
            setIsExpanded(stored === "true");
        }
    }, []);

    return (
        <SidebarContext.Provider
            value={{
                isExpanded,
                isMobileOpen,
                activeItem,
                openSubmenu,
                toggleSidebar,
                toggleMobileSidebar,
                setActiveItem,
                toggleSubmenu,
            }}
        >
            {children}
        </SidebarContext.Provider>
    );
};
