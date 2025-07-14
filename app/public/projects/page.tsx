'use client'

import { useEffect, useState } from 'react'
import GridLayout, { Layout } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import PublicNavBar from "@/components/ui/PublicNavbar";
import Footer from "@/components/ui/Footer";
import { supabase } from '@/lib/supabaseClient'

interface Project {
    id: string
    title: string
    description: string
    image_url: string
    tech_stack: string[]
    demo_url: string
    source_url: string
}

export default function ProjectsGrid() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [layout, setLayout] = useState<Layout[]>([])

    useEffect(() => {
        const fetchProjects = async () => {
            const { data } = await supabase.from('projects').select('*')
            if (data) {
                setProjects(data)

                // generate initial layout secara statis saat load awal
                const generatedLayout: Layout[] = data.map((p, i) => ({
                    i: p.id,
                    x: (i * 2) % 6,
                    y: Math.floor(i / 3),
                    w: i % 5 === 0 ? 2 : 1,
                    h: i % 4 === 0 ? 2 : 1,
                }))
                setLayout(generatedLayout)
            }
            setLoading(false)
        }

        fetchProjects()
    }, [])

    return (
        <>
            <PublicNavBar />
            <div className="pt-24 px-4 min-h-screen bg-black text-white">
                <h1 className="text-3xl font-bold text-center mb-6">Projects (Drag untuk menyesuaikan)</h1>

                <div className="max-w-[1200px] mx-auto">
                    <GridLayout
                        className="layout"
                        layout={layout}
                        cols={6}
                        rowHeight={150}
                        width={1200}
                        isResizable={false}
                        isDraggable={true}
                        compactType="vertical"
                        preventCollision={true}
                        onLayoutChange={(newLayout) => setLayout(newLayout)} // optional: simpan perubahan
                    >
                        {projects.map((project) => (
                            <div key={project.id} className="bg-zinc-900 p-4 rounded-xl overflow-hidden shadow-md">
                                <img
                                    src={project.image_url}
                                    alt={project.title}
                                    className="h-[120px] w-full object-cover rounded mb-3"
                                />
                                <h3 className="font-semibold mb-1">{project.title}</h3>
                                <p className="text-sm text-gray-300 mb-2 line-clamp-2">{project.description}</p>
                                <div className="flex flex-wrap gap-1 text-xs text-gray-400">
                                    {project.tech_stack.map((tech) => (
                                        <span key={tech} className="bg-zinc-800 px-2 py-1 rounded">{tech}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </GridLayout>
                </div>
            </div>
            <Footer />
        </>
    )
}
