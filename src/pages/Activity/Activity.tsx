import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import ActivityHeader from "../../components/activity/ActivityHeader";
import ActivityCategoryTabs from "../../components/activity/ActivityCategoryTabs";
import ActivityTimeline from "../../components/activity/ActivityTimeline";
import { activityList, activityCategories } from "../../data/activity.data";
import { useTranslation } from "react-i18next";

const categoryTranslationKeys = [
  "activity.categories.all", "activity.categories.orders", "activity.categories.payments",
  "activity.categories.users", "activity.categories.system",
] as const;

export default function Activity() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const filteredActivity = useMemo(() => {
    return activityList.filter((activity) => {
      const matchesSearch =
        !search ||
        activity.title.includes(search) ||
        activity.description.includes(search);
      const matchesCategory = !category || activity.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  return (
    <section>
      <ActivityHeader search={search} onSearchChange={setSearch} onFilter={() => toast.success(t("activity.filterSuccess"))} />

      <ActivityCategoryTabs
        categories={activityCategories.map((item, index) => ({
          ...item,
          label: t(categoryTranslationKeys[index] ?? "activity.categories.all"),
        }))}
        value={category}
        onChange={setCategory}
      />

      <ActivityTimeline items={filteredActivity} />
    </section>
  );
}
