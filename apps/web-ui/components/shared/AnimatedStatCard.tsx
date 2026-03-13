"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface Props {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
}

export function AnimatedStatCard({ title, value, icon, trend }: Props) {
  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="bg-zinc-950 border-zinc-800 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-zinc-400">
            {title}
          </CardTitle>
          <div className="text-zinc-500 shrink-0">{icon}</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl sm:text-3xl font-bold text-zinc-100 tabular-nums">
            {value}
          </div>
          {trend && <p className="text-xs text-zinc-500 mt-1">{trend}</p>}
        </CardContent>
      </Card>
    </motion.div>
  );
}
