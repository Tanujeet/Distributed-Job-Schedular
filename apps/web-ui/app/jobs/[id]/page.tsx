
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
    <div className="flex flex-col gap-8 p-8 max-w-7xl mx-auto text-zinc-50">
      <div className="border-b border-zinc-800 pb-6">
        <h1 className="text-3xl font-semibold flex items-center gap-3">
          {job.name}
          <StatusBadge status={job.status ?? "pending"} />
        </h1>

        <p className="text-zinc-400 mt-2 flex gap-4 text-sm font-mono">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" /> {job.cron}
          </span>

          <span className="flex items-center gap-1">
            <RotateCcw className="w-4 h-4" /> Retries: {job.retryCount}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 h-fit">
          <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
            <TerminalSquare className="w-5 h-5" /> Payload
          </h3>

          <pre className="bg-zinc-950 p-4 rounded-md text-emerald-400 font-mono text-sm border border-zinc-800 overflow-x-auto">
            {JSON.stringify(job.payload, null, 2)}
          </pre>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <ExecutionTimeline executions={executions} />

          <div className="rounded-md border border-zinc-800 bg-zinc-900/50">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800">
                  <TableHead>Attempt</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {executions.map((exec: any) => (
                  <TableRow key={exec.id} className="border-zinc-800">
                    <TableCell>#{exec.attempt}</TableCell>

                    <TableCell>
                      {new Date(exec.startTime).toLocaleTimeString()}
                    </TableCell>

                    <TableCell className="font-mono">
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

