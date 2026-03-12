"use client";

import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Job } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import Link from "next/link";

const MotionTableBody = motion(TableBody);
const MotionRow = motion(TableRow);

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
};

export function JobTable({ jobs }: { jobs: Job[] }) {
  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-950/50">
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-800 hover:bg-transparent">
            <TableHead className="text-zinc-400">Job Name</TableHead>
            <TableHead className="text-zinc-400">Status</TableHead>
            <TableHead className="text-zinc-400">Cron</TableHead>
            <TableHead className="text-zinc-400">Last Run</TableHead>
            <TableHead className="text-zinc-400 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <MotionTableBody variants={container} initial="hidden" animate="show">
          {jobs.map((job) => (
            <MotionRow
              key={job.id}
              variants={item}
              className="border-zinc-800 group hover:bg-zinc-900/50"
            >
              <TableCell className="font-medium">
                <Link
                  href={`/jobs/${job.id}`}
                  className="hover:text-emerald-400 transition-colors text-zinc-200"
                >
                  {job.name}
                </Link>
              </TableCell>

              <TableCell>
                <StatusBadge status={job.status} />
              </TableCell>

              <TableCell className="font-mono text-xs text-zinc-400 bg-zinc-900 px-2 py-1 rounded w-fit inline-block mt-2">
                {job.cron}
              </TableCell>

              <TableCell className="text-zinc-500 text-sm">
                {job.lastRun ? new Date(job.lastRun).toLocaleString() : "Never"}
              </TableCell>

              <TableCell className="text-right">
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-zinc-400 hover:text-emerald-400"
                  >
                    <Play className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-zinc-400 hover:text-amber-400"
                  >
                    <Pause className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </MotionRow>
          ))}
        </MotionTableBody>
      </Table>
    </div>
  );
}
