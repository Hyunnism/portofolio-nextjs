'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Trash2, Pencil } from 'lucide-react'

interface Project {
    id?: string
    title: string
    description: string
    image_url: string
    tech_stack: string[]
    demo_url: string
    source_url: string
}

// Manual Button component
function Button({
    children,
    onClick,
    type = 'button',
    className = '',
    variant = 'default',
    size = 'md',
}: {
    children: React.ReactNode
    onClick?: () => void
    type?: 'button' | 'submit'
    className?: string
    variant?: 'default' | 'outline' | 'destructive'
    size?: 'sm' | 'md'
}) {
    const base = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none'
    const variants = {
        default: 'bg-blue-600 text-white hover:bg-blue-700',
        outline: 'border border-gray-300 text-gray-800 hover:bg-gray-100',
        destructive: 'bg-red-600 text-white hover:bg-red-700',
    }
    const sizes = {
        sm: 'text-sm px-3 py-1.5',
        md: 'text-base px-4 py-2',
    }

    return (
        <button
            type={type}
            onClick={onClick}
            className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        >
            {children}
        </button>
    )
}

// Manual Input component
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        />
    )
}

// Manual Textarea component
function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <textarea
            {...props}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        />
    )
}

// Manual Dialog components
function Dialog({
    open,
    onOpenChange,
    children,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    children: React.ReactNode
}) {
    if (!open) return null
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-lg shadow-lg relative">
                <button
                    onClick={() => onOpenChange(false)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                >
                    ×
                </button>
                {children}
            </div>
        </div>
    )
}
const DialogHeader = ({ children }: { children: React.ReactNode }) => (
    <div className="mb-4">{children}</div>
)
const DialogTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-xl font-bold">{children}</h2>
)
const DialogContent = ({ children }: { children: React.ReactNode }) => <div>{children}</div>
const DialogFooter = ({ children }: { children: React.ReactNode }) => (
    <div className="mt-4 flex justify-end gap-2">{children}</div>
)

// Main Page
export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([])
    const [open, setOpen] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [form, setForm] = useState<Project>({
        title: '',
        description: '',
        image_url: '',
        tech_stack: [],
        demo_url: '',
        source_url: '',
    })

    const fetchProjects = async () => {
        const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
        if (data) setProjects(data)
    }

    useEffect(() => {
        fetchProjects()
    }, [])

    const handleSubmit = async () => {
        if (!form.title || !form.image_url) return alert('Title and Image URL are required.')

        if (isEditing && form.id) {
            await supabase
                .from('projects')
                .update({
                    ...form,
                    tech_stack: form.tech_stack,
                })
                .eq('id', form.id)
        } else {
            await supabase.from('projects').insert({
                ...form,
                tech_stack: form.tech_stack,
            })
        }
        setOpen(false)
        fetchProjects()
    }

    const handleDelete = async (id: string) => {
        if (confirm('Delete this project?')) {
            await supabase.from('projects').delete().eq('id', id)
            fetchProjects()
        }
    }

    const openEditModal = (project: Project) => {
        setIsEditing(true)
        setForm(project)
        setOpen(true)
    }

    const resetForm = () => {
        setIsEditing(false)
        setForm({ title: '', description: '', image_url: '', tech_stack: [], demo_url: '', source_url: '' })
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Projects</h1>
                <Button onClick={() => { resetForm(); setOpen(true) }}>Add Project</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div key={project.id} className="border rounded-xl p-4 shadow-sm bg-white dark:bg-gray-900">
                        <img src={project.image_url} alt={project.title} className="h-40 w-full object-cover rounded-md mb-3" />
                        <h2 className="text-lg font-semibold mb-1">{project.title}</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">{project.description}</p>
                        <div className="flex flex-wrap gap-2 text-xs mb-3">
                            {project.tech_stack?.map((tech) => (
                                <span key={tech} className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">{tech}</span>
                            ))}
                        </div>
                        <div className="flex gap-3">
                            <Button size="sm" variant="outline" onClick={() => openEditModal(project)}>
                                <Pencil size={16} className="mr-1" /> Edit
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDelete(project.id!)}>
                                <Trash2 size={16} className="mr-1" /> Delete
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isEditing ? 'Edit Project' : 'Add Project'}</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-3 py-2">
                        <Input
                            placeholder="Title"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                        />
                        <Textarea
                            placeholder="Description"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                        />
                        <Input
                            placeholder="Image URL"
                            value={form.image_url}
                            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                        />
                        <Input
                            placeholder="Tech Stack (comma separated)"
                            value={form.tech_stack.join(', ')}
                            onChange={(e) => setForm({ ...form, tech_stack: e.target.value.split(',').map(t => t.trim()) })}
                        />
                        <Input
                            placeholder="Demo URL"
                            value={form.demo_url}
                            onChange={(e) => setForm({ ...form, demo_url: e.target.value })}
                        />
                        <Input
                            placeholder="Source Code URL"
                            value={form.source_url}
                            onChange={(e) => setForm({ ...form, source_url: e.target.value })}
                        />
                    </div>

                    <DialogFooter>
                        <Button onClick={handleSubmit}>{isEditing ? 'Update' : 'Create'}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
