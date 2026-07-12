import { useMemo, useState } from "react";

import OrdersHeader from "../../components/orders/OrdersHeader";
import OrdersStats from "../../components/orders/OrdersStats";
import OrdersFiltersBar from "../../components/orders/OrdersFiltersBar";
import OrdersTable from "../../components/orders/OrdersTable";
import OrderViewDialog from "../../components/orders/OrderViewDialog";

import {
  ordersStats,
  ordersList,
  statusOptions,
  serviceOptions,
  roleOptions,
} from "../../data/orders.data";

export default function Orders() {
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [status, setStatus] = useState("");
  const [service, setService] = useState("");
  const [role, setRole] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);

  const filteredOrders = useMemo(() => {
    return ordersList.filter((order) => {
      const matchesSearch =
        !search ||
        order.orderNo.toString().includes(search) ||
        order.customerName.includes(search) ||
        order.providerName.includes(search);

      const matchesStatus = !status || order.status === status;
      const matchesService = !service || order.service === service;
      const matchesRole = !role || order.role === role;

      return matchesSearch && matchesStatus && matchesService && matchesRole;
    });
  }, [search, status, service, role]);

  const handleView = (row) => {
    setSelectedOrder(row);
    setViewOpen(true);
  };

  const handleCancel = (row) => {
    // هيتم استبدالها لاحقًا بديالوج أو API
    console.log("Cancel Order:", row);
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
        onFilter={() => {}}
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
    </section>
  );
}
