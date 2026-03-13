import { Router } from "express";
import {
  createJob,
  getJobs,
  getJob,
  deleteJob,
  pauseJob,
  resumeJob,
  getExecutions,
} from "../controllers/jobs.controllers";

const router = Router();

router.post("/", createJob);
router.get("/", getJobs);

router.get("/:id/executions", getExecutions);
router.get("/:id", getJob);

router.delete("/:id", deleteJob);
router.patch("/:id/pause", pauseJob);
router.patch("/:id/resume", resumeJob);

export default router;
