import FiltersBar from "../ui/FiltersBar";
import { useTranslation } from "react-i18next";

interface NotificationsFiltersBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  statusOptions?: string[];
  channel: string;
  onChannelChange: (value: string) => void;
  channelOptions?: string[];
  audience: string;
  onAudienceChange: (value: string) => void;
  audienceOptions?: string[];
  onFilter: () => void;
}

export default function NotificationsFiltersBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  statusOptions = [],
  channel,
  onChannelChange,
  channelOptions = [],
  audience,
  onAudienceChange,
  audienceOptions = [],
  onFilter,
}: NotificationsFiltersBarProps) {
  const { t } = useTranslation();
  return (
    <FiltersBar
      search={{
        value: search,
        onChange: onSearchChange,
        placeholder: t("filters.searchTitle"),
      }}
      fields={[
        {
          key: "audience",
          type: "select",
          placeholder: t("notifications.targetAudience"),
          value: audience,
          onChange: onAudienceChange,
          options: audienceOptions,
        },
        {
          key: "channel",
          type: "select",
          placeholder: t("notifications.channel"),
          value: channel,
          onChange: onChannelChange,
          options: channelOptions,
        },
        {
          key: "status",
          type: "select",
          placeholder: t("filters.allStatuses"),
          value: status,
          onChange: onStatusChange,
          options: statusOptions,
        },
      ]}
      onFilter={onFilter}
    />
  );
}
