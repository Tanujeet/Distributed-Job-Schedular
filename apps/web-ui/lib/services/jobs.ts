import {
  fetchJob,
  fetchExecutions,
  fetchJobs,
  pauseJobApi,
  resumeJobApi,
  deleteJobApi,
} from "../api";
import { mapJob, mapExecution } from "../mappers";

export async function getJobDetails(id: string) {
  const apiJob = await fetchJob(id);
  return mapJob(apiJob);
}

export async function getJobExecutions(id: string) {
  const apiExecutions = await fetchExecutions(id);
  return apiExecutions.map(mapExecution);
}

export async function getJobs() {
  const apiJobs = await fetchJobs();
  return apiJobs.map(mapJob);
}

export async function pauseJob(id: string) {
  return pauseJobApi(id);
}

export async function resumeJob(id: string) {
  return resumeJobApi(id);
}

export async function deleteJob(id: string) {
  return deleteJobApi(id);
}
