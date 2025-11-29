"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/constants";

export default function AdminAccessPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Call backend login endpoint
      const apiUrl = API_URL;
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        // If 401, email not authorized
        if (response.status === 401) {
          setError("Email not authorized. Contact an administrator.");
          return;
        }
        throw new Error("Login failed");
      }

      // Get the token from response
      const data = await response.json();
      const { token } = data;

      // Store token in localStorage
      localStorage.setItem("admin_token", token);
      localStorage.setItem("admin_email", email);

      // Redirect to admin dashboard
      router.push("/admin/dashboard");

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full">

        {/* Admin Access Card */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-text mb-4">MCC</h1>
          <h2 className="text-3xl font-semibold text-text mb-2">Admin Access</h2>
          <p className="text-muted">
            Enter your admin email to access the management panel
          </p>
        </div>

        <div className="bg-surface rounded-2xl shadow-lift p-8 border border-line">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-base font-medium text-text mb-2">
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@yourdomain.com"
                className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-base"
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-brand-700 hover:bg-brand-800 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verifying..." : "Access Admin Panel"}
            </button>
          </form>
        </div>

        {/* Back to Calendar Link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-muted hover:text-text transition-colors inline-flex items-center gap-2"
          >
            Back to Calendar
          </Link>
        </div>
      </div>
    </div>
  );
}
