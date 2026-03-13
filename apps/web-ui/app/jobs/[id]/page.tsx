import { StatusBadge } from "@/components/jobs/StatusBadge";
import { ExecutionTimeline } from "@/components/charts/ExecutionTimeline";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TerminalSquare, Clock, RotateCcw } from "lucide-react";

import { getJobDetails, getJobExecutions } from "@/lib/services/jobs";

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const job = await getJobDetails(id);
  const executions = await getJobExecutions(id);

  return (
    <div className="flex flex-col gap-6 sm:gap-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto text-zinc-50">
      <div className="border-b border-zinc-800 pb-5 sm:pb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold flex flex-wrap items-center gap-2 sm:gap-3">
          {job.name}
          <StatusBadge status={job.status ?? "pending"} />
        </h1>

        <p className="text-zinc-400 mt-2 flex flex-wrap gap-3 sm:gap-4 text-sm font-mono">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4 shrink-0" /> {job.cron}
          </span>

          <span className="flex items-center gap-1">
            <RotateCcw className="w-4 h-4 shrink-0" /> Retries: {job.retryCount}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Payload — full width on mobile, sidebar on lg */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 sm:p-5 h-fit">
          <h3 className="text-base sm:text-lg font-medium flex items-center gap-2 mb-4">
            <TerminalSquare className="w-5 h-5 shrink-0" /> Payload
          </h3>

          <pre className="bg-zinc-950 p-3 sm:p-4 rounded-md text-emerald-400 font-mono text-xs sm:text-sm border border-zinc-800 overflow-x-auto">
            {JSON.stringify(job.payload, null, 2)}
          </pre>
        </div>

        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          <ExecutionTimeline executions={executions} />

          {/* Table — horizontally scrollable on small screens */}
          <div className="rounded-md border border-zinc-800 bg-zinc-900/50 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800">
                  <TableHead className="whitespace-nowrap">Attempt</TableHead>
                  <TableHead className="whitespace-nowrap">
                    Start Time
                  </TableHead>
                  <TableHead className="whitespace-nowrap">Duration</TableHead>
                  <TableHead className="whitespace-nowrap">Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {executions.map((exec: any) => (
                  <TableRow key={exec.id} className="border-zinc-800">
                    <TableCell className="whitespace-nowrap">
                      #{exec.attempt}
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      {new Date(exec.startTime).toLocaleTimeString()}
                    </TableCell>

                    <TableCell className="font-mono whitespace-nowrap">
                      {exec.duration ? `${exec.duration}ms` : "-"}
                    </TableCell>

                    <TableCell>
                      <StatusBadge status={exec.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
