
import { useEffect, useState } from "react";
import type { Contact } from "../../types/contact";

import {
  getAllContacts,
  getContactById,
  updateContactReadStatus,
  deleteContact,
} from "../../api/contact.api";

const ContactsManagement = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalContacts, setTotalContacts] = useState(0);

  const [selectedContact, setSelectedContact] =
    useState<Contact | null>(null);

  const [detailsLoading, setDetailsLoading] = useState(false);

  // Fetch contacts whenever search, filter or page changes
  useEffect(() => {
    let isMounted = true;

    const loadContacts = async () => {
      try {
        setLoading(true);
        setError("");

        const params: {
          page: number;
          limit: number;
          search?: string;
          isRead?: boolean;
        } = { page, limit };

        if (search.trim()) {
          params.search = search.trim();
        }

        if (filter !== "all") {
          params.isRead = filter === "read";
        }

        const response = await getAllContacts(params);

        if (isMounted) {
          setContacts(response.data);
          setTotalPages(response.pagination.totalPages);
          setTotalContacts(response.pagination.total);
        }
      } catch (err) {
        console.error("Contacts fetch error:", err);

        if (isMounted) {
          setError("Unable to fetch contact messages.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadContacts();

    return () => {
      isMounted = false;
    };
  }, [page, limit, search, filter]);

  // Open contact details
  const handleViewContact = async (id: string) => {
    try {
      setDetailsLoading(true);
      setError("");

      const response = await getContactById(id);
      setSelectedContact(response.data);

      // If the message was unread, mark it as read
      if (!response.data.isRead) {
        await updateContactReadStatus(id, true);

        setSelectedContact((previous) =>
          previous ? { ...previous, isRead: true } : null
        );

        setContacts((previous) =>
          previous.map((contact) =>
            contact.id === id
              ? { ...contact, isRead: true }
              : contact
          )
        );
      }
    } catch (err) {
      console.error("Contact details error:", err);
      setError("Unable to load contact details.");
    } finally {
      setDetailsLoading(false);
    }
  };

  // Mark as Read / Unread
  const handleReadStatus = async (
    contact: Contact
  ) => {
    try {
      setError("");
      setSuccess("");

      const newStatus = !contact.isRead;

      await updateContactReadStatus(contact.id, newStatus);

      setContacts((previous) =>
        previous.map((item) =>
          item.id === contact.id
            ? { ...item, isRead: newStatus }
            : item
        )
      );

      setSelectedContact((previous) =>
        previous?.id === contact.id
          ? { ...previous, isRead: newStatus }
          : previous
      );

      setSuccess(
        newStatus
          ? "Message marked as read."
          : "Message marked as unread."
      );
    } catch (err) {
      console.error("Read status update error:", err);
      setError("Unable to update message status.");
    }
  };

  // Delete contact
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await deleteContact(id);

      setContacts((previous) =>
        previous.filter((contact) => contact.id !== id)
      );

      if (selectedContact?.id === id) {
        setSelectedContact(null);
      }

      setTotalContacts((previous) => Math.max(0, previous - 1));

      setSuccess("Contact message deleted successfully.");
    } catch (err) {
      console.error("Delete contact error:", err);
      setError("Unable to delete contact message.");
    }
  };

  // Format date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Contacts Management
        </h1>

        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage messages received through your portfolio.
        </p>
      </div>

      {/* Statistics */}
      <div className="mb-6 grid gap-5 sm:grid-cols-2">
        <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-900">
          <p className="text-sm text-gray-500">Total Messages</p>
          <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {totalContacts}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-900">
          <p className="text-sm text-gray-500">
            Unread Messages on This Page
          </p>
          <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {contacts.filter((contact) => !contact.isRead).length}
          </h2>
        </div>
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

      {/* Search and Filter */}
      <div className="mb-6 flex flex-wrap gap-4">
        <input
          type="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search name, email or subject..."
          className="min-w-[240px] flex-1 rounded-lg border border-gray-300 bg-white p-3 text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        />

        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        >
          <option value="all">All Messages</option>
          <option value="read">Read</option>
          <option value="unread">Unread</option>
        </select>
      </div>

      {/* Contacts Table */}
      <div className="overflow-x-auto rounded-xl bg-white p-5 shadow-sm dark:bg-gray-900">
        {loading ? (
          <p className="py-8 text-center text-gray-500">
            Loading contact messages...
          </p>
        ) : contacts.length === 0 ? (
          <p className="py-8 text-center text-gray-500">
            No contact messages found.
          </p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-sm text-gray-500 dark:border-gray-700">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {contacts.map((contact) => (
                <tr
                  key={contact.id}
                  className="border-b dark:border-gray-800"
                >
                  <td className="px-4 py-4 font-medium text-gray-900 dark:text-white">
                    {contact.name}
                  </td>

                  <td className="px-4 py-4 text-gray-600 dark:text-gray-300">
                    {contact.email}
                  </td>

                  <td className="px-4 py-4 text-gray-600 dark:text-gray-300">
                    {contact.subject}
                  </td>

                  <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {formatDate(contact.createdAt)}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        contact.isRead
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {contact.isRead ? "Read" : "Unread"}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleViewContact(contact.id)}
                        className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                      >
                        View
                      </button>

                      <button
                        type="button"
                        onClick={() => handleReadStatus(contact)}
                        className="rounded-lg bg-gray-600 px-3 py-2 text-sm text-white hover:bg-gray-700"
                      >
                        {contact.isRead ? "Unread" : "Read"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(contact.id)}
                        className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {!loading && totalContacts > 0 && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              Page {page} of {totalPages} · {totalContacts} messages
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((previous) => previous - 1)}
                className="rounded-lg bg-gray-200 px-4 py-2 text-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-white"
              >
                Previous
              </button>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((previous) => previous + 1)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Contact Details Modal */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Contact Message Details
              </h2>

              <button
                type="button"
                onClick={() => setSelectedContact(null)}
                className="rounded-lg bg-gray-200 px-3 py-2 text-gray-800 dark:bg-gray-700 dark:text-white"
              >
                Close
              </button>
            </div>

            {detailsLoading ? (
              <p className="text-gray-500">Loading message...</p>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedContact.name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <a
                    href={`mailto:${selectedContact.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {selectedContact.email}
                  </a>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Subject</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedContact.subject}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Message</p>
                  <p className="whitespace-pre-wrap break-words rounded-lg bg-gray-100 p-4 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                    {selectedContact.message}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Received</p>
                  <p className="text-gray-900 dark:text-white">
                    {formatDate(selectedContact.createdAt)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => handleReadStatus(selectedContact)}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    Mark as {selectedContact.isRead ? "Unread" : "Read"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(selectedContact.id)}
                    className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                  >
                    Delete Message
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactsManagement;
