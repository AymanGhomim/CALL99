import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import NotificationsHeader from "../../components/notifications/NotificationsHeader";
import NotificationsStats from "../../components/notifications/NotificationsStats";
import NotificationsFiltersBar from "../../components/notifications/NotificationsFiltersBar";
import NotificationsTable from "../../components/notifications/NotificationsTable";
import NotificationDialog, {
  NOTIFICATION_DIALOG_MODES,
} from "../../components/dialogs/NotificationDialog";
import {
  notificationsList as initialNotificationsList,
  notificationsStats,
  statusOptions,
} from "../../data/notifications.data";

let nextNotificationId = initialNotificationsList.length + 1;

export default function Notifications() {
  const [notificationsListState, setNotificationsListState] = useState(initialNotificationsList);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [dialogState, setDialogState] = useState({
    open: false,
    mode: NOTIFICATION_DIALOG_MODES.VIEW,
    notification: null,
  });

  const filteredNotifications = useMemo(() => {
    return notificationsListState.filter((notification) => {
      const matchesSearch = !search || notification.title.includes(search);
      const matchesStatus = !status || notification.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [notificationsListState, search, status]);

  const closeDialog = () => setDialogState((prev) => ({ ...prev, open: false }));

  const openDialog = (mode, notification = null) =>
    setDialogState({ open: true, mode, notification });

  const handleToggleStatus = (row) => {
    setNotificationsListState((prev) =>
      prev.map((notification) =>
        notification.id === row.id
          ? { ...notification, status: notification.status === "نشط" ? "متوقف" : "نشط" }
          : notification,
      ),
    );
    toast.success(row.status === "نشط" ? "تم إيقاف الإشعار" : "تم تفعيل الإشعار");
  };

  const handleResend = (row) => {
    toast.success(`تم جدولة إعادة إرسال "${row.title}"`);
  };

  const handleCreate = async (payload) => {
    const newNotification = {
      id: nextNotificationId++,
      title: payload.title,
      description: payload.description,
      audience: payload.audience,
      time: payload.time,
      status: payload.status,
      recipients: 0,
      channel: payload.channel,
      deliveryStatus: payload.sendTimeMode === "now" ? "تم الإرسال بنجاح" : "قيد الجدولة",
      sendTimeMode: payload.sendTimeMode,
      sendDate: payload.sendDate,
      sendTime: payload.sendTime,
      recurrence: payload.recurrence,
      recurrenceInterval: payload.recurrenceInterval,
      recurrenceUnit: payload.recurrenceUnit,
      recurrenceEndMode: payload.recurrenceEndMode,
      recurrenceEndCount: payload.recurrenceEndCount,
      recurrenceEndDate: payload.recurrenceEndDate,
    };

    setNotificationsListState((prev) => [newNotification, ...prev]);
    toast.success("تم إنشاء الإشعار بنجاح");
  };

  const handleSave = async (payload) => {
    setNotificationsListState((prev) =>
      prev.map((notification) =>
        notification.id === payload.id
          ? {
              ...notification,
              title: payload.title,
              description: payload.description,
              audience: payload.audience,
              time: payload.time,
              status: payload.status,
              channel: payload.channel,
              sendTimeMode: payload.sendTimeMode,
              sendDate: payload.sendDate,
              sendTime: payload.sendTime,
              recurrence: payload.recurrence,
              recurrenceInterval: payload.recurrenceInterval,
              recurrenceUnit: payload.recurrenceUnit,
              recurrenceEndMode: payload.recurrenceEndMode,
              recurrenceEndCount: payload.recurrenceEndCount,
              recurrenceEndDate: payload.recurrenceEndDate,
            }
          : notification,
      ),
    );
    toast.success("تم حفظ تعديلات الإشعار");
  };

  return (
    <section>
      <NotificationsHeader onAddNotification={() => openDialog(NOTIFICATION_DIALOG_MODES.CREATE)} />

      <NotificationsStats stats={notificationsStats} />

      <NotificationsFiltersBar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        statusOptions={statusOptions}
        onFilter={() => {}}
      />

      <NotificationsTable
        rows={filteredNotifications}
        totalCount={filteredNotifications.length}
        currentPage={1}
        totalPages={1}
        onView={(row) => openDialog(NOTIFICATION_DIALOG_MODES.VIEW, row)}
        onEdit={(row) => openDialog(NOTIFICATION_DIALOG_MODES.EDIT, row)}
        onToggleStatus={handleToggleStatus}
        onResend={handleResend}
      />

      <NotificationDialog
        open={dialogState.open}
        mode={dialogState.mode}
        notification={dialogState.notification}
        onClose={closeDialog}
        onCreate={handleCreate}
        onSave={handleSave}
      />
    </section>
  );
}
