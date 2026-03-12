// components/charts/ExecutionTimeline.tsx
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

export function ExecutionTimeline({ executions }: { executions: Execution[] }) {
  const data = executions.map((exec) => ({
    name: `Attempt ${exec.attempt}`,
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
      <CardHeader>
        <CardTitle className="text-zinc-200">Execution Duration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <XAxis
                dataKey="name"
                stroke="#52525b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#52525b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${val}ms`}
              />
              <Tooltip
                cursor={{ fill: "#27272a" }}
                contentStyle={{
                  backgroundColor: "#09090b",
                  borderColor: "#27272a",
                  color: "#f4f4f5",
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
