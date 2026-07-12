import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import ChartCard from "./ChartCard";

export default function StatusDistributionCard({ data }) {
  return (
    <ChartCard title="توزيع الطلبات حسب الحالة">
      <div className="flex items-center justify-between gap-4">
        <ul className="space-y-2 text-xs font-medium">
          {data.map((item) => (
            <li key={item.name} className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: item.color }} />
              <span>{item.name}</span>
            </li>
          ))}
        </ul>

        <ResponsiveContainer width="55%" height={190}>
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={55} outerRadius={78} startAngle={90} endAngle={-270}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
