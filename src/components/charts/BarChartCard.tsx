import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartCard from "../dashboard/ChartCard";
import type { ChartDataPoint } from "../../types/dashboard";

export default function BarChartCard({ title, data, barColor }: { title: string; data: ChartDataPoint[]; barColor: string }) {
  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip />
          <Bar dataKey="value" radius={[8, 8, 0, 0]} fill={barColor} barSize={56} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
