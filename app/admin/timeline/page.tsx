'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Button from '@/components/ui/button/Button';

type TimelineItem = {
    id: string;
    type: 'experience' | 'organization';
    role: string;
    company: string;
    location: string | null;
    start_date: string;
    end_date: string | null;
};

export default function AdminTimelinePage() {
    const [items, setItems] = useState<TimelineItem[]>([]);
    const [form, setForm] = useState<Omit<TimelineItem, 'id'>>({
        type: 'experience',
        role: '',
        company: '',
        location: '',
        start_date: '',
        end_date: '',
    });

    const fetchData = async () => {
        const { data } = await supabase
            .from('timeline')
            .select('*')
            .order('start_date', { ascending: false });
        if (data) setItems(data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAdd = async () => {
        const { error } = await supabase.from('timeline').insert([form]);
        if (!error) {
            setForm({
                type: 'experience',
                role: '',
                company: '',
                location: '',
                start_date: '',
                end_date: '',
            });
            fetchData();
        }
    };

    const handleDelete = async (id: string) => {
        await supabase.from('timeline').delete().eq('id', id);
        fetchData();
    };

    const experiences = items.filter((i) => i.type === 'experience');
    const organizations = items.filter((i) => i.type === 'organization');

    return (
        <div className="p-6">
            <h1 className="text-xl font-semibold mb-4">Manage Timeline</h1>

            {/* FORM INPUT */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <select
                    name="type"
                    value={form.type}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900 text-sm"
                >
                    <option value="experience">Experience</option>
                    <option value="organization">Organization</option>
                </select>

                <input
                    type="text"
                    name="role"
                    placeholder="Role"
                    value={form.role}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900 text-sm"
                />

                <input
                    type="text"
                    name="company"
                    placeholder="Company"
                    value={form.company}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900 text-sm"
                />

                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={form.location ?? ''}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900 text-sm"
                />

                <input
                    type="text"
                    name="start_date"
                    placeholder="Start Date"
                    value={form.start_date}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900 text-sm"
                />

                <input
                    type="text"
                    name="end_date"
                    placeholder="End Date (optional)"
                    value={form.end_date ?? ''}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900 text-sm"
                />
            </div>

            <div className="md:col-span-3 text-right">
                <button
                    onClick={handleAdd}
                    className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    Add Timeline Item
                </button>
            </div>


            {/* EXPERIENCE SECTION */}
            <div className="mb-6">
                <h2 className="text-lg font-medium mb-3 text-brand-600 dark:text-white">Experiences</h2>
                <div className="space-y-3">
                    {experiences.map((item) => (
                        <div
                            key={item.id}
                            className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-3 rounded"
                        >
                            <div>
                                <p className="font-semibold text-sm">{item.role}</p>
                                <p className="text-xs text-gray-500">
                                    {item.company} • {item.start_date} – {item.end_date ?? 'Present'}
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500 hover:text-red-600 border border-red-500"
                                onClick={() => handleDelete(item.id)}
                            >
                                Delete
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            {/* ORGANIZATION SECTION */}
            <div>
                <h2 className="text-lg font-medium mb-3 text-brand-600 dark:text-white">Organizations</h2>
                <div className="space-y-3">
                    {organizations.map((item) => (
                        <div
                            key={item.id}
                            className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-3 rounded"
                        >
                            <div>
                                <p className="font-semibold text-sm">{item.role}</p>
                                <p className="text-xs text-gray-500">
                                    {item.company} • {item.start_date} – {item.end_date ?? 'Present'}
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500 hover:text-red-600 border border-red-500"
                                onClick={() => handleDelete(item.id)}
                            >
                                Delete
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
