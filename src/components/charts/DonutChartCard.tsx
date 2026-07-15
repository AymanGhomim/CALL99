import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import ChartCard from "../dashboard/ChartCard";
import type { ColoredChartDataPoint } from "../../types/dashboard";
import { useTranslation } from "react-i18next";
import useLocale from "../../i18n/useLocale";

interface DonutChartCardProps {
  title: string;
  data: ColoredChartDataPoint[];
  centerLabel?: string;
  innerRadius?: number;
  outerRadius?: number;
  showLegend?: boolean;
  legendClassName?: string;
}

export default function DonutChartCard({
  title,
  data,
  centerLabel,
  innerRadius = 72,
  outerRadius = 98,
  showLegend = true,
  legendClassName = "grid grid-cols-1 gap-x-6 gap-y-3 text-sm text-[#3d3434] sm:grid-cols-2",
}: DonutChartCardProps) {
  const { t } = useTranslation();
  const { formatNumber } = useLocale();
  const total = data.reduce((sum, item) => sum + (item.value || 0), 0);

  return (
    <ChartCard title={title}>
      <div className="relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              startAngle={90}
              endAngle={-270}
              stroke="none"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="pointer-events-none absolute flex flex-col items-center justify-center">
          <span className="text-2xl font-extrabold text-[#1f1a1a]">
            {formatNumber(total)}
          </span>
          <span className="mt-1 text-xs text-[#9c9191]">{centerLabel ?? t("dashboard.charts.totalOrders")}</span>
        </div>
      </div>

      {showLegend && (
        <div className={legendClassName}>
          {data.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-center gap-2"
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: item.color }}
              />
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      )}
    </ChartCard>
  );
}
