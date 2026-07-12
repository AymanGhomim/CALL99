/**
 * Pull a user-facing message out of an axios error, falling back gracefully.
 * Mirrors the extraction order already used across the auth flow:
 * server-provided error message -> generic error message -> caller fallback.
 */
export function getErrorMessage(err, fallback) {
  return (
    err?.response?.data?.error?.message ||
    err?.response?.data?.message ||
    err?.message ||
    fallback
  );
}
