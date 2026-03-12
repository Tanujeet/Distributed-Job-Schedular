import { AnimatedStatCard } from "@/components/shared/AnimatedStatCard";
import { JobTable } from "@/components/jobs/JobTable";
import { Activity, CheckCircle, Server, XCircle } from "lucide-react";
import { Job } from "@/lib/types";
import { fetcher } from "@/lib/fetcher";

export default async function DashboardPage() {
  const data = await fetcher<{
    jobs: Job[];
    stats: {
      total: number;
      active: number;
      failed: number;
      workers: number;
    };
  }>("/dashboard");

  const { jobs, stats } = data;

  return (
    <div className="flex flex-col gap-8 p-8 max-w-7xl mx-auto text-zinc-50">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Overview</h1>
        <p className="text-zinc-400 mt-1">
          Monitor your distributed cron scheduler system.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AnimatedStatCard
          title="Total Jobs"
          value={stats.total}
          icon={<Activity className="h-4 w-4" />}
        />

        <AnimatedStatCard
          title="Active Jobs"
          value={stats.active}
          icon={<CheckCircle className="h-4 w-4 text-emerald-500" />}
        />

        <AnimatedStatCard
          title="Failed Jobs"
          value={stats.failed}
          icon={<XCircle className="h-4 w-4 text-rose-500" />}
        />

        <AnimatedStatCard
          title="Workers Online"
          value={stats.workers}
          icon={<Server className="h-4 w-4 text-blue-500" />}
        />
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight">Recent Jobs</h2>
        <JobTable jobs={jobs} />
      </div>
    </div>
  );
}
