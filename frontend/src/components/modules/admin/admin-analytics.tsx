"use client";

import type { ComponentType } from "react";
import { useMemo } from "react";
import { BarChart3, PieChart, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ChartPoint = {
  month: Date | string;
  count: number;
};

type PiePoint = {
  status: string;
  count: number;
};

type AdminAnalyticsProps = {
  barChartData?: ChartPoint[];
  pieChartData?: PiePoint[];
};

const palette = ["#2563eb", "#7c3aed", "#0f766e", "#ea580c", "#dc2626", "#0891b2", "#4f46e5", "#65a30d"];

const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

const describeArc = (
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number
) => {
  const start = polarToCartesian(centerX, centerY, radius, endAngle);
  const end = polarToCartesian(centerX, centerY, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return ["M", centerX, centerY, "L", start.x, start.y, "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y, "Z"].join(" ");
};

const formatLabel = (value: Date | string) => {
  if (value instanceof Date) {
    return new Intl.DateTimeFormat(undefined, { month: "short", year: "numeric" }).format(value);
  }

  const date = new Date(value);
  if (!Number.isNaN(date.getTime()) && /\d{4}/.test(String(value))) {
    return new Intl.DateTimeFormat(undefined, { month: "short", year: "numeric" }).format(date);
  }

  return String(value);
};

const buildLinePath = (points: ChartPoint[]) => {
  const width = 100;
  const height = 40;
  const padding = 4;
  const maxCount = Math.max(...points.map((point) => point.count), 1);
  const step = points.length > 1 ? (width - padding * 2) / (points.length - 1) : 0;

  return points
    .map((point, index) => {
      const x = padding + index * step;
      const y = height - padding - ((height - padding * 2) * point.count) / maxCount;
      return `${index === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");
};

function ChartShell({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-border/60 bg-card/95 shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function BarChartView({ data }: { data: ChartPoint[] }) {
  const maxCount = Math.max(...data.map((point) => point.count), 1);

  if (!data.length) {
    return <EmptyChart message="No monthly activity data is available yet." />;
  }

  return (
    <div className="space-y-4">
      {data.map((point) => {
        const width = Math.max((point.count / maxCount) * 100, 6);

        return (
          <div key={`${point.month}-${point.count}`} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{formatLabel(point.month)}</span>
              <span className="text-muted-foreground">{point.count}</span>
            </div>
            <svg viewBox="0 0 100 10" className="h-3 w-full overflow-hidden rounded-full bg-muted">
              <rect x="0" y="2" width="100" height="6" rx="3" fill="hsl(var(--muted))" />
              <rect x="0" y="2" width={width} height="6" rx="3" fill="#2563eb" />
            </svg>
          </div>
        );
      })}
    </div>
  );
}

function LineChartView({ data }: { data: ChartPoint[] }) {
  const path = buildLinePath(data);
  const maxCount = Math.max(...data.map((point) => point.count), 1);

  if (!data.length) {
    return <EmptyChart message="No trend data is available yet." />;
  }

  return (
    <div className="space-y-4">
      <svg viewBox="0 0 100 40" className="h-52 w-full overflow-visible">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${path} L 96,36 L 4,36 Z`} fill="url(#lineGradient)" />
        <path d={path} fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
        {data.map((point, index) => {
          const x = data.length > 1 ? 4 + index * ((100 - 8) / (data.length - 1)) : 50;
          const y = 40 - 4 - ((40 - 8) * point.count) / maxCount;

          return <circle key={`${point.month}-${index}`} cx={x} cy={y} r="1.8" fill="#2563eb" />;
        })}
      </svg>

      <div className="grid gap-2 sm:grid-cols-2">
        {data.map((point) => (
          <div key={`${point.month}-${point.count}`} className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
            <span className="font-medium">{formatLabel(point.month)}</span>
            <span className="text-muted-foreground">{point.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PieChartView({ data }: { data: PiePoint[] }) {
  const total = data.reduce((sum, point) => sum + point.count, 0);
  const segments = useMemo(() => {
    return data.reduce<
      Array<{
        status: string;
        count: number;
        percentage: number;
        color: string;
        start: number;
        end: number;
      }>
    >((accumulator, point, index) => {
      const previousEnd = accumulator.at(-1)?.end ?? 0;
      const percentage = total > 0 ? (point.count / total) * 100 : 0;

      accumulator.push({
        ...point,
        percentage,
        color: palette[index % palette.length],
        start: previousEnd,
        end: previousEnd + percentage,
      });

      return accumulator;
    }, []);
  }, [data, total]);

  if (!data.length) {
    return <EmptyChart message="No status breakdown is available yet." />;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[220px_minmax(0,1fr)] xl:items-center">
      <div className="relative mx-auto flex h-52 w-52 items-center justify-center rounded-full border bg-background/80 p-5 shadow-inner">
        <svg viewBox="0 0 100 100" className="absolute inset-5 h-auto w-auto">
          {segments.map((segment) => {
            const path = describeArc(50, 50, 45, segment.start * 3.6, segment.end * 3.6);
            return <path key={segment.status} d={path} fill={segment.color} />;
          })}
        </svg>
        <div className="relative z-10 flex h-24 w-24 flex-col items-center justify-center rounded-full border bg-background text-center shadow-sm">
          <span className="text-2xl font-semibold">{total}</span>
          <span className="text-xs text-muted-foreground">Total</span>
        </div>
      </div>

      <div className="space-y-3">
        {segments.map((segment) => (
          <div key={segment.status} className="flex items-center justify-between gap-3 rounded-xl border px-3 py-2">
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 12 12" className="h-3.5 w-3.5">
                <circle cx="6" cy="6" r="6" fill={segment.color} />
              </svg>
              <div>
                <div className="font-medium">{segment.status}</div>
                <div className="text-xs text-muted-foreground">{segment.count} records</div>
              </div>
            </div>
            <Badge variant="secondary">{segment.percentage.toFixed(0)}%</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex min-h-52 items-center justify-center rounded-xl border border-dashed bg-muted/20 px-6 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}

export default function AdminAnalyticsCharts({ barChartData = [], pieChartData = [] }: AdminAnalyticsProps) {
  const totalFromBars = barChartData.reduce((sum, point) => sum + point.count, 0);

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <ChartShell
        title="Monthly activity"
        description="Reusable bar chart loaded dynamically for a lighter dashboard shell."
        icon={BarChart3}
      >
        <BarChartView data={barChartData} />
      </ChartShell>

      <ChartShell
        title="Activity trend"
        description="The same dataset rendered as a line chart to make the trend easier to compare."
        icon={TrendingUp}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Total points</span>
            <Badge variant="secondary">{totalFromBars}</Badge>
          </div>
          <LineChartView data={barChartData} />
        </div>
      </ChartShell>

      <ChartShell
        title="Status mix"
        description="Pie chart derived from the backend status breakdown."
        icon={PieChart}
      >
        <PieChartView data={pieChartData} />
      </ChartShell>
    </div>
  );
}
