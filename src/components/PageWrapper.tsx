// src/components/PageWrapper.tsx
'use client';

import { usePathname } from "next/navigation";
import { AnimatePresence, LazyMotion, domAnimation, motion } from "framer-motion";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <LazyMotion features={domAnimation}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={pathname}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </LazyMotion>
    );
}
