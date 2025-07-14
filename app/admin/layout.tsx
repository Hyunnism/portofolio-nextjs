// app/admin/layout.tsx
import "@/styles/globals.css";
import type { Metadata } from "next";
import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import AdminShell from "@/components/admin/AdminShell";

export const metadata: Metadata = {
    title: "Hyunnism Admin",
    description: "Admin dashboard",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <SidebarProvider>
                <AdminShell>{children}</AdminShell>
            </SidebarProvider>
        </ThemeProvider>
    );
}
