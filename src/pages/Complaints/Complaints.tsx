import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import ComplaintDialog, { type ComplaintDialogMode } from "../../components/complaints/ComplaintDialog";
import ComplaintsHeader from "../../components/complaints/ComplaintsHeader";
import ComplaintsTable, { type Complaint } from "../../components/complaints/ComplaintsTable";
import StatsGrid from "../../components/dashboard/StatsGrid";
import FiltersBar from "../../components/ui/FiltersBar";
import { complaintStatusOptions, complaintsStats, initialComplaints } from "../../data/complaints.data";

export default function Complaints() {
  const { t } = useTranslation();
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [dialog, setDialog] = useState<{ open: boolean; mode: ComplaintDialogMode; complaint: Complaint | null }>({ open: false, mode: "create", complaint: null });

  const filteredComplaints = useMemo(() => complaints.filter((complaint) => {
    const query = search.trim().toLowerCase();
    return (!query || complaint.ticketNo.toLowerCase().includes(query) || complaint.orderNo.toLowerCase().includes(query) || complaint.customer.toLowerCase().includes(query) || complaint.type.toLowerCase().includes(query)) && (!status || complaint.status === status);
  }), [complaints, search, status]);

  const openDialog = (mode: ComplaintDialogMode, complaint: Complaint | null = null) => setDialog({ open: true, mode, complaint });
  const closeDialog = () => setDialog((current) => ({ ...current, open: false }));

  const submitComplaint = (complaint: Complaint) => {
    if (dialog.mode === "create") {
      setComplaints((current) => {
        const id = Math.max(0, ...current.map((item) => item.id)) + 1;
        return [{ ...complaint, id, ticketNo: `#CMP-${String(id).padStart(4, "0")}`, date: "13 يوليو 2026", status: "قيد المراجعة" }, ...current];
      });
      toast.success(t("messages.complaintCreated"));
    } else {
      setComplaints((current) => current.map((item) => item.id === complaint.id ? complaint : item));
      toast.success(t("messages.complaintUpdated"));
    }
    closeDialog();
  };

  return (
    <section>
      <ComplaintsHeader onAdd={() => openDialog("create")} />
      <div className="mb-7"><StatsGrid stats={complaintsStats} /></div>
      <FiltersBar search={{ value: search, onChange: setSearch, placeholder: t("filters.searchComplaint") }} fields={[
        { key: "status", type: "select", value: status, onChange: setStatus, placeholder: t("filters.allStatuses"), options: complaintStatusOptions },
      ]} />
      <ComplaintsTable rows={filteredComplaints} onView={(complaint) => openDialog("view", complaint)} onEdit={(complaint) => openDialog("edit", complaint)} />
      <ComplaintDialog open={dialog.open} mode={dialog.mode} complaint={dialog.complaint} onClose={closeDialog} onSubmit={submitComplaint} />
    </section>
  );
}
