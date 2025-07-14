"use client";

import { useEffect, useState } from "react";

export default function Footer() {
    const [time, setTime] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const formatter = new Intl.DateTimeFormat("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                timeZone: "Asia/Jakarta",
                hour12: false,
            });
            setTime(formatter.format(now));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <footer className="text-xs text-gray-500 text-left w-full px-2 sm:px-8 pb-2 mt-10">
            <div className="flex justify-between">
                <div>
                    Bekasi, Jawa Barat – Indonesia
                    <br />
                    UTC+7 – {time}
                </div>
                <div className="text-right">
                    Hyunnism Version <span className="text-white">1.0</span>
                </div>
            </div>
        </footer>
    );
}
