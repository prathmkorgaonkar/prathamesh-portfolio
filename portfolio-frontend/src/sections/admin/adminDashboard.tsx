import { useEffect, useState } from "react";
import {
  getDashboardStats,
  type DashboardStats,
  type RecentContact,
} from "../../api/dashboard.api";

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [contacts, setContacts] = useState<RecentContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await getDashboardStats();

        setStats(response.data.statistics);
        setContacts(response.data.recentContacts);
      } catch (err) {
        console.error("Dashboard error:", err);
        setError("Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const cards = [
    { title: "Total Projects", value: stats?.totalProjects ?? 0 },
    { title: "Total Skills", value: stats?.totalSkills ?? 0 },
    { title: "Experience", value: stats?.totalExperiences ?? 0 },
    { title: "Total Contacts", value: stats?.totalContacts ?? 0 },
    { title: "Unread Contacts", value: stats?.unreadContacts ?? 0 },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-950 dark:text-white">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Welcome to your portfolio admin panel.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {card.title}
              </p>

              <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">
                {card.value}
              </h2>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900">
          <h2 className="mb-5 text-xl font-semibold text-gray-900 dark:text-white">
            Recent Contact Messages
          </h2>

          {contacts.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No contact messages available.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Subject</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {contacts.map((contact) => (
                    <tr
                      key={contact.id}
                      className="border-b dark:border-gray-800"
                    >
                      <td className="px-4 py-4 text-gray-900 dark:text-white">
                        {contact.name}
                      </td>
                      <td className="px-4 py-4 text-gray-600 dark:text-gray-300">
                        {contact.email}
                      </td>
                      <td className="px-4 py-4 text-gray-600 dark:text-gray-300">
                        {contact.subject}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs ${
                            contact.isRead
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {contact.isRead ? "Read" : "Unread"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-gray-600 dark:text-gray-300">
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;