import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import PackagesHeader from "../../components/packages/PackagesHeader";
import PackagesFiltersBar from "../../components/packages/PackagesFiltersBar";
import PackagesTable from "../../components/packages/PackagesTable";
import StatsGrid from "../../components/dashboard/StatsGrid";
import PackageDialog, {
  PACKAGE_DIALOG_MODES,
} from "../../components/dialogs/PackageDialog";
import {
  packagesList as initialPackagesList,
  packagesStats,
  serviceTypeOptions,
  statusOptions,
} from "../../data/packages.data";

let nextPackageId = initialPackagesList.length + 1;

export default function Packages() {
  const [packagesList, setPackagesList] = useState(initialPackagesList);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [service, setService] = useState("");

  const [dialogState, setDialogState] = useState({
    open: false,
    mode: PACKAGE_DIALOG_MODES.VIEW,
    package: null,
  });

  const filteredPackages = useMemo(() => {
    return packagesList.filter((pkg) => {
      const matchesSearch = !search || pkg.name.includes(search);
      const matchesStatus = !status || pkg.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [packagesList, search, status]);

  const closeDialog = () => setDialogState((prev) => ({ ...prev, open: false }));

  const openDialog = (mode, pkg = null) =>
    setDialogState({ open: true, mode, package: pkg });

  const handleToggleStatus = (row) => {
    setPackagesList((prev) =>
      prev.map((pkg) =>
        pkg.id === row.id
          ? { ...pkg, status: pkg.status === "نشط" ? "غير نشط" : "نشط" }
          : pkg,
      ),
    );
    toast.success(row.status === "نشط" ? "تم إيقاف الباقه" : "تم تفعيل الباقه");
  };

  const buildDurationLabel = (value, unit) =>
    unit === "غير محدود" ? "غير محدود" : `${value} ${unit}`;

  const buildPriceLabel = (value) => (value > 0 ? `${value} ريال` : "مجاني");

  const buildMediaLabel = (images, videos) =>
    videos > 0 ? `${images} صوره + ${videos}فيديو` : `${images} صور`;

  const handleCreate = async (payload) => {
    const newPackage = {
      id: nextPackageId++,
      code: `PKG-${new Date().getFullYear()}-${String(nextPackageId).padStart(3, "0")}`,
      name: payload.name,
      description: payload.description,
      servicesCount: payload.servicesCount,
      imagesCount: payload.imagesCount,
      videosCount: payload.videosCount,
      duration: buildDurationLabel(payload.durationValue, payload.durationUnit),
      durationValue: payload.durationValue,
      durationUnit: payload.durationUnit,
      price: buildPriceLabel(payload.priceValue),
      priceValue: payload.priceValue,
      media: buildMediaLabel(payload.imagesCount, payload.videosCount),
      hasBanner: payload.hasBanner,
      status: payload.status,
      isDefault: false,
    };

    setPackagesList((prev) => [newPackage, ...prev]);
    toast.success("تم إنشاء الباقه بنجاح");
  };

  const handleSave = async (payload) => {
    setPackagesList((prev) =>
      prev.map((pkg) =>
        pkg.id === payload.id
          ? {
              ...pkg,
              name: payload.name,
              description: payload.description,
              servicesCount: payload.servicesCount,
              imagesCount: payload.imagesCount,
              videosCount: payload.videosCount,
              duration: buildDurationLabel(payload.durationValue, payload.durationUnit),
              durationValue: payload.durationValue,
              durationUnit: payload.durationUnit,
              price: buildPriceLabel(payload.priceValue),
              priceValue: payload.priceValue,
              media: buildMediaLabel(payload.imagesCount, payload.videosCount),
              hasBanner: payload.hasBanner,
              status: payload.status,
            }
          : pkg,
      ),
    );
    toast.success("تم حفظ تعديلات الباقه");
  };

  const handleSetDefault = async (pkg) => {
    setPackagesList((prev) =>
      prev.map((item) => ({ ...item, isDefault: item.id === pkg.id })),
    );
    toast.success("تم تعيين الباقه كافتراضيه");
  };

  return (
    <section>
      <PackagesHeader onAddPackage={() => openDialog(PACKAGE_DIALOG_MODES.CREATE)} />

      <div className="mb-7">
        <StatsGrid stats={packagesStats} />
      </div>

      <PackagesFiltersBar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        statusOptions={statusOptions}
        service={service}
        onServiceChange={setService}
        serviceOptions={serviceTypeOptions}
        onFilter={() => {}}
      />

      <PackagesTable
        rows={filteredPackages}
        totalCount={filteredPackages.length}
        currentPage={1}
        totalPages={1}
        onView={(row) => openDialog(PACKAGE_DIALOG_MODES.VIEW, row)}
        onEdit={(row) => openDialog(PACKAGE_DIALOG_MODES.EDIT, row)}
        onToggleStatus={handleToggleStatus}
      />

      <PackageDialog
        open={dialogState.open}
        mode={dialogState.mode}
        package={dialogState.package}
        onClose={closeDialog}
        onCreate={handleCreate}
        onSave={handleSave}
        onSetDefault={handleSetDefault}
      />
    </section>
  );
}
