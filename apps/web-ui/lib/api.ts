const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function fetchJob(id: string) {
  const res = await fetch(`${API_URL}/jobs/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("API ERROR:", res.status, text);
    throw new Error(`Failed to fetch job: ${res.status}`);
  }

  return res.json();
}
export async function fetchExecutions(id: string) {
  const res = await fetch(`${API_URL}/jobs/${id}/executions`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch executions");

  return res.json();
}

export async function fetchJobs() {
  const res = await fetch(`${API_URL}/jobs`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch jobs");
  return res.json();
}