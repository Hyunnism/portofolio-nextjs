"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type AboutForm = {
    id?: string;
    name: string;
    role: string;
    location: string;
    company: string;
    description: string;
    image_url: string;
};

export default function AboutAdminPage() {
    const [form, setForm] = useState<AboutForm>({
        id: "",
        name: "",
        role: "",
        location: "",
        company: "",
        description: "",
        image_url: "",
    });

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

    useEffect(() => {
        const fetchAbout = async () => {
            const { data: aboutData, error } = await supabase
                .from("about_content")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(1)
                .single();

            if (aboutData && !error) {
                setForm(aboutData);
            }
        };

        fetchAbout();
    }, []);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setStatus("idle");

        let error = null;

        if (form.id) {
            const { error: updateError } = await supabase
                .from("about_content")
                .update({
                    name: form.name,
                    role: form.role,
                    location: form.location,
                    company: form.company,
                    description: form.description,
                    image_url: form.image_url,
                })
                .eq("id", form.id);

            error = updateError;
        } else {
            const { error: insertError } = await supabase.from("about_content").insert([form]);
            error = insertError;
        }

        setLoading(false);
        setStatus(error ? "error" : "saved");
    };

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Edit About Content</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Kiri */}
                <div className="space-y-4">
                    <InputField label="Name" name="name" value={form.name} onChange={handleChange} />
                    <InputField label="Role" name="role" value={form.role} onChange={handleChange} />
                    <InputField label="Location" name="location" value={form.location} onChange={handleChange} />
                </div>

                {/* Kanan */}
                <div className="space-y-4">
                    <InputField label="Company" name="company" value={form.company} onChange={handleChange} />
                    <InputField label="Image URL" name="image_url" value={form.image_url} onChange={handleChange} />

                    <div>
                        <label className="block mb-1 text-sm font-medium">Description</label>
                        <textarea
                            name="description"
                            rows={6}
                            value={form.description}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        />
                    </div>
                </div>
            </div>

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
                {loading ? "Saving..." : "Save"}
            </button>

            {status === "saved" && <p className="text-green-500 mt-2">Content saved successfully.</p>}
            {status === "error" && <p className="text-red-500 mt-2">Failed to save content.</p>}
        </div>
    );
}

function InputField({
    label,
    name,
    value,
    onChange,
}: {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
    return (
        <div>
            <label className="block mb-1 text-sm font-medium">{label}</label>
            <input
                name={name}
                type="text"
                value={value}
                onChange={onChange}
                className="w-full p-2 border border-gray-300 rounded text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
        </div>
    );
}
