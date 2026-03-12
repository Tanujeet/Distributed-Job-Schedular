"use client";

import { motion } from "framer-motion";
import { Server } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Worker } from "@/lib/types";

export default function WorkersGrid({ workers }: { workers?: Worker[] }) {
  if (!workers || workers.length === 0) {
    return (
      <div className="p-8 max-w-7xl mx-auto text-zinc-400">
        <h1 className="text-3xl font-semibold text-zinc-200 mb-2">
          Worker Nodes
        </h1>
        <p>No workers currently online.</p>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1 },
  };

  return (
    <div className="p-8 max-w-7xl mx-auto text-zinc-50">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Worker Nodes</h1>
        <p className="text-zinc-400">Manage distributed execution nodes.</p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
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
                <CardTitle className="text-lg font-mono flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Server className="w-5 h-5 text-zinc-500" />
                    {worker.id}
                  </span>

                  <span
                    className={`h-3 w-3 rounded-full ${
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
