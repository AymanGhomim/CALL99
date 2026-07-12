// Shared constants for the Ad dialog (create / edit / view all reuse the
// same form shape, mirroring the pattern used by PackageDialog).

export const AD_DIALOG_MODES = {
  CREATE: "create",
  EDIT: "edit",
  VIEW: "view",
};

export const EMPTY_AD_FORM = {
  name: "",
  description: "",
  service: "",
  startDate: "",
  endDate: "",
  isActive: true,
};

// Maps an ad row (as shaped in data/ads.data.jsx) to the flat form state
// the dialog edits. Falls back to EMPTY_AD_FORM for any missing field so
// opening the dialog on partial/mock data never crashes.
export function buildFormFromAd(ad) {
  if (!ad) {
    return EMPTY_AD_FORM;
  }

  return {
    name: ad.name ?? EMPTY_AD_FORM.name,
    description: ad.description ?? EMPTY_AD_FORM.description,
    service: ad.service ?? EMPTY_AD_FORM.service,
    startDate: ad.startDate ?? EMPTY_AD_FORM.startDate,
    endDate: ad.endDate ?? EMPTY_AD_FORM.endDate,
    isActive: ad.status ? ad.status === "نشط" : EMPTY_AD_FORM.isActive,
  };
}
