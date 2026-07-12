import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import AdsHeader from "../../components/ads/AdsHeader";
import AdsStats from "../../components/ads/AdsStats";
import AdsFiltersBar from "../../components/ads/AdsFiltersBar";
import AdsTable from "../../components/ads/AdsTable";
import AdDialog, { AD_DIALOG_MODES } from "../../components/dialogs/AdDialog";
import {
  adsList as initialAdsList,
  adsStats,
  serviceOptions,
  statusOptions,
} from "../../data/ads.data";

let nextAdId = initialAdsList.length + 1;

export default function Ads() {
  const [adsListState, setAdsListState] = useState(initialAdsList);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [dialogState, setDialogState] = useState({
    open: false,
    mode: AD_DIALOG_MODES.VIEW,
    ad: null,
  });

  const filteredAds = useMemo(() => {
    return adsListState.filter((ad) => {
      const matchesSearch = !search || ad.name.includes(search);
      const matchesStatus = !status || ad.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [adsListState, search, status]);

  const closeDialog = () => setDialogState((prev) => ({ ...prev, open: false }));

  const openDialog = (mode, ad = null) => setDialogState({ open: true, mode, ad });

  const handleToggleStatus = (row) => {
    setAdsListState((prev) =>
      prev.map((ad) =>
        ad.id === row.id
          ? { ...ad, status: ad.status === "نشط" ? "غير نشط" : "نشط" }
          : ad,
      ),
    );
    toast.success(row.status === "نشط" ? "تم إيقاف الاعلان" : "تم تفعيل الاعلان");
  };

  const handleCreate = async (payload) => {
    const newAd = {
      id: nextAdId++,
      name: payload.name,
      description: payload.description,
      service: payload.service,
      startDate: payload.startDate,
      endDate: payload.endDate,
      status: payload.status,
    };

    setAdsListState((prev) => [newAd, ...prev]);
    toast.success("تم إنشاء الاعلان بنجاح");
  };

  const handleSave = async (payload) => {
    setAdsListState((prev) =>
      prev.map((ad) =>
        ad.id === payload.id
          ? {
              ...ad,
              name: payload.name,
              description: payload.description,
              service: payload.service,
              startDate: payload.startDate,
              endDate: payload.endDate,
              status: payload.status,
            }
          : ad,
      ),
    );
    toast.success("تم حفظ تعديلات الاعلان");
  };

  return (
    <section>
      <AdsHeader onAddAd={() => openDialog(AD_DIALOG_MODES.CREATE)} />

      <AdsStats stats={adsStats} />

      <AdsFiltersBar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        statusOptions={statusOptions}
        onFilter={() => {}}
      />

      <AdsTable
        rows={filteredAds}
        totalCount={filteredAds.length}
        currentPage={1}
        totalPages={1}
        onView={(row) => openDialog(AD_DIALOG_MODES.VIEW, row)}
        onEdit={(row) => openDialog(AD_DIALOG_MODES.EDIT, row)}
        onToggleStatus={handleToggleStatus}
      />

      <AdDialog
        open={dialogState.open}
        mode={dialogState.mode}
        ad={dialogState.ad}
        serviceOptions={serviceOptions}
        onClose={closeDialog}
        onCreate={handleCreate}
        onSave={handleSave}
      />
    </section>
  );
}
