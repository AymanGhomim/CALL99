/**
 * Pull a user-facing message out of an axios error, falling back gracefully.
 * Mirrors the extraction order already used across the auth flow:
 * server-provided error message -> generic error message -> caller fallback.
 */
import axios from "axios";
import i18n from "../i18n";

const knownStatuses = new Set([400, 401, 403, 404, 409, 422, 429, 500]);

function isReadableServerMessage(message: string | undefined): message is string {
  return Boolean(message && !message.startsWith("errors.") && message !== "[object Object]");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object");
}

function getServerMessage(value: unknown): string | undefined {
  if (!isRecord(value)) return undefined;
  if (typeof value.message === "string" && isReadableServerMessage(value.message)) return value.message;
  if (isRecord(value.error) && typeof value.error.message === "string" && isReadableServerMessage(value.error.message)) {
    return value.error.message;
  }
  return undefined;
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isCancel(error)) return i18n.t("errors.canceled");

  if (axios.isAxiosError<unknown>(error)) {
    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      return i18n.t("errors.timeout");
    }

    if (!error.response) {
      return i18n.t("errors.network");
    }

    const serverMessage = getServerMessage(error.response.data);
    if (serverMessage) return serverMessage;

    const status = knownStatuses.has(error.response.status) ? error.response.status : error.response.status >= 500 ? 500 : undefined;
    return status ? i18n.t(`errors.${status}`) : fallback;
  }

  return error instanceof Error ? error.message : fallback;
}

export function getErrorStatus(error: unknown): number | undefined {
  return axios.isAxiosError(error) ? error.response?.status : undefined;
}
