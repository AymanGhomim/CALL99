import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProvidersHeader from "../../components/providers/ProvidersHeader";
import ProvidersStatsSection from "../../components/providers/ProvidersStatsSection";
import ProvidersFiltersPanel from "../../components/providers/ProvidersFiltersPanel";
import ProvidersRequestsTable from "../../components/providers/ProvidersRequestsTable";
import {
  pendingProviderRequests,
  providerRequestsStats,
  providerTypeOptions,
  requestStatusOptions,
} from "../../data/providers.data";

export default function Providers() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [providerType, setProviderType] = useState("");
  const [status, setStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filteredRows = useMemo(() => {
    return pendingProviderRequests.filter((row) => {
      const matchesSearch =
        !search ||
        row.orderNo.includes(search) ||
        row.providerName.includes(search) ||
        row.phone.includes(search);
      const matchesType = !providerType || row.serviceType === providerType;
      const matchesStatus = !status || row.status === status;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [search, providerType, status]);

  return (
    <section>
      <ProvidersHeader />

      <ProvidersStatsSection stats={providerRequestsStats} />

      <ProvidersFiltersPanel
        search={search}
        onSearchChange={setSearch}
        providerType={providerType}
        onProviderTypeChange={setProviderType}
        providerTypeOptions={providerTypeOptions}
        status={status}
        onStatusChange={setStatus}
        statusOptions={requestStatusOptions}
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
        onFilter={() => {}}
      />

      <ProvidersRequestsTable
        rows={filteredRows}
        totalCount={2482}
        currentPage={1}
        totalPages={3}
        onView={(row) => navigate(`/providers/${row.id}`)}
      />
    </section>
  );
}
