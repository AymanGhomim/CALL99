import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { XCircle } from "lucide-react";

import OrdersHeader from "../../components/orders/OrdersHeader";
import OrdersStats from "../../components/orders/OrdersStats";
import OrdersFiltersBar from "../../components/orders/OrdersFiltersBar";
import OrdersTable from "../../components/orders/OrdersTable";
import OrderViewDialog from "../../components/orders/OrderViewDialog";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

import {
  ordersStats,
  ordersList,
  statusOptions,
  serviceOptions,
  roleOptions,
} from "../../data/orders.data";
import type { OrderRecord } from "../../types/entities";
import { isDateWithinRange } from "../../utils/date";
import { useTranslation } from "react-i18next";

export default function Orders() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<OrderRecord[]>(ordersList);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [status, setStatus] = useState("");
  const [service, setService] = useState("");
  const [role, setRole] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<OrderRecord | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        !search ||
        order.orderNo.toString().includes(search) ||
        order.customerName.includes(search) ||
        order.providerName.includes(search);

      const matchesStatus = !status || order.status === status;
      const matchesService = !service || order.service === service;
      const matchesRole = !role || order.role === role;
      const matchesDate = isDateWithinRange(order.date, dateFrom, dateTo);

      return matchesSearch && matchesStatus && matchesService && matchesRole && matchesDate;
    });
  }, [dateFrom, dateTo, orders, search, status, service, role]);

  const handleView = (row: OrderRecord) => {
    setSelectedOrder(row);
    setViewOpen(true);
  };

  const handleCancel = (order: OrderRecord) => {
    if (order.status === "ملغي") {
      toast(t("orders.alreadyCanceled"));
      return;
    }
    setOrderToCancel(order);
  };

  const confirmCancel = () => {
    if (!orderToCancel) return;
    setOrders((current) => current.map((order) =>
      order.id === orderToCancel.id ? { ...order, status: "ملغي" } : order
    ));
    setOrderToCancel(null);
    toast.success(t("orders.cancelSuccess"));
  };

  return (
    <section>
      <OrdersHeader />

      <OrdersStats stats={ordersStats} />

      <OrdersFiltersBar
        search={search}
        onSearchChange={setSearch}
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
        status={status}
        onStatusChange={setStatus}
        statusOptions={statusOptions}
        service={service}
        onServiceChange={setService}
        serviceOptions={serviceOptions}
        role={role}
        onRoleChange={setRole}
        roleOptions={roleOptions}
        onFilter={() => toast.success(t("orders.filterSuccess"))}
      />

      <OrdersTable
        rows={filteredOrders}
        totalCount={filteredOrders.length}
        currentPage={1}
        totalPages={1}
        onView={handleView}
        onCancel={handleCancel}
      />

      <OrderViewDialog
        open={viewOpen}
        order={selectedOrder}
        onClose={() => {
          setViewOpen(false);
          setSelectedOrder(null);
        }}
      />

      <ConfirmDialog
        open={orderToCancel !== null}
        onClose={() => setOrderToCancel(null)}
        onConfirm={confirmCancel}
        icon={XCircle}
        title={t("orders.cancel")}
        description={t("orders.cancelQuestion", { number: orderToCancel?.orderNo ?? "" })}
        confirmLabel={t("orders.cancel")}
        tone="danger"
      />
    </section>
  );
}
