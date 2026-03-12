// app/jobs/create/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, Terminal, AlertCircle } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Job name must be at least 2 characters."),
  cron: z.string().min(5, "Invalid cron expression."),
  payload: z.string().refine((val) => {
    try {
      JSON.parse(val);
      return true;
    } catch {
      return false;
    }
  }, "Must be valid JSON"),
 
  retryCount: z.number().min(0, "Cannot be negative").max(10, "Max 10 retries"),
});
type JobFormValues = z.infer<typeof formSchema>;

export default function CreateJobPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JobFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      cron: "* * * * *",
      payload: "{\n  \n}",
      retryCount: 3,
    },
  });

const onSubmit = async (data: JobFormValues) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        cron_expression: data.cron,
        payload: JSON.parse(data.payload),
        retry_count: data.retryCount,
      }),
    });

    const result = await res.json();

    console.log("Job created:", result);
  } catch (err) {
    console.error("Failed to create job", err);
  }
};

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto p-8 text-zinc-50"
    >
      <div className="mb-8 border-b border-zinc-800 pb-6">
        <h1 className="text-3xl font-semibold flex items-center gap-3">
          <Terminal className="text-zinc-400" /> Create New Job
        </h1>
      </div>

      {/* Pure Native Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-zinc-950 p-6 rounded-lg border border-zinc-800"
      >
        {/* Job Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-zinc-200">
            Job Name
          </Label>
          <Input
            id="name"
            placeholder="e.g. daily-db-backup"
            className="bg-zinc-900 border-zinc-700 focus-visible:ring-emerald-500/50"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-rose-500 text-sm flex items-center gap-1 mt-1">
              <AlertCircle className="w-4 h-4" /> {errors.name.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Cron Field */}
          <div className="space-y-2">
            <Label htmlFor="cron" className="text-zinc-200">
              Cron Expression
            </Label>
            <Input
              id="cron"
              placeholder="0 0 * * *"
              className="bg-zinc-900 border-zinc-700 font-mono focus-visible:ring-emerald-500/50"
              {...register("cron")}
            />
            {errors.cron && (
              <p className="text-rose-500 text-sm flex items-center gap-1 mt-1">
                <AlertCircle className="w-4 h-4" /> {errors.cron.message}
              </p>
            )}
          </div>

          {/* Retry Count Field */}
          <div className="space-y-2">
            <Label htmlFor="retryCount" className="text-zinc-200">
              Retries
            </Label>
            <Input
              id="retryCount"
              type="number"
              min="0"
              max="10"
              className="bg-zinc-900 border-zinc-700 focus-visible:ring-emerald-500/50"
              {...register("retryCount")}
            />
            {errors.retryCount && (
              <p className="text-rose-500 text-sm flex items-center gap-1 mt-1">
                <AlertCircle className="w-4 h-4" /> {errors.retryCount.message}
              </p>
            )}
          </div>
        </div>

        {/* Payload Field */}
        <div className="space-y-2">
          <Label htmlFor="payload" className="text-zinc-200">
            JSON Payload
          </Label>
          <Textarea
            id="payload"
            placeholder='{ "key": "value" }'
            className="bg-zinc-900 border-zinc-700 font-mono h-32 resize-none focus-visible:ring-emerald-500/50"
            {...register("payload")}
          />
          {errors.payload && (
            <p className="text-rose-500 text-sm flex items-center gap-1 mt-1">
              <AlertCircle className="w-4 h-4" /> {errors.payload.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-500 text-white w-full transition-colors"
          disabled={isSubmitting}
        >
          <Save className="w-4 h-4 mr-2" />
          {isSubmitting ? "Deploying..." : "Deploy Job"}
        </Button>
      </form>
    </motion.div>
  );
}
