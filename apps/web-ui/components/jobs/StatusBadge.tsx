import { Badge } from "@/components/ui/badge";
import { JobStatus } from "@/lib/types";
import {
  CheckCircle2,
  CircleDashed,
  XCircle,
  Clock,
  PauseCircle,
  Trash2,
} from "lucide-react";

const statusConfig = {
  active: {
    color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    icon: CheckCircle2,
    label: "Active",
  },
  paused: {
    color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    icon: PauseCircle,
    label: "Paused",
  },
  deleted: {
    color: "bg-zinc-500/10 text-zinc-500 border-zinc-600/20",
    icon: Trash2,
    label: "Deleted",
  },
  success: {
    color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    icon: CheckCircle2,
    label: "Success",
  },
  running: {
    color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    icon: CircleDashed,
    label: "Running",
  },
  failed: {
    color: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    icon: XCircle,
    label: "Failed",
  },
  pending: {
    color: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    icon: Clock,
    label: "Pending",
  },
};

export function StatusBadge({ status }: { status?: JobStatus }) {
  const config =
    statusConfig[status as keyof typeof statusConfig] ?? statusConfig.pending;
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={`gap-1.5 font-medium border ${config.color}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </Badge>
  );
}
