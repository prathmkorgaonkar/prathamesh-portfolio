
import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import {
    getAllProjects,
    deleteProject,
    createProject,
    updateProject
} from "../../api/project.api";
import type { Project, ProjectInput } from "../../types/project";

interface ProjectFormData {
    title: string;
    slug: string;
    description: string;
    techStack: string;
    githubUrl: string;
    liveUrl: string;
    featured: boolean;
    displayOrder: number;
}

const initialFormData: ProjectFormData = {
    title: "",
    slug: "",
    description: "",
    techStack: "",
    githubUrl: "",
    liveUrl: "",
    featured: false,
    displayOrder: 0,
};

const ProjectsManagement = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] =
        useState<ProjectFormData>(initialFormData);

    const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

    // Fetch projects
    useEffect(() => {
        let isMounted = true;

        const loadProjects = async () => {
            try {
                const response = await getAllProjects();

                if (isMounted) {
                    setProjects(response.data);
                }
            } catch (err) {
                console.error("Projects fetch error:", err);

                if (isMounted) {
                    setError("Unable to fetch projects.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadProjects();

        return () => {
            isMounted = false;
        };
    }, []);

    // Reusable project fetching function
    const fetchProjects = async () => {
        try {
            const response = await getAllProjects();
            setProjects(response.data);
        } catch (err) {
            console.error("Projects refresh error:", err);
            throw err;
        }
    };

    // Handle delete
    const handleDelete = async (id: string) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this project?"
        );

        if (!confirmed) return;

        try {
            setError("");
            setSuccess("");

            await deleteProject(id);

            setProjects((previous) =>
                previous.filter((project) => project.id !== id)
            );

            setSuccess("Project deleted successfully.");
        } catch (err) {
            console.error("Project delete error:", err);
            setError("Unable to delete project.");
        }
    };

    // Handle input changes
    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        if (name === "title") {
            const generatedSlug = value
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");

            setFormData((previous) => ({
                ...previous,
                title: value,
                slug: generatedSlug,
            }));

            return;
        }

        setFormData((previous) => ({
            ...previous,
            [name]: name === "displayOrder" ? Number(value) : value,
        }));
    };

    const handleEdit = (project: Project) => {
        setEditingProjectId(project.id);

        setFormData({
            title: project.title,
            slug: project.slug,
            description: project.description,
            techStack: project.techStack.join(", "),
            githubUrl: project.githubUrl ?? "",
            liveUrl: project.liveUrl ?? "",
            featured: project.featured,
            displayOrder: project.displayOrder,
        });

        setShowForm(true);
        setError("");
        setSuccess("");
    };

    // Handle create project
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const projectData: ProjectInput = {
                title: formData.title.trim(),
                slug: formData.slug.trim(),
                description: formData.description.trim(),

                techStack: formData.techStack
                    .split(",")
                    .map((tech) => tech.trim())
                    .filter(Boolean),

                githubUrl: formData.githubUrl.trim() || undefined,
                liveUrl: formData.liveUrl.trim() || undefined,

                featured: formData.featured,
                displayOrder: formData.displayOrder,
            };

            if (editingProjectId) {
                await updateProject(editingProjectId, projectData);
            } else {
                await createProject(projectData);
            }

            setFormData({ ...initialFormData });
            setShowForm(false);
            setEditingProjectId(null);

            await fetchProjects();

            setSuccess(
                editingProjectId
                    ? "Project updated successfully."
                    : "Project created successfully."
            );
        } catch (err) {
            console.error("Create project error:", err);
            setError(
                "Unable to create project. Please check the details and try again."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="text-gray-600 dark:text-gray-300">
                Loading projects...
            </div>
        );
    }

    return (
        <div>
            {/* Page Header */}
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Projects Management
                    </h1>

                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Manage your portfolio projects.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        setShowForm(true);
                        setError("");
                        setSuccess("");
                    }}
                    className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
                >
                    {editingProjectId ? "Edit Project" : "Add New Project"}
                </button>
            </div>

            {/* Success Message */}
            {success && (
                <div className="mb-5 rounded-lg bg-green-100 p-4 text-green-700">
                    {success}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mb-5 rounded-lg bg-red-100 p-4 text-red-700">
                    {error}
                </div>
            )}

            {/* Add Project Form */}
            {showForm && (
                <form
                    onSubmit={handleSubmit}
                    className="mb-8 space-y-5 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900"
                >
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Add New Project
                    </h2>

                    {/* Title and Slug */}
                    <div className="grid gap-5 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm text-gray-700 dark:text-gray-300">
                                Project Title *
                            </label>

                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                maxLength={150}
                                className="w-full rounded-lg border border-gray-300 bg-transparent p-3 text-gray-900 dark:border-gray-700 dark:text-white"
                                placeholder="Enter project title"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-gray-700 dark:text-gray-300">
                                Slug *
                            </label>

                            <input
                                name="slug"
                                value={formData.slug}
                                onChange={handleInputChange}
                                required
                                maxLength={180}
                                pattern="[a-z0-9]+(-[a-z0-9]+)*"
                                title="Use lowercase letters, numbers and hyphens only."
                                className="w-full rounded-lg border border-gray-300 bg-transparent p-3 text-gray-900 dark:border-gray-700 dark:text-white"
                                placeholder="project-slug"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="mb-2 block text-sm text-gray-700 dark:text-gray-300">
                            Description *
                        </label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                            rows={4}
                            className="w-full rounded-lg border border-gray-300 bg-transparent p-3 text-gray-900 dark:border-gray-700 dark:text-white"
                            placeholder="Describe your project"
                        />
                    </div>

                    {/* Technologies */}
                    <div>
                        <label className="mb-2 block text-sm text-gray-700 dark:text-gray-300">
                            Technologies * (comma separated)
                        </label>

                        <input
                            name="techStack"
                            value={formData.techStack}
                            onChange={handleInputChange}
                            required
                            className="w-full rounded-lg border border-gray-300 bg-transparent p-3 text-gray-900 dark:border-gray-700 dark:text-white"
                            placeholder="React, Node.js, TypeScript, PostgreSQL"
                        />
                    </div>

                    {/* URLs */}
                    <div className="grid gap-5 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm text-gray-700 dark:text-gray-300">
                                GitHub URL
                            </label>

                            <input
                                name="githubUrl"
                                type="url"
                                value={formData.githubUrl}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 bg-transparent p-3 text-gray-900 dark:border-gray-700 dark:text-white"
                                placeholder="https://github.com/..."
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-gray-700 dark:text-gray-300">
                                Live Demo URL
                            </label>

                            <input
                                name="liveUrl"
                                type="url"
                                value={formData.liveUrl}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 bg-transparent p-3 text-gray-900 dark:border-gray-700 dark:text-white"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    {/* Display Order and Featured */}
                    <div className="grid gap-5 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm text-gray-700 dark:text-gray-300">
                                Display Order
                            </label>

                            <input
                                name="displayOrder"
                                type="number"
                                min="0"
                                value={formData.displayOrder}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 bg-transparent p-3 text-gray-900 dark:border-gray-700 dark:text-white"
                            />
                        </div>

                        <label className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                            <input
                                type="checkbox"
                                checked={formData.featured}
                                onChange={(e) =>
                                    setFormData((previous) => ({
                                        ...previous,
                                        featured: e.target.checked,
                                    }))
                                }
                            />
                            Featured Project
                        </label>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-wrap gap-3">
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {saving
                                ? "Saving..."
                                : editingProjectId
                                    ? "Update Project"
                                    : "Save Project"}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setEditingProjectId(null);
                                setFormData({ ...initialFormData });
                                setShowForm(true);
                                setError("");
                                setSuccess("");
                            }}
                            className="rounded-lg bg-gray-200 px-5 py-3 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* Projects Table */}
            <div className="overflow-x-auto rounded-xl bg-white p-5 shadow-sm dark:bg-gray-900">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b text-sm text-gray-500 dark:border-gray-700">
                            <th className="px-4 py-3">Project</th>
                            <th className="px-4 py-3">Technologies</th>
                            <th className="px-4 py-3">Featured</th>
                            <th className="px-4 py-3">Order</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {projects.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-4 py-8 text-center text-gray-500"
                                >
                                    No projects found.
                                </td>
                            </tr>
                        ) : (
                            projects.map((project) => (
                                <tr
                                    key={project.id}
                                    className="border-b dark:border-gray-800"
                                >
                                    <td className="px-4 py-4">
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {project.title}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            {project.slug}
                                        </p>
                                    </td>

                                    <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                                        {project.techStack.join(", ")}
                                    </td>

                                    <td className="px-4 py-4">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${project.featured
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-200 text-gray-700"
                                                }`}
                                        >
                                            {project.featured ? "Featured" : "Not Featured"}
                                        </span>
                                    </td>

                                    <td className="px-4 py-4 text-gray-600 dark:text-gray-300">
                                        {project.displayOrder}
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleEdit(project)}
                                                className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleDelete(project.id)}
                                                className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProjectsManagement;
