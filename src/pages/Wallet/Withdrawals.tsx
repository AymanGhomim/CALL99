import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatsGrid from "../../components/dashboard/StatsGrid";
import FiltersBar from "../../components/ui/FiltersBar";
import WithdrawalsHeader from "../../components/wallet/WithdrawalsHeader";
import WithdrawalsTable, { type Withdrawal } from "../../components/wallet/WithdrawalsTable";
import { withdrawalServiceOptions, withdrawalsList, withdrawalsStats } from "../../data/withdrawals.data";

export default function Withdrawals() {
  const navigate = useNavigate();
  const [requests] = useState<Withdrawal[]>(withdrawalsList);
  const [search, setSearch] = useState("");
  const [service, setService] = useState("");

  const filteredRequests = useMemo(
    () => requests.filter((request) => {
      const query = search.trim().toLowerCase();
      const matchesSearch = !query || request.requestNo.toLowerCase().includes(query) || request.provider.toLowerCase().includes(query);
      const matchesService = !service || request.service === service;
      return matchesSearch && matchesService;
    }),
    [requests, search, service],
  );

  return (
    <section>
      <WithdrawalsHeader />
      <div className="mb-7"><StatsGrid stats={withdrawalsStats} /></div>
      <FiltersBar
        search={{ value: search, onChange: setSearch, placeholder: "ابحث برقم الطلب أو اسم مقدم الخدمة" }}
        fields={[{ key: "service", type: "select", value: service, onChange: setService, placeholder: "نوع الخدمة", options: withdrawalServiceOptions }]}
      />
      <WithdrawalsTable rows={filteredRequests} onView={(request) => navigate(`/wallet/withdrawals/${request.id}`)} />
    </section>
  );
}
