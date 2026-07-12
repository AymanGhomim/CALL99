import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import UsersHeader from "../../components/users/UsersHeader";
import UsersFiltersBar from "../../components/users/UsersFiltersBar";
import UsersTable from "../../components/users/UsersTable";
import StatsGrid from "../../components/dashboard/StatsGrid";
import AddEmployeeDialog from "../../components/dialogs/AddEmployeeDialog";
import { ROLE_ID_TO_USER_ROLE_LABEL } from "../../components/dialogs/AddEmployeeDialog/constants";
import { roleOptions, statusOptions, usersList as initialUsersList, usersStats } from "../../data/users.data";

export default function Users() {
  const navigate = useNavigate();
  const [usersList, setUsersList] = useState(initialUsersList);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);

  const filteredUsers = useMemo(() => {
    return usersList.filter((user) => {
      const matchesSearch =
        !search ||
        user.name.includes(search) ||
        user.phone.includes(search);
      const matchesRole = !role || user.role === role;
      return matchesSearch && matchesRole;
    });
  }, [usersList, search, role]);

  const handleAddEmployee = (payload) => {
    const newUser = {
      id: Date.now(),
      name: payload.fullName,
      phone: payload.phone,
      role: ROLE_ID_TO_USER_ROLE_LABEL[payload.role],
      ordersCount: 0,
      createdAt: new Date().toLocaleDateString("ar-EG", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      status: "نشط",
    };

    setUsersList((prev) => [newUser, ...prev]);
    toast.success("تمت إضافة الموظف بنجاح");
  };

  return (
    <section>
      <UsersHeader onAddUser={() => setIsAddEmployeeOpen(true)} />

      <div className="mb-7">
        <StatsGrid stats={usersStats} />
      </div>

      <UsersFiltersBar
        search={search}
        onSearchChange={setSearch}
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
        role={role}
        onRoleChange={setRole}
        roleOptions={roleOptions}
        status={status}
        onStatusChange={setStatus}
        statusOptions={statusOptions}
        onFilter={() => {}}
      />

      <UsersTable
        rows={filteredUsers}
        totalCount={2482}
        currentPage={1}
        totalPages={3}
        onView={(row) =>
          navigate(row.role === "مقدم خدمة" ? `/providers/${row.id}` : `/users/${row.id}`)
        }
      />

      <AddEmployeeDialog
        open={isAddEmployeeOpen}
        onClose={() => setIsAddEmployeeOpen(false)}
        onSubmit={handleAddEmployee}
      />
    </section>
  );
}
