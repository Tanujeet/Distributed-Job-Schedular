"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Job } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { Play, Pause, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { pauseJob, resumeJob, deleteJob } from "@/lib/services/jobs";

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

export function JobTable({ jobs: initialJobs }: { jobs: Job[] }) {
  const router = useRouter();
  const [jobs, setJobs] = useState(
    initialJobs.filter((j) => j.status !== "deleted"),
  );
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handlePause = async (id: string) => {
    setLoadingId(id);
    try {
      await pauseJob(id);
      setJobs((prev) =>
        prev.map((j) =>
          j.id === id ? { ...j, status: "paused" as const } : j,
        ),
      );
    } catch (err) {
      console.error("Pause failed:", err);
    } finally {
      setLoadingId(null);
    }
  };

  const handleResume = async (id: string) => {
    setLoadingId(id);
    try {
      await resumeJob(id);
      setJobs((prev) =>
        prev.map((j) =>
          j.id === id ? { ...j, status: "active" as const } : j,
        ),
      );
    } catch (err) {
      console.error("Resume failed:", err);
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setLoadingId(id);
    try {
      await deleteJob(id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
      router.refresh();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-950/50 overflow-x-auto">
      <Table className="min-w-[600px]">
        <TableHeader>
          <TableRow className="border-zinc-800 hover:bg-transparent">
            <TableHead className="text-zinc-400">Job Name</TableHead>
            <TableHead className="text-zinc-400">Status</TableHead>
            {/* Hidden on mobile, visible from md up */}
            <TableHead className="text-zinc-400 hidden md:table-cell">
              Cron
            </TableHead>
            <TableHead className="text-zinc-400 hidden sm:table-cell">
              Last Run
            </TableHead>
            <TableHead className="text-zinc-400 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <MotionTableBody variants={container} initial="hidden" animate="show">
          {jobs.map((job) => {
            const isLoading = loadingId === job.id;
            const isPaused = job.status === "paused";

            return (
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
                  {/* Show cron inline on mobile when column is hidden */}
                  <span className="block md:hidden font-mono text-xs text-zinc-500 mt-0.5">
                    {job.cron}
                  </span>
                </TableCell>

                <TableCell>
                  <StatusBadge status={job.status} />
                </TableCell>

                <TableCell className="hidden md:table-cell font-mono text-xs text-zinc-400 bg-zinc-900 px-2 py-1 rounded w-fit">
                  {job.cron}
                </TableCell>

                <TableCell className="hidden sm:table-cell text-zinc-500 text-sm whitespace-nowrap">
                  {job.lastRun
                    ? new Date(job.lastRun).toLocaleString()
                    : "Never"}
                </TableCell>

                <TableCell className="text-right">
                  {/* Always visible on touch (no hover on mobile), fade in on desktop hover */}
                  <div className="flex justify-end gap-1 sm:opacity-0 sm:group-hover:opacity-100 sm:transition-opacity">
                    {isPaused ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-400 hover:text-emerald-400"
                        onClick={() => handleResume(job.id)}
                        disabled={isLoading}
                        title="Resume job"
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-400 hover:text-amber-400"
                        onClick={() => handlePause(job.id)}
                        disabled={isLoading}
                        title="Pause job"
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Pause className="h-4 w-4" />
                        )}
                      </Button>
                    )}

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-zinc-400 hover:text-rose-400"
                          disabled={isLoading}
                          title="Delete job"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-zinc-900 border-zinc-800 mx-4 sm:mx-auto">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-zinc-100">
                            Delete "{job.name}"?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-zinc-400">
                            This will permanently delete the job and stop all
                            future executions. Past execution history will be
                            preserved.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                          <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 mt-0">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-rose-600 hover:bg-rose-500 text-white"
                            onClick={() => handleDelete(job.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </MotionRow>
            );
          })}
        </MotionTableBody>
      </Table>
    </div>
  );
}
