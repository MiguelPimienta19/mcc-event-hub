/**
 * Authentication Utilities
 *
 * Centralized authentication helper functions to avoid duplication.
 */

/**
 * Get admin authentication token from localStorage
 */
export const getAdminToken = (): string | null => {
  return localStorage.getItem("admin_token");
};

/**
 * Get admin email from localStorage
 */
export const getAdminEmail = (): string | null => {
  return localStorage.getItem("admin_email");
};

/**
 * Get authentication headers with Bearer token
 * Includes both Authorization and Content-Type headers
 */
export const getAuthHeaders = () => {
  const token = getAdminToken();
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

/**
 * Check if user is authenticated (has both token and email)
 */
export const isAuthenticated = (): boolean => {
  const token = getAdminToken();
  const email = getAdminEmail();
  return !!(token && email);
};

/**
 * Clear authentication data from localStorage
 */
export const clearAuth = (): void => {
  localStorage.removeItem("admin_token");
  localStorage.removeItem("admin_email");
};

/**
 * Set authentication data in localStorage
 */
export const setAuth = (token: string, email: string): void => {
  localStorage.setItem("admin_token", token);
  localStorage.setItem("admin_email", email);
};
