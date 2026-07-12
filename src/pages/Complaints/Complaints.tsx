import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import ComplaintsHeader from "../../components/complaints/ComplaintsHeader";
import ComplaintsTable, { type Complaint } from "../../components/complaints/ComplaintsTable";
import StatsGrid from "../../components/dashboard/StatsGrid";
import FiltersBar from "../../components/ui/FiltersBar";
import {
  complaintStatusOptions,
  complaintsStats,
  initialComplaints,
} from "../../data/complaints.data";

export default function Complaints() {
  const [complaints] = useState<Complaint[]>(initialComplaints);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const filteredComplaints = useMemo(
    () =>
      complaints.filter((complaint) => {
        const query = search.trim().toLowerCase();
        const matchesSearch =
          !query ||
          complaint.ticketNo.toLowerCase().includes(query) ||
          complaint.orderNo.toLowerCase().includes(query) ||
          complaint.customer.toLowerCase().includes(query) ||
          complaint.type.toLowerCase().includes(query);
        const matchesStatus = !status || complaint.status === status;
        return matchesSearch && matchesStatus;
      }),
    [complaints, search, status],
  );

  return (
    <section>
      <ComplaintsHeader onAdd={() => toast("سيتم فتح نموذج تقديم شكوى جديدة")} />

      <div className="mb-7">
        <StatsGrid stats={complaintsStats} />
      </div>

      <FiltersBar
        search={{
          value: search,
          onChange: setSearch,
          placeholder: "ابحث برقم التذكرة أو اسم العميل أو رقم الطلب",
        }}
        fields={[
          {
            key: "status",
            type: "select",
            value: status,
            onChange: setStatus,
            placeholder: "كل الحالات",
            options: complaintStatusOptions,
          },
        ]}
      />

      <ComplaintsTable
        rows={filteredComplaints}
        onView={() => toast("عرض تفاصيل الشكوى")}
        onEdit={() => toast("تعديل حالة الشكوى")}
      />
    </section>
  );
}
