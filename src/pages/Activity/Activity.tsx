import { useMemo, useState } from "react";

import ActivityHeader from "../../components/activity/ActivityHeader";
import ActivityCategoryTabs from "../../components/activity/ActivityCategoryTabs";
import ActivityTimeline from "../../components/activity/ActivityTimeline";
import { activityList, activityCategories } from "../../data/activity.data";

export default function Activity() {
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
      <ActivityHeader search={search} onSearchChange={setSearch} onFilter={() => {}} />

      <ActivityCategoryTabs
        categories={activityCategories}
        value={category}
        onChange={setCategory}
      />

      <ActivityTimeline items={filteredActivity} />
    </section>
  );
}
