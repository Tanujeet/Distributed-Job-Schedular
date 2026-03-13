"use client";

import { motion } from "framer-motion";
import { Server } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Worker } from "@/lib/types";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1 },
};

export default function WorkersGrid({ workers }: { workers?: Worker[] }) {
  if (!workers || workers.length === 0) {
    return (
      <div className="text-zinc-400">
        <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-200 mb-2">
          Worker Nodes
        </h1>
        <p>No workers currently online.</p>
      </div>
    );
  }

  return (
    <div className="text-zinc-50">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold">Worker Nodes</h1>
        <p className="text-zinc-400 text-sm sm:text-base">
          Manage distributed execution nodes.
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
      >
        {workers.map((worker) => (
          <motion.div key={worker.id} variants={item}>
            <Card className="bg-zinc-900 border-zinc-800 relative overflow-hidden">
              <div
                className={`absolute top-0 left-0 w-full h-1 ${
                  worker.status === "online" ? "bg-emerald-500" : "bg-rose-500"
                }`}
              />

              <CardHeader className="pb-2">
                <CardTitle className="text-base sm:text-lg font-mono flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 min-w-0">
                    <Server className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-500 shrink-0" />
                    <span className="truncate">{worker.id}</span>
                  </span>

                  <span
                    className={`h-3 w-3 rounded-full shrink-0 ${
                      worker.status === "online"
                        ? "bg-emerald-500"
                        : "bg-rose-500"
                    }`}
                  />
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 mt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Executing</span>
                  <span>{worker.jobsExecuting ?? 0}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Uptime</span>
                  <span className="font-mono">{worker.uptime ?? "0s"}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}