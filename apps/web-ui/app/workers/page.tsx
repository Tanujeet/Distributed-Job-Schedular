import { fetcher } from "@/lib/fetcher";
import WorkersGrid from "@/components/workers/WorkersGrid";
import { Worker } from "@/lib/types";

export default async function WorkersPage() {
  const data = await fetcher<{ workers: Worker[] }>("/dashboard");
  console.log("DASHBOARD DATA:", data);

  return <WorkersGrid workers={data.workers} />;
}
