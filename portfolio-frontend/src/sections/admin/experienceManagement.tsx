
import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import type {
  Experience,
  ExperienceInput,
} from "../../types/experience";

import {
  getAllExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
} from "../../api/experience.api";

interface ExperienceFormData {
  companyName: string;
  designation: string;
  description: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  technologies: string;
  displayOrder: number;
}

const initialFormData: ExperienceFormData = {
  companyName: "",
  designation: "",
  description: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  technologies: "",
  displayOrder: 0,
};

const ExperienceManagement = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingExperienceId, setEditingExperienceId] =
    useState<string | null>(null);

  const [formData, setFormData] =
    useState<ExperienceFormData>(initialFormData);

  // Fetch experiences
  useEffect(() => {
    let isMounted = true;

    const loadExperiences = async () => {
      try {
        const response = await getAllExperiences();

        if (isMounted) {
          setExperiences(response.data);
        }
      } catch (err) {
        console.error("Experience fetch error:", err);

        if (isMounted) {
          setError("Unable to fetch work experiences.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadExperiences();

    return () => {
      isMounted = false;
    };
  }, []);

  // Automatically dismiss success message after 2 seconds
  useEffect(() => {
    if (!success) return;

    const timer = setTimeout(() => {
      setSuccess("");
    }, 2000);

    return () => clearTimeout(timer);
  }, [success]);

  // Refresh experiences
  const fetchExperiences = async () => {
    const response = await getAllExperiences();
    setExperiences(response.data);
  };

  // Handle input changes
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        name === "displayOrder" ? Number(value) : value,
    }));
  };

  // Edit experience
  const handleEdit = (experience: Experience) => {
    setEditingExperienceId(experience.id);

    setFormData({
      companyName: experience.companyName,
      designation: experience.designation,
      description: experience.description,
      startDate: experience.startDate.slice(0, 10),
      endDate: experience.endDate
        ? experience.endDate.slice(0, 10)
        : "",
      isCurrent: experience.isCurrent,
      technologies: experience.technologies.join(", "),
      displayOrder: experience.displayOrder,
    });

    setShowForm(true);
    setError("");
    setSuccess("");
  };

  // Add or update experience
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (
        formData.endDate &&
        !formData.isCurrent &&
        formData.endDate < formData.startDate
      ) {
        setError("End date cannot be earlier than start date.");
        return;
      }

      const experienceData: ExperienceInput = {
        companyName: formData.companyName.trim(),
        designation: formData.designation.trim(),
        description: formData.description.trim(),
        startDate: formData.startDate,
        endDate: formData.isCurrent
          ? null
          : formData.endDate || null,
        isCurrent: formData.isCurrent,
        technologies: formData.technologies
          .split(",")
          .map((technology) => technology.trim())
          .filter(Boolean),
        displayOrder: formData.displayOrder,
      };

      if (editingExperienceId) {
        await updateExperience(
          editingExperienceId,
          experienceData
        );
      } else {
        await createExperience(experienceData);
      }

      const wasEditing = Boolean(editingExperienceId);

      setFormData({ ...initialFormData });
      setShowForm(false);
      setEditingExperienceId(null);

      await fetchExperiences();

      setSuccess(
        wasEditing
          ? "Experience updated successfully."
          : "Experience created successfully."
      );
    } catch (err) {
      console.error("Save experience error:", err);
      setError(
        "Unable to save experience. Please check the details."
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete experience
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this experience?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await deleteExperience(id);

      setExperiences((previous) =>
        previous.filter((experience) => experience.id !== id)
      );

      setSuccess("Experience deleted successfully.");
    } catch (err) {
      console.error("Delete experience error:", err);
      setError("Unable to delete experience.");
    }
  };

  // Format date
  const formatDate = (date: string | null) => {
    if (!date) return "Present";

    return new Date(`${date.slice(0, 10)}T00:00:00`).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  if (loading) {
    return (
      <div className="text-gray-600 dark:text-gray-300">
        Loading experiences...
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Experience Management
          </h1>

          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your professional work experience.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingExperienceId(null);
            setFormData({ ...initialFormData });
            setShowForm(true);
            setError("");
            setSuccess("");
          }}
          className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
        >
          + Add Experience
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

      {/* Add / Edit Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 space-y-5 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {editingExperienceId
              ? "Edit Experience"
              : "Add New Experience"}
          </h2>

          {/* Company and Designation */}
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-gray-700 dark:text-gray-300">
                Company Name *
              </label>

              <input
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                required
                maxLength={150}
                className="w-full rounded-lg border border-gray-300 bg-transparent p-3 text-gray-900 dark:border-gray-700 dark:text-white"
                placeholder="Enter company name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-700 dark:text-gray-300">
                Designation *
              </label>

              <input
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                required
                maxLength={150}
                className="w-full rounded-lg border border-gray-300 bg-transparent p-3 text-gray-900 dark:border-gray-700 dark:text-white"
                placeholder="Node.js Backend Developer"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm text-gray-700 dark:text-gray-300">
              Job Description *
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full rounded-lg border border-gray-300 bg-transparent p-3 text-gray-900 dark:border-gray-700 dark:text-white"
              placeholder="Describe your responsibilities and achievements"
            />
          </div>

          {/* Dates */}
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-gray-700 dark:text-gray-300">
                Start Date *
              </label>

              <input
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                className="w-full rounded-lg border border-gray-300 bg-transparent p-3 text-gray-900 dark:border-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-700 dark:text-gray-300">
                End Date
              </label>

              <input
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleInputChange}
                disabled={formData.isCurrent}
                min={formData.startDate || undefined}
                className="w-full rounded-lg border border-gray-300 bg-transparent p-3 text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Currently Working */}
          <label className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={formData.isCurrent}
              onChange={(e) =>
                setFormData((previous) => ({
                  ...previous,
                  isCurrent: e.target.checked,
                  endDate: e.target.checked ? "" : previous.endDate,
                }))
              }
            />
            I currently work here
          </label>

          {/* Technologies */}
          <div>
            <label className="mb-2 block text-sm text-gray-700 dark:text-gray-300">
              Technologies (comma separated) *
            </label>

            <input
              name="technologies"
              value={formData.technologies}
              onChange={handleInputChange}
              required
              className="w-full rounded-lg border border-gray-300 bg-transparent p-3 text-gray-900 dark:border-gray-700 dark:text-white"
              placeholder="Node.js, Express, TypeScript, PostgreSQL"
            />
          </div>

          {/* Display Order */}
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

          {/* Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingExperienceId
                  ? "Update Experience"
                  : "Save Experience"}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingExperienceId(null);
                setFormData({ ...initialFormData });
              }}
              className="rounded-lg bg-gray-200 px-5 py-3 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Experience Table */}
      <div className="overflow-x-auto rounded-xl bg-white p-5 shadow-sm dark:bg-gray-900">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-sm text-gray-500 dark:border-gray-700">
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Designation</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Technologies</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {experiences.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  No work experiences found.
                </td>
              </tr>
            ) : (
              experiences.map((experience) => (
                <tr
                  key={experience.id}
                  className="border-b dark:border-gray-800"
                >
                  <td className="px-4 py-4 font-medium text-gray-900 dark:text-white">
                    {experience.companyName}
                  </td>

                  <td className="px-4 py-4 text-gray-600 dark:text-gray-300">
                    {experience.designation}
                  </td>

                  <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {formatDate(experience.startDate)}
                    {" - "}
                    {experience.isCurrent
                      ? "Present"
                      : formatDate(experience.endDate)}
                  </td>

                  <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {experience.technologies.join(", ")}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${experience.isCurrent
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-700"
                        }`}
                    >
                      {experience.isCurrent ? "Current" : "Previous"}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(experience)}
                        className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(experience.id)}
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

export default ExperienceManagement;
