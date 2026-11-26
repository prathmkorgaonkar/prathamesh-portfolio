
import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import type { Skill, SkillInput } from "../../types/skill";

import { getAllSkills, createSkill, updateSkill, deleteSkill } from "../../api/skill.api";

interface SkillFormData {
  name: string;
  category: string;
  proficiency: number;
  displayOrder: number;
  isActive: boolean;
}

const initialFormData: SkillFormData = {
  name: "",
  category: "",
  proficiency: 0,
  displayOrder: 0,
  isActive: true,
};

const SkillsManagement = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);

  const [formData, setFormData] =
    useState<SkillFormData>(initialFormData);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Fetch skills
  useEffect(() => {
    let isMounted = true;

    const loadSkills = async () => {
      try {
        const response = await getAllSkills({ page: 1, limit, });

        if (isMounted) {
          setSkills(response.data);
          setCurrentPage(response.pagination.page);
          setTotalPages(response.pagination.totalPages);
        }
      } catch (err) {
        console.error("Skills fetch error:", err);

        if (isMounted) {
          setError("Unable to fetch skills.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadSkills();

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

  // Refresh skills
  const fetchSkills = async (pageNumber = currentPage) => {
    const response = await getAllSkills({ page: pageNumber, limit, });

    setSkills(response.data);
    setCurrentPage(response.pagination.page);
    setTotalPages(response.pagination.totalPages);
  };

  // Handle input changes
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        name === "proficiency" || name === "displayOrder"
          ? Number(value)
          : value,
    }));
  };

  // Edit skill
  const handleEdit = (skill: Skill) => {
    setEditingSkillId(skill.id);

    setFormData({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      displayOrder: skill.displayOrder,
      isActive: skill.isActive,
    });

    setShowForm(true);
    setError("");
    setSuccess("");
  };

  // Add or update skill
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const skillData: SkillInput = {
        name: formData.name.trim(),
        category: formData.category.trim(),
        proficiency: formData.proficiency,
        displayOrder: formData.displayOrder,
        isActive: formData.isActive,
      };

      if (editingSkillId) {
        await updateSkill(editingSkillId, skillData);
      } else {
        await createSkill(skillData);
      }

      setFormData({ ...initialFormData });
      setShowForm(false);
      setEditingSkillId(null);

      await fetchSkills();

      setSuccess(
        editingSkillId
          ? "Skill updated successfully."
          : "Skill created successfully."
      );
    } catch (err) {
      console.error("Save skill error:", err);
      setError("Unable to save skill. Please check the details.");
    } finally {
      setSaving(false);
    }
  };

  // Delete skill
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this skill?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await deleteSkill(id);

      setSkills((previous) =>
        previous.filter((skill) => skill.id !== id)
      );

      setSuccess("Skill deleted successfully.");
    } catch (err) {
      console.error("Delete skill error:", err);
      setError("Unable to delete skill.");
    }
  };

  if (loading) {
    return (
      <div className="text-gray-600 dark:text-gray-300">
        Loading skills...
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Skills Management
          </h1>

          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your technical skills and proficiency levels.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingSkillId(null);
            setFormData({ ...initialFormData });
            setShowForm(true);
            setError("");
            setSuccess("");
          }}
          className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
        >
          + Add New Skill
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
            {editingSkillId ? "Edit Skill" : "Add New Skill"}
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Skill Name */}
            <div>
              <label className="mb-2 block text-sm text-gray-700 dark:text-gray-300">
                Skill Name *
              </label>

              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                maxLength={100}
                className="w-full rounded-lg border border-gray-300 bg-transparent p-3 text-gray-900 dark:border-gray-700 dark:text-white"
                placeholder="Example: Node.js"
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm text-gray-700 dark:text-gray-300">
                Category *
              </label>

              <input
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                maxLength={50}
                className="w-full rounded-lg border border-gray-300 bg-transparent p-3 text-gray-900 dark:border-gray-700 dark:text-white"
                placeholder="Backend, Frontend, Database"
              />
            </div>
          </div>

          {/* Proficiency */}
          <div>
            <label className="mb-2 block text-sm text-gray-700 dark:text-gray-300">
              Proficiency: {formData.proficiency}%
            </label>

            <input
              name="proficiency"
              type="range"
              min="0"
              max="100"
              step="5"
              value={formData.proficiency}
              onChange={handleInputChange}
              className="w-full accent-blue-600"
            />

            <div className="flex justify-between text-xs text-gray-500">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Display Order and Active Status */}
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
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData((previous) => ({
                    ...previous,
                    isActive: e.target.checked,
                  }))
                }
              />
              Active Skill
            </label>
          </div>

          {/* Form Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingSkillId
                  ? "Update Skill"
                  : "Save Skill"}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingSkillId(null);
                setFormData({ ...initialFormData });
              }}
              className="rounded-lg bg-gray-200 px-5 py-3 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Skills Table */}
      <div className="overflow-x-auto rounded-xl bg-white p-5 shadow-sm dark:bg-gray-900">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-sm text-gray-500 dark:border-gray-700">
              <th className="px-4 py-3">Skill</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Proficiency</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {skills.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  No skills found.
                </td>
              </tr>
            ) : (
              skills.map((skill) => (
                <tr
                  key={skill.id}
                  className="border-b dark:border-gray-800"
                >
                  <td className="px-4 py-4 font-medium text-gray-900 dark:text-white">
                    {skill.name}
                  </td>

                  <td className="px-4 py-4 text-gray-600 dark:text-gray-300">
                    {skill.category}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{
                            width: `${skill.proficiency}%`,
                          }}
                        />
                      </div>

                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {skill.proficiency}%
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-gray-600 dark:text-gray-300">
                    {skill.displayOrder}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${skill.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                        }`}
                    >
                      {skill.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(skill)}
                        className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(skill.id)}
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
      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Page {currentPage} of {totalPages}
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => fetchSkills(currentPage - 1)}
            className="rounded-lg bg-gray-200 px-4 py-2 text-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-white"
          >
            Previous
          </button>

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => fetchSkills(currentPage + 1)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillsManagement;
