"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setErrorMsg(error.message);
        } else {
            router.push("/admin/home");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900 px-4 transition-colors">
            <form
                onSubmit={handleLogin}
                className="bg-white dark:bg-zinc-800 dark:text-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>

                {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}

                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-200 mb-2">Email</label>
                    <input
                        type="email"
                        required
                        className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-zinc-900 text-black dark:text-white"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-200 mb-2">Password</label>
                    <input
                        type="password"
                        required
                        className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-zinc-900 text-black dark:text-white"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-colors"
                >
                    Login
                </button>
            </form>
        </div>
    );
}
