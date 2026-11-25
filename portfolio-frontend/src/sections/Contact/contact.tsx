import { useState } from "react";
import { submitContact } from "../../api/contact.api";
import type { ContactInput } from "../../types/contact";

const Contact = () => {
  // State must be INSIDE the component
  const [formData, setFormData] = useState<ContactInput>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const response = await submitContact(formData);

      setSuccess(response.message || "Message sent successfully!");

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      console.error("Contact submission failed:", err);
      setError("Unable to send your message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // JSX must be returned from the component
  return (
    <section
      id="contact"
      className="py-20 bg-white dark:bg-gray-950 transition-colors"
    >
      <div className="max-w-3xl mx-auto px-6">

        <h2 className="text-3xl font-bold text-center mb-10
          text-gray-900 dark:text-white">
          Contact Me
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            maxLength={100}
            className="w-full rounded-lg border p-3
              bg-white dark:bg-gray-900
              text-gray-900 dark:text-white
              border-gray-300 dark:border-gray-700"
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            maxLength={150}
            className="w-full rounded-lg border p-3
              bg-white dark:bg-gray-900
              text-gray-900 dark:text-white
              border-gray-300 dark:border-gray-700"
          />

          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            required
            maxLength={200}
            className="w-full rounded-lg border p-3
              bg-white dark:bg-gray-900
              text-gray-900 dark:text-white
              border-gray-300 dark:border-gray-700"
          />

          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            className="w-full rounded-lg border p-3
              bg-white dark:bg-gray-900
              text-gray-900 dark:text-white
              border-gray-300 dark:border-gray-700"
          />

          {success && (
            <p className="text-green-600 dark:text-green-400">
              {success}
            </p>
          )}

          {error && (
            <p className="text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-lg bg-blue-600
              text-white hover:bg-blue-700
              disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>

        </form>
      </div>
    </section>
  );
};

export default Contact;