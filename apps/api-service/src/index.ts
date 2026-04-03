import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dashboardRoutes from "./routes/dashboard.routes";
import jobRoutes from "./routes/jobs";
import workersRoutes from "./routes/workers.routes";

dotenv.config();

console.log("SERVER BOOTING...");
console.log("PORT:", process.env.PORT);

const app = express();

app.use(cors());
app.use(express.json());

app.use("/jobs", jobRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/workers", workersRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
