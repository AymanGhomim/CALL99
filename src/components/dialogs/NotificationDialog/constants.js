// Shared constants for the Notification dialog (create / edit / view all
// reuse the same form shape, mirroring the pattern used by AdDialog).

export const NOTIFICATION_DIALOG_MODES = {
  CREATE: "create",
  EDIT: "edit",
  VIEW: "view",
};

export const EMPTY_NOTIFICATION_FORM = {
  title: "",
  description: "",
  audience: "",
  time: "",
  isActive: true,
};

// Maps a notification row (as shaped in data/notifications.data.jsx) to the
// flat form state the dialog edits. Falls back to EMPTY_NOTIFICATION_FORM
// for any missing field so opening the dialog on partial/mock data never crashes.
export function buildFormFromNotification(notification) {
  if (!notification) {
    return EMPTY_NOTIFICATION_FORM;
  }

  return {
    title: notification.title ?? EMPTY_NOTIFICATION_FORM.title,
    description: notification.description ?? EMPTY_NOTIFICATION_FORM.description,
    audience: notification.audience ?? EMPTY_NOTIFICATION_FORM.audience,
    time: notification.time ?? EMPTY_NOTIFICATION_FORM.time,
    isActive: notification.status ? notification.status === "نشط" : EMPTY_NOTIFICATION_FORM.isActive,
  };
}
