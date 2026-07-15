import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import TicketsHeader from "../../components/tickets/TicketsHeader";
import TicketsTable from "../../components/tickets/TicketsTable";
import TicketDialog, { type TicketDialogMode } from "../../components/tickets/TicketDialog";
import StatsGrid from "../../components/dashboard/StatsGrid";
import FiltersBar from "../../components/ui/FiltersBar";
import { initialTickets, ticketServiceOptions, ticketsStats, ticketStatusOptions, type TicketRecord } from "../../data/tickets.data";
import { isDateWithinRange } from "../../utils/date";

interface DialogState {
  open: boolean;
  mode: TicketDialogMode;
  ticket: TicketRecord | null;
}

export default function Tickets() {
  const { t } = useTranslation();
  const [tickets, setTickets] = useState<TicketRecord[]>(initialTickets);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [status, setStatus] = useState("");
  const [service, setService] = useState("");
  const [dialog, setDialog] = useState<DialogState>({ open: false, mode: "create", ticket: null });

  const filteredTickets = useMemo(() => tickets.filter((ticket) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || ticket.ticketNo.toLowerCase().includes(query) || ticket.orderNo.toLowerCase().includes(query) || ticket.customer.toLowerCase().includes(query) || ticket.subject.toLowerCase().includes(query);
    return matchesSearch && (!status || ticket.status === status) && (!service || ticket.service === service) && isDateWithinRange(ticket.createdAt, dateFrom, dateTo);
  }), [dateFrom, dateTo, search, service, status, tickets]);

  const openDialog = (mode: TicketDialogMode, ticket: TicketRecord | null = null) => setDialog({ open: true, mode, ticket });
  const closeDialog = () => setDialog((current) => ({ ...current, open: false }));

  const submitTicket = (ticket: TicketRecord) => {
    if (dialog.mode === "create") {
      const id = Math.max(0, ...tickets.map((item) => item.id)) + 1;
      setTickets((current) => [{ ...ticket, id, ticketNo: `#TKT-${String(9420 + id)}`, createdAt: new Date().toLocaleDateString("ar-EG", { day: "numeric", month: "long", year: "numeric" }) }, ...current]);
      toast.success(t("messages.ticketCreated"));
    } else {
      setTickets((current) => current.map((item) => item.id === ticket.id ? ticket : item));
      toast.success(t("messages.ticketUpdated"));
    }
    closeDialog();
  };

  return (
    <section>
      <TicketsHeader onAdd={() => openDialog("create")} />
      <div className="mb-7"><StatsGrid stats={ticketsStats} /></div>

      <FiltersBar
        search={{ value: search, onChange: setSearch, placeholder: t("filters.searchTicket") }}
        fields={[
          { key: "from", type: "date", value: dateFrom, onChange: setDateFrom },
          { key: "to", type: "date", value: dateTo, onChange: setDateTo },
          { key: "status", type: "select", value: status, onChange: setStatus, placeholder: t("filters.selectStatus"), options: ticketStatusOptions },
          { key: "service", type: "select", value: service, onChange: setService, placeholder: t("filters.serviceType"), options: ticketServiceOptions },
        ]}
        onFilter={() => toast.success(t("messages.ticketsFiltered"))}
      />

      <TicketsTable rows={filteredTickets} onView={(ticket) => openDialog("view", ticket)} onEdit={(ticket) => openDialog("edit", ticket)} />
      <TicketDialog open={dialog.open} mode={dialog.mode} ticket={dialog.ticket} statusOptions={ticketStatusOptions} serviceOptions={ticketServiceOptions} onClose={closeDialog} onSubmit={submitTicket} />
    </section>
  );
}
