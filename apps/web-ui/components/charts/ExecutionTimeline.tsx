"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Execution } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

export function ExecutionTimeline({ executions }: { executions: Execution[] }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const data = executions.map((exec) => ({
    name: isMobile ? `#${exec.attempt}` : `Attempt ${exec.attempt}`,
    duration: exec.duration || 0,
    status: exec.status,
  }));

  const getColor = (status: string) =>
    status === "success"
      ? "#10b981"
      : status === "failed"
        ? "#f43f5e"
        : "#f59e0b";

  return (
    <Card className="bg-zinc-950 border-zinc-800">
      <CardHeader className="pb-2 sm:pb-6">
        <CardTitle className="text-base sm:text-lg text-zinc-200">
          Execution Duration
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <div className="h-50 sm:h-62.5 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 10,
                right: isMobile ? 4 : 10,
                left: isMobile ? -28 : -20,
                bottom: 0,
              }}
            >
              <XAxis
                dataKey="name"
                stroke="#52525b"
                fontSize={isMobile ? 10 : 12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#52525b"
                fontSize={isMobile ? 10 : 12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${val}ms`}
                width={isMobile ? 48 : 56}
              />
              <Tooltip
                cursor={{ fill: "#27272a" }}
                contentStyle={{
                  backgroundColor: "#09090b",
                  borderColor: "#27272a",
                  color: "#f4f4f5",
                  fontSize: "12px",
                }}
                formatter={(val) => {
                  const ms =
                    typeof val === "number"
                      ? val
                      : typeof val === "string"
                        ? parseFloat(val)
                        : NaN;
                  return [isNaN(ms) ? "-" : `${ms}ms`, "Duration"];
                }}
              />
              <Bar dataKey="duration" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.status)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
