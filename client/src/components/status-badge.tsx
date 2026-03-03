import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status }: { status: string }) {
  const getVariants = (s: string) => {
    switch (s.toLowerCase()) {
      case "pending":
        return "bg-warning/20 text-warning hover:bg-warning/30 border-warning/50";
      case "approved":
      case "completed":
      case "delivering":
        return "bg-success/20 text-success hover:bg-success/30 border-success/50";
      case "rejected":
      case "cancelled":
        return "bg-destructive/20 text-destructive hover:bg-destructive/30 border-destructive/50";
      case "accepted":
      case "picking_up":
        return "bg-primary/20 text-primary hover:bg-primary/30 border-primary/50";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const statusMap: Record<string, string> = {
    pending: "قيد الانتظار",
    approved: "تمت الموافقة",
    rejected: "مرفوض",
    accepted: "مقبول",
    picking_up: "جاري الاستلام",
    delivering: "جاري التوصيل",
    completed: "مكتمل",
    cancelled: "ملغي",
  };

  const translateStatus = (s: string) => statusMap[s.toLowerCase()] || s.replace("_", " ");

  return (
    <Badge variant="outline" className={`font-semibold shadow-sm ${getVariants(status)}`}>
      {translateStatus(status)}
    </Badge>
  );
}
