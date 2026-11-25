import { useState } from "react";
import { loginAdmin } from "../../api/auth.api";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await loginAdmin({
        email,
        password,
      });

      if (!response.data?.token) {
        throw new Error("Login response does not contain a token.");
      }

      localStorage.setItem("adminToken", response.data.token);

      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      console.error("Admin login failed:", err);
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center
      bg-gray-100 dark:bg-gray-950 px-4">

      <div className="w-full max-w-md rounded-2xl p-8
        bg-white dark:bg-gray-900
        border border-gray-200 dark:border-gray-700
        shadow-xl">

        <h1 className="text-3xl font-bold text-center
          text-gray-900 dark:text-white">
          Admin Login
        </h1>

        <p className="text-center mt-2 mb-8
          text-gray-500 dark:text-gray-400">
          Sign in to manage your portfolio
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block mb-2 font-medium
              text-gray-700 dark:text-gray-200">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              autoComplete="username"
              className="w-full p-3 rounded-lg border
                bg-white dark:bg-gray-800
                text-gray-900 dark:text-white
                border-gray-300 dark:border-gray-700
                focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium
              text-gray-700 dark:text-gray-200">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              className="w-full p-3 rounded-lg border
                bg-white dark:bg-gray-800
                text-gray-900 dark:text-white
                border-gray-300 dark:border-gray-700
                focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg
              bg-blue-600 hover:bg-blue-700
              text-white font-semibold
              disabled:opacity-50 transition-colors"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </form>
      </div>
    </section>
  );
};

export default AdminLogin;