import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartCard from "../dashboard/ChartCard";
import type { ChartDataPoint } from "../../types/dashboard";

export default function LineChartCard({ title, data, lineColor }: { title: string; data: ChartDataPoint[]; lineColor: string }) {
  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height={230}>
        <LineChart data={data}>
          <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke={lineColor}
            strokeWidth={2}
            dot={{ r: 4, fill: lineColor }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
