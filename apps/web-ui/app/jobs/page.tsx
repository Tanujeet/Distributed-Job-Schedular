
import { JobTable } from "@/components/jobs/JobTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import Link from "next/link";

import { getJobs } from "@/lib/services/jobs";

export default async function JobsPage() {
  const jobs = await getJobs();

  return (
    <div className="flex flex-col gap-8 p-8 max-w-7xl mx-auto w-full text-zinc-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">All Jobs</h1>
          <p className="text-zinc-400 mt-1">
            Manage, monitor, and configure all your scheduled tasks.
          </p>
        </div>

        <Link href="/jobs/create">
          <Button className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2">
            <Plus className="w-4 h-4" />
            Create New Job
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4 bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />

          <Input
            placeholder="Search jobs by name or ID..."
            className="pl-9 bg-zinc-950 border-zinc-800 text-sm focus-visible:ring-emerald-500/50"
          />
        </div>
      </div>

      {/* Jobs table */}
      <div className="flex flex-col gap-4">
        <JobTable jobs={jobs} />
      </div>
    </div>
  );
}

