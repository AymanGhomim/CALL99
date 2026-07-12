import { Headphones, Shield, Users } from "lucide-react";

// Employee role identifiers used across the dialog + submitted payload.
export const EMPLOYEE_ROLES = {
  CUSTOMER_SERVICE: "customer-service",
  FIELD_TEAM: "field-team",
  MANAGER: "manager",
};

// Order here drives the visual order of the segmented Role selector.
// (First item renders on the right edge under RTL, matching the design.)
export const ROLE_OPTIONS = [
  {
    id: EMPLOYEE_ROLES.CUSTOMER_SERVICE,
    label: "خدمة العملاء",
    icon: Headphones,
    dialogTitle: "إضافة خدمة عملاء جديد",
  },
  {
    id: EMPLOYEE_ROLES.FIELD_TEAM,
    label: "الفريق الميداني",
    icon: Users,
    dialogTitle: "إضافة عضو فريق ميداني جديد",
  },
  {
    id: EMPLOYEE_ROLES.MANAGER,
    label: "مدير",
    icon: Shield,
    dialogTitle: "إضافة مدير جديد",
  },
];

export const DEFAULT_ROLE = EMPLOYEE_ROLES.CUSTOMER_SERVICE;

// Only Saudi Arabia is supported today, kept as a list so more countries
// can be appended later without touching the form markup.
export const COUNTRY_CODES = [{ code: "966", flag: "🇸🇦" }];

export const DEFAULT_COUNTRY_CODE = COUNTRY_CODES[0].code;

// Maps a dialog role id to the exact role label used in the Users table /
// USER_ROLE_TONE map (constants/statusTones.js), so a newly-added employee
// shows up with a badge that matches the rest of the app.
export const ROLE_ID_TO_USER_ROLE_LABEL = {
  [EMPLOYEE_ROLES.CUSTOMER_SERVICE]: "خدمة عملاء",
  [EMPLOYEE_ROLES.FIELD_TEAM]: "فريق ميداني",
  [EMPLOYEE_ROLES.MANAGER]: "مدير",
};

export const EMPTY_EMPLOYEE_FORM = {
  fullName: "",
  phone: "",
  countryCode: DEFAULT_COUNTRY_CODE,
  password: "",
};
