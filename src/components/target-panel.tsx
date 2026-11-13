import {XIcon} from "@phosphor-icons/react";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Line, LineChart, XAxis, YAxis} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type {HistoryPoint, Status, Target} from "../types";

const STATUS_LABEL: Record<Status, string> = {
  up: "Operational",
  slow: "Slow",
  down: "Down",
};

const STATUS_BADGE: Record<Status, string> = {
  up: "bg-green-500 text-white",
  slow: "bg-yellow-500 text-black",
  down: "bg-red-500 text-white",
};

const chartConfig = {
  latencyMs: {label: "Latency (ms)", color: "#4ade80"},
} satisfies ChartConfig;

type Props = {
  target: Target;
  history: HistoryPoint[];
  onClose: () => void;
};

export function TargetPanel({target, history, onClose}: Props) {
  const uptime = history.length
    ? (history.filter((p) => p.status !== "down").length / history.length) * 100
    : 0;

  return (
    <Card className="absolute right-4 top-4 z-10 w-80">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>{target.name}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Close"
        >
          <XIcon className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        <Badge className={STATUS_BADGE[target.status]}>
          {STATUS_LABEL[target.status]}
        </Badge>
        <div>
          <p className="text-sm text-muted-foreground">Response time</p>
          <p className="text-2xl font-semibold">
            {target.latencyMs !== null ? `${target.latencyMs} ms` : "—"}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Uptime (24h)</p>
          <p className="text-2xl font-semibold">{uptime.toFixed(1)}%</p>
        </div>

        <ChartContainer config={chartConfig} className="h-32 w-full">
          <LineChart data={history}>
            <XAxis
              dataKey="t"
              tickLine={false}
              axisLine={false}
              minTickGap={32}
              tickFormatter={(v) =>
                new Date(v).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }
            />
            <YAxis hide />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              dataKey="latencyMs"
              stroke="var(--color-latencyMs)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
