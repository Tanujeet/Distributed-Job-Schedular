import { fetcher } from "@/lib/fetcher";
import WorkersGrid from "@/components/workers/WorkersGrid";
import { Worker } from "@/lib/types";

export default async function WorkersPage() {
  const data = await fetcher<{ workers: Worker[] }>("/dashboard");

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      <WorkersGrid workers={data.workers} />
    </div>
  );
}
