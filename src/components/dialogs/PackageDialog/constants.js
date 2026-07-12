// Shared constants for the Package dialog (create / edit / view all reuse
// the same form shape, mirroring the pattern used by AddEmployeeDialog).

export const PACKAGE_DIALOG_MODES = {
  CREATE: "create",
  EDIT: "edit",
  VIEW: "view",
};

export const DURATION_UNIT_OPTIONS = ["شهور", "سنه", "غير محدود"];

export const DESCRIPTION_MAX_LENGTH = 160;

export const EMPTY_PACKAGE_FORM = {
  name: "",
  description: "",
  servicesCount: 1,
  videosCount: 1,
  imagesCount: 1,
  hasBanner: true,
  durationValue: 3,
  durationUnit: DURATION_UNIT_OPTIONS[0],
  priceValue: 150,
  isActive: true,
  isDefault: false,
};

// Maps a package row (as shaped in data/packages.data.jsx) to the flat form
// state the dialog edits. Falls back to EMPTY_PACKAGE_FORM for any missing
// field so opening the dialog on partial/mock data never crashes.
export function buildFormFromPackage(pkg) {
  if (!pkg) {
    return EMPTY_PACKAGE_FORM;
  }

  return {
    name: pkg.name ?? EMPTY_PACKAGE_FORM.name,
    description: pkg.description ?? EMPTY_PACKAGE_FORM.description,
    servicesCount: pkg.servicesCount ?? EMPTY_PACKAGE_FORM.servicesCount,
    videosCount: pkg.videosCount ?? EMPTY_PACKAGE_FORM.videosCount,
    imagesCount: pkg.imagesCount ?? EMPTY_PACKAGE_FORM.imagesCount,
    hasBanner: pkg.hasBanner ?? EMPTY_PACKAGE_FORM.hasBanner,
    durationValue: pkg.durationValue ?? EMPTY_PACKAGE_FORM.durationValue,
    durationUnit: pkg.durationUnit ?? EMPTY_PACKAGE_FORM.durationUnit,
    priceValue: pkg.priceValue ?? EMPTY_PACKAGE_FORM.priceValue,
    isActive: pkg.status ? pkg.status === "نشط" : EMPTY_PACKAGE_FORM.isActive,
    isDefault: pkg.isDefault ?? EMPTY_PACKAGE_FORM.isDefault,
  };
}
