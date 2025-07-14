"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AdminHome() {
    const router = useRouter();
    const [introText, setIntroText] = useState('');
    const [pages, setPages] = useState([{ label: '', slug: '' }]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        const checkSession = async () => {
            const { data } = await supabase.auth.getSession();
            if (!data.session) {
                router.push("/admin/login");
            }
        };
        checkSession();
    }, [router]);

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from("home_content")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(1);

            if (error) {
                console.error("Error fetching:", error);
            }

            if (data && data.length > 0) {
                setIntroText(data[0].intro_text || "");
                setPages(data[0].pages || []);
                setEditingId(data[0].id);
            }

            setLoading(false);
        };

        fetchData();
    }, []);

    const handleSave = async () => {
        if (!editingId) {
            alert("ID konten tidak ditemukan.");
            return;
        }

        const { error } = await supabase
            .from("home_content")
            .update({
                intro_text: introText,
                pages,
                updated_at: new Date().toISOString(),
            })
            .eq("id", editingId)
            .select();

        if (error) {
            console.error("Update error:", error);
            alert("Gagal menyimpan perubahan.");
        } else {
            alert("Konten berhasil disimpan ✅");
        }
    };

    const handleAddPage = () => setPages([...pages, { label: "", slug: "" }]);
    const handleRemovePage = (index: number) => {
        const updated = [...pages];
        updated.splice(index, 1);
        setPages(updated);
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-600 dark:text-gray-300">Loading...</div>;
    }

    return (
        <div className="max-w-3xl text-gray-800 dark:text-gray-100">
            <h1 className="text-3xl font-bold mb-6">Edit Home Content</h1>

            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
                Intro Text:
            </label>
            <textarea
                value={introText}
                onChange={(e) => setIntroText(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-lg p-3 mb-3 text-gray-800 dark:text-gray-100"
                rows={3}
            />

            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
                Pages:
            </label>
            {pages.map((page, index) => (
                <div key={index} className="flex gap-2 mb-2">
                    <input
                        type="text"
                        placeholder="Label"
                        value={page.label}
                        onChange={(e) => {
                            const updated = [...pages];
                            updated[index].label = e.target.value;
                            setPages(updated);
                        }}
                        className="w-1/2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded p-2"
                    />
                    <input
                        type="text"
                        placeholder="Slug"
                        value={page.slug}
                        onChange={(e) => {
                            const updated = [...pages];
                            updated[index].slug = e.target.value;
                            setPages(updated);
                        }}
                        className="w-1/2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded p-2"
                    />
                    <button
                        onClick={() => handleRemovePage(index)}
                        className="px-2 text-red-500 hover:underline"
                    >
                        ✕
                    </button>
                </div>
            ))}

            <button
                onClick={handleAddPage}
                className="mb-4 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
                + Tambah Page
            </button>

            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                    Simpan
                </button>
            </div>
        </div>
    );
}
