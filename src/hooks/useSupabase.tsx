import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type HomeContent = {
    id: string;
    intro_text: string;
    pages: { label: string; slug: string }[];
    created_at: string;
    updated_at?: string;
};

export function useHomeContent() {
    const [data, setData] = useState<HomeContent | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            const { data, error } = await supabase
                .from("home_content")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(1);

            if (error) {
                console.error("Supabase error:", error.message);
                setData(null);
            } else if (data && data.length > 0) {
                setData(data[0] as HomeContent);
            } else {
                setData(null);
            }

            setLoading(false);
        };

        fetchContent();
    }, []);

    return { data, loading };
}
