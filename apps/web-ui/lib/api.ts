const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function fetchJobs() {
  const res = await fetch(`${API_BASE}/api/jobs`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch jobs");
  return res.json();
}

export async function fetchJob(id: string) {
  const res = await fetch(`${API_BASE}/api/jobs/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch job");
  return res.json();
}

export async function fetchExecutions(id: string) {
  const res = await fetch(`${API_BASE}/api/jobs/${id}/executions`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch executions");
  return res.json();
}

export async function pauseJobApi(id: string) {
  const res = await fetch(`${API_BASE}/api/jobs/${id}/pause`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error("Failed to pause job");
  return res.json();
}

export async function resumeJobApi(id: string) {
  const res = await fetch(`${API_BASE}/api/jobs/${id}/resume`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error("Failed to resume job");
  return res.json();
}

export async function deleteJobApi(id: string) {
  const res = await fetch(`${API_BASE}/api/jobs/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete job");
  return res.json();
}
