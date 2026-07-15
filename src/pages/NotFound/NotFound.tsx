import { ArrowRight, Home, SearchX } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLocale from "../../i18n/useLocale";

export default function NotFound() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { direction } = useLocale();

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fbf7f7] px-4 py-10"
      dir={direction}
    >
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#75262d]/5" />
      <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-[#75262d]/5" />

      <section className="relative w-full max-w-2xl rounded-3xl border border-[#eadede] bg-white px-6 py-12 text-center shadow-[0_18px_50px_rgba(117,38,45,0.08)] sm:px-12 sm:py-16">
        <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#75262d]/10 text-[#75262d]">
          <SearchX size={38} strokeWidth={1.8} aria-hidden="true" />
        </div>

        <p className="text-7xl font-extrabold tracking-tight text-[#75262d] sm:text-8xl">
          404
        </p>
        <h1 className="mt-4 text-2xl font-bold text-[#24191a] sm:text-3xl">
          {t("notFound.title")}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#7b6c6e] sm:text-base">
          {t("notFound.description")}
        </p>

        <div className="mt-9 flex flex-col-reverse justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#dbc9cb] bg-white px-6 text-sm font-semibold text-[#75262d] transition-colors hover:bg-[#fbf7f7]"
          >
            <ArrowRight size={18} aria-hidden="true" className={direction === "ltr" ? "rotate-180" : ""} />
            {t("notFound.goBack")}
          </button>

          <Link
            to="/dashboard"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#75262d] px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#622027]"
          >
            <Home size={18} aria-hidden="true" />
            {t("notFound.goHome")}
          </Link>
        </div>
      </section>
    </main>
  );
}
