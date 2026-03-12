import { runScheduler } from "./scheduler";
import { tryBecomeLeader } from "./leader";

let schedulerRunning = false;

async function start() {
  while (true) {
    try {
      const leader = await tryBecomeLeader();

      if (leader && !schedulerRunning) {
        console.log("Leader scheduler running");
        schedulerRunning = true;

        runScheduler().catch((err) => {
          console.error("Scheduler crashed:", err);
          schedulerRunning = false;
        });
      }

      await new Promise((r) => setTimeout(r, 5000));
    } catch (err) {
      console.error("scheduler loop error", err);
    }
  }
}

start();
